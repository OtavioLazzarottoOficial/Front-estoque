import { api } from "@/helpers/api"
import type { StockProps } from "@/types/stock"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

export async function fetchProductById(
  productId: string
): Promise<StockProps | undefined> {
  try {
    const response = await api.get(`/stock/product/${productId}`)

    return response.data
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export function useGetStockByProduct(
  productId: string
): UseQueryResult<StockProps | undefined, Error> {
  return useQuery({
    queryKey: ["stock", productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId,
  })
}
