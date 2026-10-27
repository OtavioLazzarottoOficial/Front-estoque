import { api } from "@/helpers/api"

export interface Authenticate {
  email: string
  password: string
}

export interface AuthTokenResponse {
  access_token?: string
  token?: string
  accessToken?: string
}

export type AuthResponse = string | AuthTokenResponse

export async function auth(data: Authenticate): Promise<string> {
  const response = await api.post<AuthResponse>("auth", data)
  const responseData = response.data

  if (typeof responseData === "string") {
    return responseData
  }

  if (responseData?.access_token) {
    return responseData.access_token
  }

  if (responseData?.token) {
    return responseData.token
  }

  if (responseData?.accessToken) {
    return responseData.accessToken
  }

  throw new Error("Token not found in authentication response")
}
