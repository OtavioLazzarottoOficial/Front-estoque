import * as React from "react"
import type { IAuth } from "./IAuth"
import type { UserProps } from "@/types/user"

const AuthContext = React.createContext<IAuth | null>(null)

const key = "tanstack.auth.user"

function getStoredUser() {
  return localStorage.getItem(key)
}

function setStoredUser(user: UserProps | null) {
  if (user) {
    localStorage.setItem(key, JSON.stringify(user))
  } else {
    localStorage.removeItem(key)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<string | null>(getStoredUser())
  const isAuthenticated = !!user

  const logout = React.useCallback(async () => {
    setStoredUser(null)
    setUser(null)
  }, [])

  const login = React.useCallback(async (username: string) => {
    setStoredUser(username)
    setUser(username)
  }, [])

  React.useEffect(() => {
    setUser(getStoredUser())
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
