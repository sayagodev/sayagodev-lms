"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function MarkLessonComplete(
  lessonId: string,
  slug: string
): Promise<APIResponse> {
  const session = await requireUser();

  let completed;
  const isCompleted = await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId: session.id,
        lessonId: lessonId,
      },
    },
    select: {
      completed: true,
    },
  });

  if (isCompleted) {
    completed = !isCompleted.completed;
  } else {
    completed = true;
  }

  try {
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.id,
          lessonId: lessonId,
        },
      },
      update: {
        completed: completed,
      },
      create: {
        lessonId: lessonId,
        userId: session.id,
        completed: completed,
      },
    });

    revalidatePath(`/dashboard/${slug}`);

    return {
      status: "success",
      message: "Progreso actualizado",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Error al marcar la lección como completada",
    };
  }
}
