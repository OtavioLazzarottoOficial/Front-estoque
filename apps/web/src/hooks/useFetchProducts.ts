import type { Product } from "@/models/product-model"
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

export async function postProduct(data: Product): Promise<ProductProps | undefined> {
  try {
    const response = await fetch("http://localhost:3333/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to post product")
    }
    return response.json()
  } catch (error) {
    console.error(error)
    return undefined
  }
}
