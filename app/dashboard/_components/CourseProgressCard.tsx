"use client";

import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { useCourseProgress } from "@/hooks/use-couse-progress";
import { SchoolIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: EnrolledCourseType;
}

export function CourseProgressCard({ data }: iAppProps) {
  const thumbnailUrl = useConstructUrl(data.course.fileKey);
  const { totalLessons, completedLessons, progressPercentage } =
    useCourseProgress({ courseData: data.course as any });

  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10">{data.course.level}</Badge>
      <Image
        src={thumbnailUrl}
        alt="Thumbnail Image for the course"
        width={600}
        height={400}
        className="w-full rounded-t-xl aspect-video h-full object-cover"
      />
      <CardContent className="p-4">
        <Link
          href={`/dashboard/${data.course.slug}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.course.title}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
          {data.course.smallDescription}
        </p>

        <div className="space-y-4 mt-5">
          <div className=" flex justify-between mb-1 text-sm">
            <p>Progreso:</p>
            <p className="font-medium">{progressPercentage}%</p>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">
            {completedLessons} de {totalLessons} lecciones
          </p>
        </div>

        <Link
          href={`/dashboard/${data.course.slug}`}
          className={buttonVariants({ className: "w-full mt-4" })}
        >
          Aprender más
        </Link>
      </CardContent>
    </Card>
  );
}

export function PublicCourseCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10">
        <Skeleton className="h-6 w-14 rounded-md" />
      </div>
      <Skeleton className="w-full rounded-t-xl aspect-video h-full" />

      <CardContent className="p-4">
        <Skeleton className="w-3/4 h-6 mb-2 rounded" />
        <div className="space-y-2 mt-2">
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-2/3 h-4 rounded" />
        </div>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-10 rounded" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
        </div>
        <Skeleton className="w-full h-10 rounded mt-4" />
      </CardContent>
    </Card>
  );
}
