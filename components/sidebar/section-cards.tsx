import {
  IconBook,
  IconPlaylistX,
  IconShoppingCart,
  IconUser,
} from "@tabler/icons-react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { adminGetDashboardStats } from "@/app/data/admin/admin-get-dashboard-stats";

export async function SectionCards() {
  const { totalSignups, totalCustomers, totalCourses, totalLessons } =
    await adminGetDashboardStats();
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader className="flex items-center justify-between space-y-0 pb-2">
          <div className="">
            <CardDescription>Registros Totales</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalSignups}
            </CardTitle>
          </div>
          <IconUser className="size-6 text-muted-foreground" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Usuarios registrados en esta plataforma
          </p>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="flex items-center justify-between space-y-0 pb-2">
          <div className="">
            <CardDescription>Clientes totales</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalCustomers}
            </CardTitle>
          </div>
          <IconShoppingCart className="size-6 text-muted-foreground" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Usuarios que se han registrado en un curso
          </p>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="flex items-center justify-between space-y-0 pb-2">
          <div className="">
            <CardDescription>Cursos totales</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalCourses}
            </CardTitle>
          </div>
          <IconBook className="size-6 text-muted-foreground" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Cursos disponibles en la plataforma
          </p>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="flex items-center justify-between space-y-0 pb-2">
          <div className="">
            <CardDescription>Capítulos totales</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalLessons}
            </CardTitle>
          </div>
          <IconPlaylistX className="size-6 text-muted-foreground" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">Total de contenido disponible</p>
        </CardFooter>
      </Card>
    </div>
  );
}
