import * as React from "react"
import { jwtDecode } from "jwt-decode"
import { useState } from "react"

type User = {
  iat: number
  user_id: string
  user_email: string
}

interface AuthContextProps {
  user: User | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = React.createContext<AuthContextProps | null>(null)

function getInitialUser(): User | null {
  const token = localStorage.getItem("token")
  if (!token) return null

  const decoded = jwtDecode<User & { exp: number }>(token)
  const isExpired = decoded.exp * 1000 < Date.now()

  if (isExpired) {
    localStorage.removeItem("token")
    return null
  }

  return decoded
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser)

  function login(token: string) {
    console.log("Token received:", token) // Log the token for debugging

    localStorage.setItem("token", token)
    const decoded = jwtDecode<User>(token)
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
