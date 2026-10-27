import { createFileRoute, Link } from "@tanstack/react-router"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Boxes, PackageSearch } from "lucide-react"

export const Route = createFileRoute("/_authenticated/stock-list")({
  component: StockList,
})

function StockList() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="flex flex-row items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Boxes className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <CardTitle>Controle de estoque</CardTitle>
            <CardDescription>
              O estoque é gerenciado por produto. Acesse a listagem de produtos
              para visualizar as quantidades disponíveis ou registrar uma nova
              entrada.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Link to="/product-list">
            <Button className="flex items-center gap-2">
              <PackageSearch className="h-4 w-4" />
              Ir para produtos
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
