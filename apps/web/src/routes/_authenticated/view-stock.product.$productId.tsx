import { SkeletonTable } from "@/components/skeleton-table"
import { useGetStockByProduct } from "@/hooks/useGetStockByProduct"
import { createFileRoute } from "@tanstack/react-router"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

export const Route = createFileRoute(
  "/_authenticated/view-stock/product/$productId"
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { productId } = Route.useParams()

  const { data: stock, isPending } = useGetStockByProduct(productId)

  return (
    <div className="flex min-h-svh justify-center p-6">
      <div className="flex w-[70%] flex-col gap-4 text-sm leading-loose">
        <div className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white p-2 shadow-lg">
          {isPending ? (
            <SkeletonTable length={6} />
          ) : (
            <Table>
              <TableCaption>
                <span className="font-extrabold">
                  Estoque referente ao produto
                </span>
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Imagem</TableHead>
                  <TableHead>Quantidade em estoque</TableHead>
                  <TableHead>Quantidade Maxima</TableHead>
                  <TableHead>Quantidade Minima</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stock ? (
                  <TableRow>
                    <TableCell className="font-bold">
                      {stock?.product?.name}
                    </TableCell>
                    <TableCell>
                      {stock?.product?.images?.[0]?.url ? (
                        <img
                          src={stock.product.images[0].url}
                          alt={stock?.product?.name ?? "Imagem do produto"}
                          className="h-10 w-10 rounded-md border object-cover"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Sem imagem
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{stock?.quantityInStock}</TableCell>
                    <TableCell>{stock?.quantityMax}</TableCell>
                    <TableCell>{stock?.quantityMin}</TableCell>
                  </TableRow>
                ) : (
                  <TableCell colSpan={4}>
                    <p className="text-center font-bold">Produto sem estoque</p>
                  </TableCell>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}
