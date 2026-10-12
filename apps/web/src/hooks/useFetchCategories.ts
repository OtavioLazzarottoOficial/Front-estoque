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

export async function postCategory(data: CategoryProps): Promise<CategoryProps | undefined> {
  try {
    const response = await fetch("http://localhost:3333/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to post category")
    }
    return response.json()
  } catch (error) {
    console.error(error)
    return undefined
  }
}
