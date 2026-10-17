import { createFileRoute } from "@tanstack/react-router"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex w-xl gap-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Bem-vindo ao My Estoque</CardTitle>
            <CardDescription>
              Gerencie seus produtos, categorias e estoque de forma eficiente.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
