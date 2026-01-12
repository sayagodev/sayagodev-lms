"use client";

import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useCourseSidebar } from "./CourseSidebarContext";
import { useSidebar } from "@/components/ui/sidebar";

export function CourseSidebarTrigger() {
  const { setOpen } = useCourseSidebar();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleClick = () => {
    setOpen(true);
    // Cerrar el sidebar del Dashboard si está abierto en móvil
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Button
      variant="ghost"
      className="h-auto py-1.5 px-2 -ml-1 md:hidden"
      onClick={handleClick}
    >
      <BookOpen className="size-4 mr-2" />
      <span className="text-sm font-medium">Capítulos</span>
    </Button>
  );
}
