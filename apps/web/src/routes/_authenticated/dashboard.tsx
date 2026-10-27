import { createFileRoute } from "@tanstack/react-router"
import type { ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Separator } from "@workspace/ui/components/separator"
import {
  Boxes,
  FolderTree,
  PackageSearch,
  CircleAlert,
  CheckCircle2,
  CircleSlash,
} from "lucide-react"
import { useAuth } from "@/auth/auth"
import { fetchProducts } from "@/hooks/useProducts"
import { fetchCategories } from "@/hooks/useCategories"
import { Status, type ProductProps } from "@/types/product"

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
})

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

function Dashboard() {
  const { user } = useAuth()
  const firstName = user?.user_email?.split("@")[0] || "Usuário"

  const productsQuery = useQuery({
    queryKey: ["dashboard", "products"],
    queryFn: async () => {
      const data = await fetchProducts()
      if (!data) {
        throw new Error("Não foi possível carregar os produtos")
      }
      return data
    },
  })

  const categoriesQuery = useQuery({
    queryKey: ["dashboard", "categories"],
    queryFn: async () => {
      const data = await fetchCategories()
      if (!data) {
        throw new Error("Não foi possível carregar as categorias")
      }
      return data
    },
  })

  const products = productsQuery.data ?? []
  const categories = categoriesQuery.data ?? []

  const activeCount = products.filter(
    (product) => product.status === Status.ACTIVE
  ).length
  const inactiveCount = products.filter(
    (product) => product.status === Status.INACTIVE
  ).length
  const outOfStockCount = products.filter(
    (product) => product.status === Status.OUT_OF_STOCK
  ).length

  const recentProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5)

  const isLoading = productsQuery.isLoading || categoriesQuery.isLoading
  const hasError = productsQuery.isError || categoriesQuery.isError

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Olá, {firstName}!
        </h1>
        <p className="text-sm text-muted-foreground">
          Resumo do seu estoque em {dateFormatter.format(new Date())}.
        </p>
      </header>

      {hasError ? (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <CircleAlert className="h-4 w-4 shrink-0" />
          Não foi possível carregar os indicadores. Tente novamente mais tarde.
        </div>
      ) : null}

      {/* Indicadores */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Produtos"
          value={products.length}
          icon={<PackageSearch className="h-4 w-4" />}
          loading={isLoading}
        />
        <MetricCard
          title="Categorias"
          value={categories.length}
          icon={<FolderTree className="h-4 w-4" />}
          loading={isLoading}
        />
        <MetricCard
          title="Ativos"
          value={activeCount}
          icon={<CheckCircle2 className="h-4 w-4" />}
          loading={isLoading}
        />
        <MetricCard
          title="Fora de estoque"
          value={outOfStockCount}
          icon={<Boxes className="h-4 w-4" />}
          loading={isLoading}
          emphasis={outOfStockCount > 0}
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Situação do catálogo */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Situação do catálogo</CardTitle>
            <CardDescription>
              Distribuição dos seus produtos por status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : products.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum produto cadastrado ainda.
              </p>
            ) : (
              <>
                <StatusRow
                  label="Ativos"
                  count={activeCount}
                  total={products.length}
                  badgeClassName="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                />
                <StatusRow
                  label="Inativos"
                  count={inactiveCount}
                  total={products.length}
                  badgeClassName="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                />
                <StatusRow
                  label="Fora de estoque"
                  count={outOfStockCount}
                  total={products.length}
                  badgeClassName="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Últimos produtos */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Últimos produtos cadastrados</CardTitle>
            <CardDescription>
              Os 5 registros mais recentes do seu catálogo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full" />
                ))}
              </div>
            ) : recentProducts.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <CircleSlash className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Nenhum produto cadastrado ainda.
                </p>
              </div>
            ) : (
              <ul className="divide-y">
                {recentProducts.map((product) => (
                  <RecentProductRow key={product.id} product={product} />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  icon,
  loading,
  emphasis = false,
}: {
  title: string
  value: number
  icon: ReactNode
  loading: boolean
  emphasis?: boolean
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={
            emphasis
              ? "flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive"
              : "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
          }
        >
          {icon}
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          {loading ? (
            <Skeleton className="h-7 w-12" />
          ) : (
            <p className="text-2xl font-semibold tabular-nums">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function StatusRow({
  label,
  count,
  total,
  badgeClassName,
}: {
  label: string
  count: number
  total: number
  badgeClassName: string
}) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <Badge className={badgeClassName}>
          {count} · {percentage}%
        </Badge>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function RecentProductRow({ product }: { product: ProductProps }) {
  return (
    <li className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0 space-y-0.5">
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {product.category?.name ?? "Sem categoria"} · SKU {product.sku}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-sm font-medium tabular-nums">
          {currencyFormatter.format(Number(product.price))}
        </span>
        <Separator orientation="vertical" className="h-6" />
        <ProductStatusBadge status={product.status} />
      </div>
    </li>
  )
}

function ProductStatusBadge({ status }: { status: Status }) {
  if (status === Status.ACTIVE) {
    return (
      <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
        Ativo
      </Badge>
    )
  }

  if (status === Status.INACTIVE) {
    return (
      <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
        Inativo
      </Badge>
    )
  }

  return (
    <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
      Fora de estoque
    </Badge>
  )
}
