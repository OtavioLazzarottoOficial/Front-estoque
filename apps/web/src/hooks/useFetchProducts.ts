import type { ProductProps } from "@/types/product"

export async function fetchProducts(
  page = 1
): Promise<ProductProps[] | undefined> {
  try {
    const response = await fetch(`http://localhost:3333/products?page=${page}`)

    return response.json()
  } catch (error) {
    console.error(error)
    return undefined
  }
}
