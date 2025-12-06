import { buttonVariants } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Logo from "@/public/logo.png";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center">
      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
          className: "absolute top-4 left-4",
        })}
      >
        <ArrowLeftIcon className="size-4" />
        Volver
      </Link>

      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Image src={Logo} alt="Logo" width={32} height={32} />
          SáyagodevLMS.
        </Link>
        {children}

        <div className="text-balance text-center text-sm text-muted-foreground">
          Al hacer click en continuar, aceptas nuestros{" "}
          <span className="hover:text-primary hover:underline cursor-pointer">
            Términos y Condiciones
          </span>{" "}
          y la{" "}
          <span className="hover:text-primary hover:underline cursor-pointer">
            Política de Privacidad
          </span>
        </div>
      </div>
    </div>
  );
}
