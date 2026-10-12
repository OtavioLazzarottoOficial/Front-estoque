import Navbar from "@/components/navbar"
import { Outlet, createRootRoute } from "@tanstack/react-router"

export const Route = createRootRoute({
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
