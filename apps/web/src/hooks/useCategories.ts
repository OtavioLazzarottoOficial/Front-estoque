import { api } from "@/helpers/api"
import type { CategoryProps } from "@/types/category"

export async function fetchCategories(
  page = 1
): Promise<CategoryProps[] | undefined> {
  try {
    const response = await api.get<CategoryProps[]>(`/categories?page=${page}`)
    return response.data
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function postCategory(
  data: Pick<CategoryProps, "name" | "description">
): Promise<CategoryProps | undefined> {
  try {
    const response = await api.post<CategoryProps>("/categories", data)
    return response.data
  } catch (error) {
    console.error(error)
    return undefined
  }
}
