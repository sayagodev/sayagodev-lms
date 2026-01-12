import { getLessonContent } from "@/app/data/course/get-lesson-content";
import { CourseContent } from "./_components/CourseContent";
import { Suspense } from "react";
import { LessonSkeleton } from "./_components/LessonSkeleton";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { constructUrl } from "@/hooks/construct-url";
import { generateMetadata as createMetadata } from "@/lib/metadata";

type Params = Promise<{ slug: string; lessonId: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<ReturnType<typeof createMetadata>> {
  const { slug, lessonId } = await params;

  // Obtener datos de la lección y curso
  const [lessonData, courseData] = await Promise.all([
    getLessonContent(lessonId),
    getCourseSidebarData(slug),
  ]);

  const course = courseData.course;
  const thumbnailUrl = lessonData.thumbnailKey
    ? constructUrl(lessonData.thumbnailKey)
    : constructUrl(course.fileKey);

  return createMetadata({
    title: `${lessonData.title} - ${course.title}`,
    description:
      lessonData.description?.substring(0, 160) ||
      `Aprende ${lessonData.title} en el curso ${course.title}`,
    image: thumbnailUrl,
    url: `/dashboard/${slug}/${lessonId}`,
    type: "article",
    noindex: true, // No indexar contenido privado
  });
}

export default async function LessonContentPage({
  params,
}: {
  params: Params;
}) {
  const { lessonId } = await params;
  return (
    <Suspense fallback={<LessonSkeleton />}>
      <LessonContentLoader lessonId={lessonId} />
    </Suspense>
  );
}

async function LessonContentLoader({ lessonId }: { lessonId: string }) {
  const data = await getLessonContent(lessonId);

  return <CourseContent data={data} />;
}
