import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, XIcon } from "lucide-react";
import Link from "next/link";

export default function PaymentCancel() {
  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="max-w-[20rem] w-full mx-auto">
        <CardContent>
          <div className="w-full flex justify-center">
            <XIcon className="size-12 p-2 bg-red-500/30 text-red-500 rounded-full" />
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">Pago cancelado</h2>
            <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">
              No te preocupes, no se te cobrará nada. Puedes volver a
              inscribirte al curso en cualquier momento.
            </p>
            <Link
              href="/"
              className={buttonVariants({
                className: "w-full mt-5",
              })}
            >
              <ArrowLeft className="size-4" />
              Volver al Inicio
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
