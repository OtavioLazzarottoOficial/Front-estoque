import Navbar from "@/components/navbar"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"

interface MyRouterContext {
  // The ReturnType of your useAuth hook or the value of your AuthContext
  auth: AuthState
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-svh bg-linear-to-b from-muted to-background">
      <Navbar />
      <Outlet />
    </div>
  )
}
