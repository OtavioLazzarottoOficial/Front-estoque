import type { stockFormZodSchema } from "@/schemas/stockFormZodSchema"
import type z from "zod"

export type Stock = z.infer<typeof stockFormZodSchema>
