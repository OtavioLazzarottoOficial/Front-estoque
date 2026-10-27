import { createFileRoute, Link } from "@tanstack/react-router"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Boxes, FolderTree, PackageSearch, ArrowRight } from "lucide-react"
import { useAuth } from "@/auth/auth"

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
})

const quickLinks = [
  {
    title: "Produtos",
    description: "Cadastre, edite e gerencie seus produtos",
    to: "/product-list",
    icon: PackageSearch,
  },
  {
    title: "Categorias",
    description: "Organize produtos por categorias",
    to: "/category-list",
    icon: FolderTree,
  },
  {
    title: "Estoque",
    description: "Controle entradas e saídas do estoque",
    to: "/stock-list",
    icon: Boxes,
  },
] as const

function Dashboard() {
  const { user } = useAuth()
  const firstName = user?.user_email?.split("@")[0] || "Usuário"

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Olá, {firstName}!
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo ao My Estoque. Gerencie seus produtos, categorias e estoque
          de forma prática e eficiente.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map(({ title, description, to, icon: Icon }) => (
          <Card
            key={to}
            className="group relative overflow-hidden transition-all hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Link to={to}>
                <Button
                  variant="ghost"
                  className="group/btn -ml-2 flex items-center gap-2"
                >
                  Acessar
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Dica rápida</CardTitle>
            <CardDescription>
              Utilize o menu acima para navegar entre as seções. Em cada
              listagem você consegue adicionar, visualizar e gerenciar seus
              registros com rapidez.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </div>
  )
}
