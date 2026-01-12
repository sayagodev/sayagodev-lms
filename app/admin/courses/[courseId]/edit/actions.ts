"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import {
  chapterSchema,
  ChapterSchemaType,
  courseSchema,
  CourseSchemaType,
  lessonSchema,
  LessonSchemaType,
} from "@/lib/zodSchema";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import { deleteS3File, deleteS3Files } from "@/lib/s3-utils";

const aj = arcjet.withRule(
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

    // Obtener el curso actual para comparar fileKey
    const currentCourse = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId: user.user.id,
      },
      select: {
        fileKey: true,
      },
    });

    await prisma.course.update({
      where: {
        id: courseId,
        userId: user.user.id,
      },
      data: {
        ...result.data,
      },
    });

    // Eliminar el archivo anterior de S3 si se cambió el fileKey
    if (currentCourse && currentCourse.fileKey !== result.data.fileKey) {
      await deleteS3File(currentCourse.fileKey);
    }

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

export async function createChapter(
  values: ChapterSchemaType
): Promise<APIResponse> {
  await requireAdmin();

  try {
    const result = chapterSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Datos del formulario inválidos",
      };
    }

    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.chapter.findFirst({
        where: {
          courseId: result.data.courseId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      await tx.chapter.create({
        data: {
          title: result.data.name,
          courseId: result.data.courseId,
          position: (maxPos?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Capítulo creado correctamente",
    };
  } catch {
    return {
      status: "error",
      message: "Error al crear el capítulo",
    };
  }
}

export async function createLesson(
  values: LessonSchemaType
): Promise<APIResponse> {
  await requireAdmin();

  try {
    const result = lessonSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Datos del formulario inválidos",
      };
    }

    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.lesson.findFirst({
        where: {
          chapterId: result.data.chapterId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      await tx.lesson.create({
        data: {
          title: result.data.name,
          description: result.data.description,
          videoKey: result.data.videoKey,
          thumbnailKey: result.data.thumbnailKey,
          chapterId: result.data.chapterId,
          position: (maxPos?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Lección creada correctamente",
    };
  } catch {
    return {
      status: "error",
      message: "Error al crear la lección",
    };
  }
}

export async function deleteLesson({
  chapterId,
  courseId,
  lessonId,
}: {
  chapterId: string;
  courseId: string;
  lessonId: string;
}): Promise<APIResponse> {
  await requireAdmin();

  try {
    const chapterWithLessons = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
      select: {
        lessons: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
            thumbnailKey: true,
            videoKey: true,
          },
        },
      },
    });

    if (!chapterWithLessons) {
      return {
        status: "error",
        message: "Lección no encontrada",
      };
    }

    const lessons = chapterWithLessons.lessons;
    const lessonToDelete = lessons.find((lesson) => lesson.id === lessonId);

    if (!lessonToDelete) {
      return {
        status: "error",
        message: "Lección no encontrada o no pertenece a este capítulo",
      };
    }

    const remainingLessons = lessons.filter((lesson) => lesson.id !== lessonId);

    const updates = remainingLessons.map((lesson, index) => {
      return prisma.lesson.update({
        where: {
          id: lesson.id,
        },
        data: {
          position: index + 1,
        },
      });
    });

    // Eliminar la lección de la base de datos
    await prisma.$transaction([
      ...updates,
      prisma.lesson.delete({
        where: {
          id: lessonId,
          chapterId: chapterId,
        },
      }),
    ]);

    // Eliminar archivos de S3 después de eliminar de la base de datos
    await deleteS3Files([lessonToDelete.thumbnailKey, lessonToDelete.videoKey]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lección eliminada correctamente",
    };
  } catch {
    return {
      status: "error",
      message: "Error al eliminar la lección",
    };
  }
}

export async function deleteChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}): Promise<APIResponse> {
  await requireAdmin();

  try {
    const courseWithChapters = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        chapters: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!courseWithChapters) {
      return {
        status: "error",
        message: "Curso no encontrado",
      };
    }

    const chapters = courseWithChapters.chapters;
    const chapterToDelete = chapters.find(
      (chapter) => chapter.id === chapterId
    );

    if (!chapterToDelete) {
      return {
        status: "error",
        message: "Capítulo no encontrado o no pertenece a este curso",
      };
    }

    const remainingChapters = chapters.filter(
      (chapter) => chapter.id !== chapterId
    );

    const updates = remainingChapters.map((chapter, index) => {
      return prisma.chapter.update({
        where: {
          id: chapter.id,
        },
        data: {
          position: index + 1,
        },
      });
    });

    await prisma.$transaction([
      ...updates,
      prisma.chapter.delete({
        where: {
          id: chapterId,
        },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Capítulo eliminado correctamente",
    };
  } catch {
    return {
      status: "error",
      message: "Error al eliminar el capítulo",
    };
  }
}
