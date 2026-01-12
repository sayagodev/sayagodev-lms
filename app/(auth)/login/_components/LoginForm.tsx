"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { GithubIcon, Loader, Loader2, SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [githubPending, startGithubTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const [email, setEmail] = useState("");

  async function signInWithGithub() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success(
              "Iniciaste sesión con GitHub, te redirigiremos a la página principal."
            );
          },
          onError: () => {
            toast.error(
              "Error al iniciar sesión con GitHub, intenta nuevamente."
            );
          },
        },
      });
    });
  }

  function signInWithEmail() {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success(
              "Código de verificación enviado a tu correo electrónico."
            );
            router.push(`/verify-request?email=${email}`);
          },
          onError: () => {
            toast.error(
              "Error al enviar el código de verificación, intenta nuevamente."
            );
          },
        },
      });
    });
  }

  return (
    <Card className="w-full max-w-[20rem] md:max-w-md mx-auto min-w-0">
      <CardHeader>
        <CardTitle className="text-xl">¡Bienvenido de vuelta!</CardTitle>
        <CardDescription>
          Ingresa con tu GitHub o Correo Electrónico
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 min-w-0">
        <Button
          disabled={githubPending}
          className="w-full min-w-0"
          variant={"outline"}
          onClick={signInWithGithub}
        >
          {githubPending ? (
            <>
              <Loader className="size-4 animate-spin shrink-0" />
              <span className="truncate">Iniciando sesión...</span>
            </>
          ) : (
            <>
              <GithubIcon className="size-4 shrink-0" />
              <span className="truncate">Iniciar sesión con GitHub</span>
            </>
          )}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            O continuar con
          </span>
        </div>

        <div className="grid gap-3 min-w-0">
          <div className="grid gap-2 min-w-0">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              type="email"
              placeholder="mi@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full min-w-0"
            />
          </div>
          <Button
            onClick={signInWithEmail}
            disabled={emailPending}
            className="w-full min-w-0"
          >
            {emailPending ? (
              <>
                <Loader2 className="size-4 animate-spin shrink-0" />
                <span className="truncate">Enviando código...</span>
              </>
            ) : (
              <>
                <SendIcon className="size-4 shrink-0" />
                <span className="truncate md:hidden">Continuar</span>
                <span className="hidden md:inline truncate">
                  Continuar con Correo Electrónico
                </span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
