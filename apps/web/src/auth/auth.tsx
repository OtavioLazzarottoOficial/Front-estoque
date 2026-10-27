import * as React from "react"
import { jwtDecode } from "jwt-decode"

export type User = {
  sub?: string
  user_id?: string | { value: string }
  user_email?: string
  iat?: number
  exp?: number
}

export interface AuthContextProps {
  user: User | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = React.createContext<AuthContextProps | null>(null)

function getInitialUser(): { user: User | null; isLoading: boolean } {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      return { user: null, isLoading: false }
    }

    const decoded = jwtDecode<User & { exp?: number }>(token)

    if (decoded.exp) {
      const isExpired = decoded.exp * 1000 < Date.now()
      if (isExpired) {
        localStorage.removeItem("token")
        return { user: null, isLoading: false }
      }
    }

    return { user: decoded as User, isLoading: false }
  } catch (error) {
    console.error("Failed to decode token on initialization", error)
    localStorage.removeItem("token")
    return { user: null, isLoading: false }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [{ user, isLoading }, setAuthState] = React.useState<{
    user: User | null
    isLoading: boolean
  }>(() => getInitialUser())

  const login = React.useCallback((token: string) => {
    try {
      if (!token) {
        throw new Error("Token is required to login")
      }
      localStorage.setItem("token", token)
      const decoded = jwtDecode<User & { exp?: number }>(token)
      setAuthState({ user: decoded as User, isLoading: false })
    } catch (error) {
      console.error("Failed to login with token", error)
      localStorage.removeItem("token")
      setAuthState({ user: null, isLoading: false })
    }
  }, [])

  const logout = React.useCallback(() => {
    localStorage.removeItem("token")
    setAuthState({ user: null, isLoading: false })
  }, [])

  React.useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "token") {
        if (!event.newValue) {
          setAuthState({ user: null, isLoading: false })
          return
        }
        try {
          const decoded = jwtDecode<User & { exp?: number }>(event.newValue)
          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("token")
            setAuthState({ user: null, isLoading: false })
            return
          }
          setAuthState({ user: decoded as User, isLoading: false })
        } catch (error) {
          console.error("Failed to sync auth state from storage event", error)
          localStorage.removeItem("token")
          setAuthState({ user: null, isLoading: false })
        }
      }
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const value = React.useMemo<AuthContextProps>(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
      isLoading,
    }),
    [user, login, logout, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
