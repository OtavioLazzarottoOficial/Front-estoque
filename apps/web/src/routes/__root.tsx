import Navbar from "@/components/navbar"
import { Link, Outlet, createRootRoute } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="bg-linear-to-b from-amber-600/80 to-amber-400">
      <Navbar />
      <Outlet />
    </div>
  )
}
