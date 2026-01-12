import "server-only";

import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

/**
 * Elimina un archivo de S3
 * @param key - La clave del archivo en S3
 * @returns Promise que se resuelve cuando el archivo se elimina exitosamente
 */
export async function deleteS3File(
  key: string | null | undefined
): Promise<void> {
  if (!key) {
    return;
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
    });

    await S3.send(command);
  } catch (error) {
    // Log el error pero no lanzamos excepción para no interrumpir el flujo
    // si el archivo ya no existe en S3
    console.error(`Error al eliminar archivo de S3 con clave ${key}:`, error);
  }
}

/**
 * Elimina múltiples archivos de S3 en paralelo
 * @param keys - Array de claves de archivos en S3
 */
export async function deleteS3Files(
  keys: (string | null | undefined)[]
): Promise<void> {
  const validKeys = keys.filter((key): key is string => Boolean(key));

  if (validKeys.length === 0) {
    return;
  }

  await Promise.allSettled(validKeys.map((key) => deleteS3File(key)));
}
