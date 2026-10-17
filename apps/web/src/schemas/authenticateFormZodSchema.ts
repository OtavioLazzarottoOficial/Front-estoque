import { useZodForm } from "@/hooks/useZodForm"
import z from "zod"

export const authenticateFormZodSchema = z.object({
  email: z.email(),
  password: z.string(),
})

export const useAuthenticateFormZodSchema = () => {
  return useZodForm(authenticateFormZodSchema)
}
