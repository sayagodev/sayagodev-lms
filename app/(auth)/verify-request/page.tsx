"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { CheckCircleIcon, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function VerifyRequestPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [emailPending, startTransition] = useTransition();
  const params = useSearchParams();
  const email = params.get("email") as string;
  const isOtpCompleted = otp.length === 6;

  function verifyOtp() {
    startTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Código de verificación verificado correctamente");
            router.push("/");
          },
          onError: () => {
            toast.error("Error al verificar el código de verificación");
          },
        },
      });
    });
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          Por favor, verifica tu correo electrónico
        </CardTitle>
        <CardDescription className="">
          Hemos enviado un código de verificación a tu correo electrónico. Por
          favor, ingresa el código de verificación para continuar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <InputOTP
            maxLength={6}
            className="gap-2"
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="tesxt-sm text-muted-foreground text-center">
            Ingresa el código de 6 dígitos que te enviamos a tu correo.
          </p>
        </div>
        <Button
          className="w-full"
          onClick={verifyOtp}
          disabled={emailPending || !isOtpCompleted}
        >
          {emailPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Verificando código...</span>
            </>
          ) : (
            <>
              <CheckCircleIcon className="size-4" />
              <span>Verificar código</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
