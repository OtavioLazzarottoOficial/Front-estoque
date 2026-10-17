import type { productFormZodSchema } from "@/schemas/productFormZodSchema";
import type z from "zod";

export type Product = z.infer<typeof productFormZodSchema>