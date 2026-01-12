import { EmptyState } from "@/components/general/EmptyState";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { adminGetEnrollmentStats } from "../data/admin/admin-get-enrollment-stats";
import { adminGetRecentCourses } from "../data/admin/admin-get-recent-courses";
import {
  AdminCourseCard,
  AdminCourseCardSkeleton,
} from "./courses/_components/AdminCourseCard";

export default async function AdminIndexPage() {
  const enrollmentData = await adminGetEnrollmentStats();
  return (
    <>
      <SectionCards />
      <ChartAreaInteractive data={enrollmentData} />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Cursos recientes</h2>
          <Link
            href="/admin/courses"
            className={buttonVariants({ variant: "outline" })}
          >
            Ver todos los cursos
          </Link>
        </div>
        <Suspense fallback={<RenderRecentCoursesSkeletonLayout />}>
          <RenderRecentCourses />
        </Suspense>
      </div>
    </>
  );
}

async function RenderRecentCourses() {
  const data = await adminGetRecentCourses();

  if (data.length === 0) {
    return (
      <EmptyState
        title="No hay cursos"
        buttonText="Crear nuevo curso"
        description="Crea un nuevo curso para empezar."
        href="/admin/courses/create"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((course) => (
        <AdminCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function RenderRecentCoursesSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
