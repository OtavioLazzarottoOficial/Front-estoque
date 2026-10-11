import type { CategoryProps } from "@/types/category"

export async function fetchCategories(
  page = 1
): Promise<CategoryProps[] | undefined> {
  try {
    const response = await fetch(
      `http://localhost:3333/categories?page=${page}`
    )

    return response.json()
  } catch (error) {
    console.error(error)
    return undefined
  }
}
