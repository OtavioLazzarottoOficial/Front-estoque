import {
  useForm,
  type FieldValues,
  type Resolver,
  type UseFormReturn,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type z from "zod"

export function useZodForm<T extends z.ZodType<FieldValues, FieldValues>>(
  schema: T
): UseFormReturn<z.output<T>> {
  return useForm<z.output<T>>({
    mode: "all",
    reValidateMode: "onSubmit",
    // O tipo de entrada do Zod (z.input) pode diferir do de saída (z.output)
    // quando há coerção; por isso o cast para o tipo esperado pelo formulário.
    resolver: zodResolver(schema) as unknown as Resolver<z.output<T>>,
  })
}
