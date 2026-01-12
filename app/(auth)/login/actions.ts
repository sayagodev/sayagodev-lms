"use server";

import { prisma } from "@/lib/db";
import { cookies, headers } from "next/headers";
import { APIResponse } from "@/lib/types";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";

const DEMO_USER_EMAIL = "demo@sayagodev-lms.com";
const IMPERSONATOR_ADMIN_EMAIL = "system-impersonator@sayagodev-lms.com";

export async function loginAsDemoAdmin(): Promise<APIResponse> {
  try {
    // 1. Crear o obtener usuario demo admin
    let demoUser = await prisma.user.findUnique({
      where: { email: DEMO_USER_EMAIL },
    });

    if (!demoUser) {
      demoUser = await prisma.user.create({
        data: {
          id: nanoid(32),
          name: "Demo Admin",
          email: DEMO_USER_EMAIL,
          emailVerified: true,
          role: "admin",
          image: "https://avatar.vercel.sh/demo@sayagodev-lms.com",
        },
      });
    } else {
      // Asegurar que tenga rol admin
      if (demoUser.role !== "admin") {
        demoUser = await prisma.user.update({
          where: { id: demoUser.id },
          data: { role: "admin" },
        });
      }
    }

    // 2. Crear o obtener usuario impersonador (admin del sistema)
    let impersonatorUser = await prisma.user.findUnique({
      where: { email: IMPERSONATOR_ADMIN_EMAIL },
    });

    if (!impersonatorUser) {
      impersonatorUser = await prisma.user.create({
        data: {
          id: nanoid(32),
          name: "System Impersonator",
          email: IMPERSONATOR_ADMIN_EMAIL,
          emailVerified: true,
          role: "admin",
          image: "https://avatar.vercel.sh/system",
        },
      });
    }

    // 3. Crear sesión de impersonación manualmente
    // Usamos el campo impersonatedBy que better-auth reconoce
    const headerList = await headers();
    const cookieStore = await cookies();

    const ipAddress =
      headerList.get("x-forwarded-for") ||
      headerList.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = headerList.get("user-agent") || null;
    const demoSessionToken = nanoid(32);
    const demoSessionId = nanoid(32);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Eliminar sesiones existentes del usuario demo
    await prisma.session.deleteMany({
      where: { userId: demoUser.id },
    });

    // Crear sesión con campo impersonatedBy
    await prisma.session.create({
      data: {
        id: demoSessionId,
        userId: demoUser.id,
        token: demoSessionToken,
        expiresAt,
        ipAddress,
        userAgent,
        impersonatedBy: impersonatorUser.id,
      },
    });

    // Establecer cookie de la sesión de impersonación
    cookieStore.set("better-auth.session_token", demoSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return {
      status: "success",
      message: "Inicio de sesión como demo admin exitoso",
    };
  } catch (error) {
    console.error("Error en demo login:", error);
    return {
      status: "error",
      message: `Error al iniciar sesión como demo admin: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`,
    };
  }
}
