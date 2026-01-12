import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { redirect } from "next/navigation";

interface iAppProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseSlugRoute({ params }: iAppProps) {
  const { slug } = await params;
  const course = await getCourseSidebarData(slug);

  const chapters = course.course.chapters;
  const firstChapter = chapters && chapters.length > 0 ? chapters[0] : null;
  const firstLesson =
    firstChapter?.lessons && firstChapter.lessons.length > 0
      ? firstChapter.lessons[0]
      : null;

  if (firstLesson) {
    redirect(`/dashboard/${slug}/${firstLesson.id}`);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-2xl font-bold mb-2">No hay lecciones disponibles</h2>
      <p className="text-muted-foreground">
        Este curso no tiene ninguna lección disponible
      </p>
    </div>
  );
}
