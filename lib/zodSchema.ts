import z from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"];
export const courseStatus = ["Draft", "Published", "Archived"];

export const courseCategories = [
  "Development",
  "Bussiness",
  "Finance",
  "IT & Software",
  "Office Productivity",
  "Personal Development",
  "Design",
  "Markegint",
  "Music",
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "El título debe tener al menos 3 caracteres" })
    .max(100, { message: "El título debe tener como máximo 100 caracteres" }),
  description: z
    .string()
    .min(3, { message: "La descripción debe tener al menos 3 caracteres" }),
  fileKey: z.string().min(1, { message: "Debes subir un archivo" }),
  price: z.coerce
    .number()
    .min(1, { message: "El precio debe ser al menos $1" }),
  duration: z.coerce
    .number()
    .min(1, { message: "La duración debe ser al menos 1 hora" })
    .max(500, { message: "La duración no debe exceder 500 horas" }),
  level: z.enum(courseLevels, { message: "Nivel de curso inválido" }),
  category: z.enum(courseCategories, { message: "La categoría es necesaria" }),
  smallDescription: z
    .string()
    .min(3, {
      message: "La descripción corta debe tener al menos 3 caracteres",
    })
    .max(200, {
      message: "La descripción corta no debe exceder 200 caracteres",
    }),
  slug: z
    .string()
    .min(3, { message: "El slug debe tener al menos 3 caracteres" }),
  status: z.enum(courseStatus, { message: "Estado del curso inválido" }),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
