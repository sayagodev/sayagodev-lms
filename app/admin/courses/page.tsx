import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function CoursesPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tus Cursos</h1>

        <Link className={buttonVariants()} href="/admin/courses/create">
          Crear Curso
        </Link>
      </div>

      <div>
        <h1>Here you will see all of the courses</h1>
      </div>
    </>
  );
}
