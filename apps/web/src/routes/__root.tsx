import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import type { AuthContextProps } from "@/auth/auth"

export const Route = createRootRouteWithContext<{
  auth: AuthContextProps
}>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-svh bg-background">
      <Outlet />
    </div>
  )
}
