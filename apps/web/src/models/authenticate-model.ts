import type { authenticateFormZodSchema } from "@/schemas/authenticateFormZodSchema"
import type z from "zod"

export type Authenticate = z.infer<typeof authenticateFormZodSchema>
