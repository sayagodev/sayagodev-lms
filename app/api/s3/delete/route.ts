import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 3,
  })
);

export async function DELETE(req: Request) {
  const session = await requireAdmin();

  try {
    const decision = await aj.protect(req, {
      fingerprint: session?.user.id as string,
    });

    if (decision.isDenied()) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body: { key: string } = await req.json();
    const key = body.key;

    if (!key) {
      return NextResponse.json(
        { error: "Missing or invalid object key" },
        { status: 400 }
      );
    }

    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
    });

    await S3.send(command);

    // Eliminar referencias de la base de datos
    // Buscar en lecciones (thumbnailKey y videoKey)
    await prisma.lesson.updateMany({
      where: {
        OR: [
          { thumbnailKey: key },
          { videoKey: key },
        ],
      },
      data: {
        thumbnailKey: null,
        videoKey: null,
      },
    });

    // Nota: fileKey en Course es requerido (String no nullable),
    // por lo que no podemos eliminarlo directamente.
    // Si necesitas eliminar fileKey de cursos, considera cambiar el schema
    // o manejar esto de manera diferente.

    return NextResponse.json(
      { message: "Object deleted successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Missing or invalid object key" },
      { status: 500 }
    );
  }
}
