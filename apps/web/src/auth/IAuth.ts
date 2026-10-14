import type { UserProps } from "@/types/user"

export interface IAuth {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  getToken: () => string | null
  user: Omit<UserProps, "password"> | null
}
