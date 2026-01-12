"use client";

import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useSidebar } from "@/components/ui/sidebar";
import { ChevronDown, PlayIcon } from "lucide-react";
import { LessonItem } from "./LessonItem";
import { usePathname } from "next/navigation";
import { useCourseProgress } from "@/hooks/use-couse-progress";
import { useCourseSidebar } from "./CourseSidebarContext";
import { useEffect } from "react";

interface iAppProps {
  course: CourseSidebarDataType["course"];
}

export function CourseSidebar({ course }: iAppProps) {
  const pathname = usePathname();
  const currentLessonId = pathname.split("/").pop();
  const { open, setOpen } = useCourseSidebar();
  const { isMobile: isDashboardMobile, setOpenMobile: setDashboardOpenMobile } =
    useSidebar();

  // Cerrar el sidebar del Dashboard cuando se abre el drawer del curso en móvil
  useEffect(() => {
    if (open && isDashboardMobile) {
      setDashboardOpenMobile(false);
    }
  }, [open, isDashboardMobile, setDashboardOpenMobile]);

  const { totalLessons, completedLessons, progressPercentage } =
    useCourseProgress({
      courseData: course,
    });

  const sidebarContent = (isMobile: boolean = false) => (
    <div className="flex flex-col h-full w-full min-w-0">
      <div
        className={`pb-4 pr-4 border-b border-border min-w-0 ${
          isMobile ? "pt-4 pl-4" : ""
        }`}
      >
        <div className="flex items-center gap-3 mb-3 min-w-0">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <PlayIcon className="size-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-base leading-tight truncate mr-3">
              {course.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {course.category}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progreso</span>
            <span className="font-medium">
              {completedLessons}/{totalLessons} lecciones
            </span>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
          <p className="text-xs text-muted-foreground">
            {progressPercentage}% completado
          </p>
        </div>
      </div>

      <div
        className={`py-4 pr-4 space-y-3 overflow-y-auto flex-1 min-w-0 ${
          isMobile ? "pl-4" : ""
        }`}
      >
        {course.chapters.map((chapter, index) => (
          <Collapsible key={chapter.id} defaultOpen={index === 0}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full p-3 h-auto flex items-center gap-2 min-w-0"
              >
                <div className="shrink-0">
                  <ChevronDown className="size-4 text-primary" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold text-sm truncate text-foreground">
                    {chapter.position}: {chapter.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium truncate">
                    {chapter.lessons.length} lecciones
                  </p>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 pl-6 border-l-2 space-y-3 min-w-0">
              {chapter.lessons.map((lesson) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  slug={course.slug}
                  isActive={currentLessonId === lesson.id}
                  completed={
                    lesson.lessonProgress.find(
                      (progress) => progress.lessonId === lesson.id
                    )?.completed || false
                  }
                  onLessonClick={() => setOpen(false)}
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Drawer para móvil/tablet (menor a md) - se desliza desde la izquierda */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-[18rem] p-0 overflow-hidden md:hidden"
        >
          <div className="h-full overflow-y-auto">{sidebarContent(true)}</div>
        </SheetContent>
      </Sheet>

      {/* Sidebar fijo para desktop (md y mayores) - 30% del ancho */}
      <div className="hidden md:flex md:w-[30%] md:border-r md:border-border md:shrink-0 md:overflow-hidden">
        {sidebarContent(false)}
      </div>
    </>
  );
}
