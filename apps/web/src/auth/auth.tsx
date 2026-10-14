import * as React from "react"
import type { UserProps } from "@/types/user"
import { jwtDecode } from "jwt-decode"
import { useState } from "react"

interface AuthContextProps {
  user: Omit<UserProps, "password"> | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = React.createContext<AuthContextProps | null>(null)

function getInitialUser(): UserProps | null {
  const token = localStorage.getItem("token")
  if (!token) return null

  const decoded = jwtDecode<UserProps & { exp: number }>(token)
  const isExpired = decoded.exp * 1000 < Date.now()

  if (isExpired) {
    localStorage.removeItem("token")
    return null
  }

  return decoded
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProps | null>(getInitialUser)

  function login(token: string) {
    localStorage.setItem("token", token)
    const decoded = jwtDecode<UserProps>(token)
    setUser(decoded)
  }

  function logout() {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, isLoading: false }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
