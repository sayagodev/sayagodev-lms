"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchema";
import { deleteS3Files } from "@/lib/s3-utils";

export async function updateLesson(
  values: LessonSchemaType,
  lessonId: string
): Promise<APIResponse> {
  await requireAdmin();

  try {
    const result = lessonSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Información invalida",
      };
    }

    // Obtener la lección actual para comparar archivos
    const currentLesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
      select: {
        thumbnailKey: true,
        videoKey: true,
      },
    });

    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        title: result.data.name,
        description: result.data.description,
        thumbnailKey: result.data.thumbnailKey,
        videoKey: result.data.videoKey,
      },
    });

    // Eliminar archivos antiguos de S3 si se cambiaron
    const filesToDelete: (string | null | undefined)[] = [];
    
    if (
      currentLesson &&
      currentLesson.thumbnailKey &&
      currentLesson.thumbnailKey !== result.data.thumbnailKey
    ) {
      filesToDelete.push(currentLesson.thumbnailKey);
    }

    if (
      currentLesson &&
      currentLesson.videoKey &&
      currentLesson.videoKey !== result.data.videoKey
    ) {
      filesToDelete.push(currentLesson.videoKey);
    }

    if (filesToDelete.length > 0) {
      await deleteS3Files(filesToDelete);
    }

    return {
      status: "success",
      message: "Curso editado correctamente",
    };
  } catch {
    return {
      status: "error",
      message: "Error al editar el curso",
    };
  }
}
