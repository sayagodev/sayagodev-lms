"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { APIResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import { deleteS3Files } from "@/lib/s3-utils";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 3,
  })
);

export async function deleteCourse(courseId: string): Promise<APIResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: session.user.id });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message:
            "Haz sido bloqueado por exceso de solicitudes. Por favor, inténtalo de nuevo más tarde.",
        };
      } else {
        return {
          status: "error",
          message:
            "Haz sido bloqueado por ser un bot. Si esto es un error, por favor, contacta al soporte.",
        };
      }
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        stripePriceId: true,
        fileKey: true,
        chapters: {
          select: {
            lessons: {
              select: {
                thumbnailKey: true,
                videoKey: true,
              },
            },
          },
        },
      },
    });

    if (!course?.stripePriceId) {
      throw new Error("Este cursor no tiene asociado un stripe_price");
    }

    const { product: productId } = await stripe.prices.retrieve(
      course.stripePriceId
    );

    if (typeof productId === "string") {
      await stripe.products.update(productId, { active: false });
    }

    // Recopilar todas las claves de archivos a eliminar
    const filesToDelete: (string | null | undefined)[] = [course.fileKey];

    course.chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        filesToDelete.push(lesson.thumbnailKey);
        filesToDelete.push(lesson.videoKey);
      });
    });

    // Eliminar el curso de la base de datos
    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    // Eliminar archivos de S3 después de eliminar de la base de datos
    await deleteS3Files(filesToDelete);

    revalidatePath(`/admin/courses/`);

    return {
      status: "success",
      message: "El curso se eliminó exitosamente",
    };
  } catch {
    return {
      status: "error",
      message: "Error al eliminar el curso",
    };
  }
}
