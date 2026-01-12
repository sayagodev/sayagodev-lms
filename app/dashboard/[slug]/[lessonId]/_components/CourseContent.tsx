"use client";

import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { constructUrl } from "@/hooks/construct-url";
import { BookIcon, CheckCircle, Loader2Icon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { MarkLessonComplete } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { useConfetti } from "@/hooks/use-confetti";

interface iAppProps {
  data: LessonContentType;
}

export function CourseContent({ data }: iAppProps) {
  const [pending, startTransition] = useTransition();
  const { triggerConfetti } = useConfetti();
  
  // Manejar el caso cuando no hay progreso registrado
  const lessonProgress = data.lessonProgress[0];
  const isCompleted = lessonProgress?.completed ?? false;

  function VideoPlayer({
    thumbnailKey,
    videoKey,
  }: {
    thumbnailKey: string;
    videoKey: string;
  }) {
    const videoUrl = constructUrl(videoKey);
    const thumbnailUrl = constructUrl(thumbnailKey);

    if (!videoKey) {
      return (
        <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
          <BookIcon className="size-16 mx-auto mb-4 text-primary" />
          <p>Está lección no tiene video aún</p>
        </div>
      );
    }

    return (
      <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
        <video
          className="w-full h-full object-cover"
          controls
          poster={thumbnailUrl}
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/ogg" />
          Tu navegador no soporta el elemento video.
        </video>
      </div>
    );
  }

  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        MarkLessonComplete(data.id, data.chapter.course.slug)
      );

      if (error) {
        console.log(error);
        toast.error(
          "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
        );
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        if (!isCompleted) {
          triggerConfetti();
        }
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <div className="flex flex-col h-full bg-background mt-4 md:pl-4 md:mt-0">
      <VideoPlayer
        thumbnailKey={data.thumbnailKey ?? ""}
        videoKey={data.videoKey ?? ""}
      />
      <div className="py-4 border-b">
        {isCompleted ? (
          <Button
            variant="outline"
            className="bg-green-500/10 text-green-500 hover:text-green-600"
            onClick={onSubmit}
          >
            {pending ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                <span className="truncate">Desmarcando como completado...</span>
              </>
            ) : (
              <>
                <CheckCircle className="size-4 mr-2 text-green-500" />
                Completado
              </>
            )}
          </Button>
        ) : (
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={onSubmit}
            disabled={pending}
          >
            {pending ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                <span className="truncate">Marcando como completado...</span>
              </>
            ) : (
              <>
                <CheckCircle className="size-4 mr-2 text-green-500" />
                Marcar como completado
              </>
            )}
          </Button>
        )}
      </div>

      <div className="space-y-3 pt-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {data.title}
        </h1>
        {data.description && (
          <RenderDescription json={JSON.parse(data.description)} />
        )}
      </div>
    </div>
  );
}
