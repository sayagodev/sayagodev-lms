import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface FeatureProps {
  title: string;
  description: string;
  icon: string;
}

const features: FeatureProps[] = [
  {
    title: "Comprehensive Courses",
    description:
      "Accede a una amplia variedad de cursos cuidadosamente seleccionados y diseñados por expertos de la industria.",
    icon: "📚",
  },
  {
    title: "Aprendizaje Interactivo",
    description:
      "Aprende de manera interactiva con ejercicios prácticos, tareas y proyectos que te ayudarán a aplicar lo que aprendes en la práctica.",
    icon: "🎮",
  },
  {
    title: "Seguimiento de Progreso",
    description:
      "Mantén el control de tu progreso con nuestro sistema de seguimiento de progreso. Accede a tus cursos y verifica tu progreso en cualquier momento.",
    icon: "📊",
  },
  {
    title: "Soporte de la Comunidad",
    description:
      "Obtén ayuda y apoyo de la comunidad de estudiantes y expertos. Comparte tus dudas y consejos con otros usuarios.",
    icon: "👥",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge className="text-sm md:text-xl" variant={"outline"}>
            El futuro de la Educación Online
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Eleva tu experiencia de aprendizaje
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Descubre una nueva forma de aprender con nuestro sistema moderno e
            interactivo de gestión de aprendizaje. Accede a cursos de alta
            calidad en cualquier momento y lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/courses" className={buttonVariants({ size: "lg" })}>
              Explorar cursos
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
