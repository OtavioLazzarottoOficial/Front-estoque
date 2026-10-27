import { api } from "@/helpers/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { toast } from "@workspace/ui/components/toast"
import type { AxiosError } from "axios"

export async function deleteProduct(
  id: string
): Promise<void | AxiosError<{ message?: string }>> {
  try {
    await api.delete(`/product/delete/${id}`)
  } catch (error) {
    toast.add({
      title: "Erro ao remover produto",
      description:
        (error as AxiosError<{ message?: string }>).response?.data.message ||
        "Não foi possível remover o produto. Tente novamente.",
      type: "error",
    })
    throw error
  }
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    mutationKey: ["deleteProduct"],
    onSuccess: async () => {
      toast.add({ title: "Produto removido com sucesso.", type: "success" })

      // 1. Invalida o cache do TanStack Query (incluindo sub-chaves como paginação/filtros)
      await queryClient.invalidateQueries({
        queryKey: ["products"],
        exact: false,
      })

      // 2. Re-executa os loaders do TanStack Router se a rota depender deles
      await router.invalidate()
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.add({
        title: "Erro ao remover produto",
        description:
          error.response?.data?.message ||
          "Erro ao remover produto. Tente novamente.",
        type: "error",
      })
    },
  })
}
