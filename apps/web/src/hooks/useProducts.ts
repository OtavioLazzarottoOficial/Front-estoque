import { api } from "@/helpers/api"
import type { Product } from "@/models/product-model"
import type { ProductProps } from "@/types/product"

export async function fetchProducts(
  page = 1
): Promise<ProductProps[] | undefined> {
  try {
    const response = await api.get<ProductProps[]>(`/products?page=${page}`)
    return response.data
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function fetchProductById(
  productId: string
): Promise<ProductProps | undefined> {
  try {
    const response = await api.get(`/product/${productId}`)

    return response.data
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function postProduct(
  data: Product
): Promise<ProductProps | undefined> {
  try {
    const response = await api.post("/product", data)
    return response.data
  } catch (error) {
    console.error(error)
    return undefined
  }
}
