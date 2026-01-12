"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CourseSidebarContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CourseSidebarContext = createContext<CourseSidebarContextType | null>(
  null
);

export function CourseSidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <CourseSidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </CourseSidebarContext.Provider>
  );
}

export function useCourseSidebar() {
  const context = useContext(CourseSidebarContext);
  if (!context) {
    throw new Error(
      "useCourseSidebar must be used within CourseSidebarProvider"
    );
  }
  return context;
}
