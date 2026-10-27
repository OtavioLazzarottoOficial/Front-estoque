import { api } from "@/helpers/api"
import type { Product } from "@/models/product-model"
import type { ProductProps } from "@/types/product"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { toast } from "@workspace/ui/components/toast"
import type { AxiosError } from "axios"

export async function insertProduct(
  data: Product
): Promise<ProductProps | undefined> {
  const formData = new FormData()
  formData.append("name", data.name)
  formData.append("description", data.description)
  formData.append("price", String(data.price))
  formData.append("categoryId", data.categoryId)

  if (data.status) {
    formData.append("status", data.status)
  }

  if (data.images && data.images.length > 0) {
    data.images.forEach((file) => {
      formData.append("images", file)
    })
  }

  const response = await api.post("/product", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

export function useInsertProduct() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: Product) => await insertProduct(data),
    mutationKey: ["postProduct"],
    onSuccess: async () => {
      toast.add({ title: "Produto cadastrado com sucesso.", type: "success" })

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
        title: "Erro ao cadastrar produto",
        description:
          error.response?.data?.message ||
          "Erro ao cadastrar produto. Tente novamente.",
        type: "error",
      })
    },
  })
}
