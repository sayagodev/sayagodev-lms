import { EmptyState } from "@/components/general/EmptyState";
import { getAllCourses } from "../data/course/get-all-courses";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import { PublicCourseCard } from "../(web)/_components/PublicCourseCard";
import Link from "next/link";
import { CourseProgressCard } from "./_components/CourseProgressCard";

export default async function DashbordPage() {
  const [courses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Cursos Inscritos</h1>
        <p className="text-muted-foreground">
          Aquí puedes ver los cursos en los que estás inscrito.
        </p>
      </div>

      {enrolledCourses.length === 0 ? (
        <EmptyState
          title="No hay cursos comprados"
          description="No hay cursos en los que estás inscrito."
          buttonText="Ver cursos"
          href="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolledCourses.map((course) => (
            <CourseProgressCard key={course.course.id} data={course} />
          ))}
        </div>
      )}

      <section className="mt-10">
        <div className="flex flex-col gap-2 mb-5">
          <h1 className="text-3xl font-bold">Cursos Disponibles</h1>
          <p className="text-muted-foreground">
            Aquí puedes ver los cursos disponibles para inscribirte.
          </p>
        </div>

        {courses.filter(
          (course) =>
            !enrolledCourses.some(
              ({ course: enrolled }) => enrolled.id === course.id
            )
        ).length === 0 ? (
          <EmptyState
            title="No hay cursos disponibles"
            description="Estás inscrito en todos los cursos disponibles."
            buttonText="Ver cursos"
            href="/courses"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses
              .filter(
                (course) =>
                  !enrolledCourses.some(
                    ({ course: enrolled }) => enrolled.id === course.id
                  )
              )
              .map((course) => (
                <PublicCourseCard key={course.id} data={course} />
              ))}
          </div>
        )}
      </section>
    </>
  );
}
