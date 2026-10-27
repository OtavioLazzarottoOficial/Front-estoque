import { Link, useNavigate } from "@tanstack/react-router"

import { Button } from "@workspace/ui/components/button"
import { UserSetting } from "./user-setting"
import { useAuth } from "@/auth/auth"
import { Boxes, FolderTree, LayoutDashboard, PackageSearch } from "lucide-react"

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/product-list", label: "Produtos", icon: PackageSearch },
  { to: "/category-list", label: "Categorias", icon: FolderTree },
  { to: "/stock-list", label: "Estoque", icon: Boxes },
] as const

function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 pr-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Boxes className="h-5 w-5" />
          </div>
          <h1 className="text-base font-semibold tracking-tight sm:text-lg">
            My Estoque
          </h1>
        </div>

        <nav className="flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeProps={{
                className:
                  "bg-accent text-accent-foreground shadow-sm",
              }}
              activeOptions={{ exact: false }}
            >
              <Button
                variant="ghost"
                className="flex items-center gap-2 font-medium"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <UserSetting
            user_email={user?.user_email}
            logout={() => {
              logout()
              navigate({ to: "/" })
            }}
          />
        </div>
      </div>
    </header>
  )
}

export default Navbar
