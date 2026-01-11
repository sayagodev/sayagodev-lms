"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchema";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { stripe } from "@/lib/stripe";
import { useConstructUrl } from "@/hooks/use-construct-url";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 3,
  })
);

export async function CreateCourse(
  values: CourseSchemaType
): Promise<APIResponse> {
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

    const validation = courseSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Datos del formulario inválidos",
      };
    }

    const imageUrl = useConstructUrl(validation.data.fileKey);
    const data = await stripe.products.create({
      images: [imageUrl],
      name: validation.data.title,
      description: validation.data.smallDescription,
      default_price_data: {
        currency: "usd",
        unit_amount: validation.data.price * 100,
      },
    });

    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session?.user.id as string,
        stripePriceId: data.default_price as string,
      },
    });

    return {
      status: "success",
      message: "Curso creado correctamente",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Error al crear el curso",
    };
  }
}
