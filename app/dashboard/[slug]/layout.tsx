import { ReactNode } from "react";
import { CourseSidebar } from "../_components/CourseSidebar";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { CourseSidebarProvider } from "../_components/CourseSidebarContext";
import { CourseSidebarTrigger } from "../_components/CourseSidebarTrigger";
import { Separator } from "@/components/ui/separator";

interface iAppProps {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}

export default async function CourseLayout({ params, children }: iAppProps) {
  const { slug } = await params;

  // Server-side security check and lightweight data fetching
  const course = await getCourseSidebarData(slug);
  return (
    <CourseSidebarProvider>
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Header con trigger para móvil */}
        <header className="flex h-12 shrink-0 items-center gap-2 border-b md:hidden">
          <div className="flex w-full items-center gap-1 px-4">
            <CourseSidebarTrigger />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <h1 className="text-base font-medium truncate">
              {course.course.title}
            </h1>
          </div>
        </header>

        {/* Sidebar - se renderiza dentro del componente CourseSidebar */}
        <CourseSidebar course={course.course} />

        {/* Main content - 70% */}
        <div className="flex-1 overflow-hidden min-w-0 md:w-[70%]">
          {children}
        </div>
      </div>
    </CourseSidebarProvider>
  );
}
