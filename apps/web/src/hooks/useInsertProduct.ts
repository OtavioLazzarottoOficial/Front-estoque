import { api } from "@/helpes/api"
import type { Product } from "@/models/product-model"
import type { ProductProps } from "@/types/product"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import type { AxiosError } from "axios"

export async function insertProduct(
  data: Product
): Promise<ProductProps | undefined> {
  try {
    const response = await api.post("/product", data)
    return response.data
  } catch (error) {
    alert(
      (error as AxiosError<{ message?: string }>).response?.data.message ||
        "An error occurred"
    )
    throw error
  }
}

export function useInsertProduct() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: Product) => await insertProduct(data),
    mutationKey: ["postProduct"],
    onSuccess: async () => {
      alert("Produto cadastrado com sucesso.")

      // 1. Invalida o cache do TanStack Query (incluindo sub-chaves como paginação/filtros)
      await queryClient.invalidateQueries({
        queryKey: ["products"],
        exact: false,
      })

      // 2. Re-executa os loaders do TanStack Router se a rota depender deles
      await router.invalidate()
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage =
        error.response?.data?.message ||
        "Erro ao cadastrar produto. Tente novamente."
      alert(errorMessage)
    },
  })
}
