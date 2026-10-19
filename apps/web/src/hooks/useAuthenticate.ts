import { api } from "@/helpes/api"

export interface Authenticate {
  email: string
  password: string
}

export async function auth(data: Authenticate): Promise<string | undefined> {
  try {
    const response = await api.post<string>("auth", data)
    return response.data
  } catch (error) {
    console.error(error)
  }
}
