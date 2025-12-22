"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow, detectBot } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchema";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 3,
    })
  );

export async function editCourse(
  data: CourseSchemaType,
  courseId: string
): Promise<APIResponse> {
  const user = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: user.user.id });

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

    const result = courseSchema.safeParse(data);

    if (!result.success) {
      return {
        status: "error",
        message: "Datos del formulario inválidos",
      };
    }

    await prisma.course.update({
      where: {
        id: courseId,
        userId: user.user.id,
      },
      data: {
        ...result.data,
      },
    });

    return {
      status: "success",
      message: "Curso actualizado correctamente",
    };
  } catch {
    return {
      status: "error",
      message: "Error al actualizar el curso",
    };
  }
}

export async function reorderLessons(
  chapterId: string,
  lessons: {
    id: string;
    position: number;
  }[],
  courseId: string
): Promise<APIResponse> {
  await requireAdmin();
  try {
    if (!lessons || lessons.length === 0) {
      return {
        status: "error",
        message: "No se proporcionaron lecciones para reordenar",
      };
    }

    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: {
          id: lesson.id,
          chapterId: chapterId,
        },
        data: {
          position: lesson.position,
        },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lecciones reordenadas de forma exitosa",
    };
  } catch {
    return {
      status: "error",
      message: "Error al reordenar las lecciones",
    };
  }
}

export async function reorderChapters(
  courseId: string,
  chapters: {
    id: string;
    position: number;
  }[]
): Promise<APIResponse> {
  await requireAdmin();
  try {
    if (!chapters || chapters.length === 0) {
      return {
        status: "error",
        message: "No se proporcionaron capítulos para reordenar",
      };
    }

    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: {
          id: chapter.id,
          courseId: courseId,
        },
        data: {
          position: chapter.position,
        },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Capítulos reordenados de forma exitosa",
    };
  } catch {
    return {
      status: "error",
      message: "Error al reordenar los capítulos",
    };
  }
}
