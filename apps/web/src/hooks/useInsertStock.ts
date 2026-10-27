import { api } from "@/helpers/api"
import type { Stock } from "@/models/stock-model"
import type { StockProps } from "@/types/stock"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import type { AxiosError } from "axios"

async function insertStock(stock: Stock): Promise<StockProps | undefined> {
  try {
    const response = await api.post("/stock", stock)

    return response.data
  } catch (error) {
    alert(
      (error as AxiosError<{ message?: string }>).response?.data.message ||
        "An error occurred"
    )
    throw error
  }
}

export function useInsertStock() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (stock: Stock) => await insertStock(stock),
    mutationKey: ["insertStock"],
    onSuccess: async () => {
      alert("Estoque cadastrado com sucesso.")

      // 1. Invalida o cache do TanStack Query (incluindo sub-chaves como paginação/filtros)
      await queryClient.invalidateQueries({
        queryKey: ["stocks"],
        exact: false,
      })

      // 2. Re-executa os loaders do TanStack Router se a rota depender deles
      await router.invalidate()
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage =
        error.response?.data?.message ||
        "Erro ao cadastrar estoque. Tente novamente."
      alert("Teste: ")
    },
  })
}
