import { fetchProductById } from "@/hooks/useProducts"
import type { ProductProps } from "@/types/product"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/_authenticated/view-stock/product/$productId"
)({
  component: RouteComponent,
  loader: async ({ params }) => {
    return fetchProductById(params.productId)
  },
})

function RouteComponent() {
  const product: ProductProps | undefined = Route.useLoaderData()
  return <div>Product {product?.name}</div>
}
