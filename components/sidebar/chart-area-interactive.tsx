"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";

export const description = "An interactive area chart";

const dummyEnrollmentsData = [
  { date: "2025-12-12", enrollments: 2 },
  { date: "2025-12-13", enrollments: 27 },
  { date: "2025-12-14", enrollments: 21 },
  { date: "2025-12-15", enrollments: 22 },
  { date: "2025-12-16", enrollments: 17 },
  { date: "2025-12-17", enrollments: 13 },
  { date: "2025-12-18", enrollments: 19 },
  { date: "2025-12-19", enrollments: 14 },
  { date: "2025-12-20", enrollments: 11 },
  { date: "2025-12-21", enrollments: 16 },
  { date: "2025-12-22", enrollments: 20 },
  { date: "2025-12-23", enrollments: 26 },
  { date: "2025-12-24", enrollments: 28 },
  { date: "2025-12-25", enrollments: 30 },
  { date: "2025-12-26", enrollments: 34 },
  { date: "2025-12-27", enrollments: 17 },
  { date: "2025-12-28", enrollments: 22 },
  { date: "2025-12-29", enrollments: 31 },
  { date: "2025-12-30", enrollments: 24 },
  { date: "2025-12-31", enrollments: 29 },
  { date: "2026-01-01", enrollments: 18 },
  { date: "2026-01-02", enrollments: 15 },
  { date: "2026-01-03", enrollments: 21 },
  { date: "2026-01-04", enrollments: 25 },
  { date: "2026-01-05", enrollments: 32 },
  { date: "2026-01-06", enrollments: 27 },
  { date: "2026-01-07", enrollments: 39 },
  { date: "2026-01-08", enrollments: 23 },
  { date: "2026-01-09", enrollments: 20 },
  { date: "2026-01-10", enrollments: 12 },
];

const chartConfig = {
  enrollments: {
    label: "Inscripciones",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  data: { date: string; enrollments: number }[];
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const totalEnrollmentsNumber = useMemo(
    () => data.reduce((acc, curr) => acc + curr.enrollments, 0),
    [data]
  );
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Inscripciones totales</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Inscripciones totales de los últimos 30 días:{" "}
            {totalEnrollmentsNumber}
          </span>
          <span className="@[540px]/card:hidden">
            Últimos 30 días: {totalEnrollmentsNumber}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={"preserveStartEnd"}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("es-MX", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("es-MX", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={"enrollments"} fill="var(--chart-1)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
