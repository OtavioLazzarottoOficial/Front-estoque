import { createFileRoute } from "@tanstack/react-router"

import { MoreHorizontalIcon, Search } from "lucide-react"

import type { ProductProps } from "@/types/product"

import Modal from "@/components/my-modal"
import PaginationComponent from "@/components/pagination-component"
import { fetchProducts } from "@/hooks/useFetchProducts"
import { Field } from "@workspace/ui/components/field"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => fetchProducts(),
})

function App() {
  const products: ProductProps[] = Route.useLoaderData()

  return (
    <div className="flex min-h-svh justify-center p-6">
      <div className="flex w-1/2 flex-col gap-4 text-sm leading-loose">
        <div className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white p-2 shadow-lg">
          <Field className="w-64">
            <ButtonGroup>
              <Input id="input-button-group" placeholder="Buscar produto..." />
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </ButtonGroup>
          </Field>

          <Modal />
        </div>

        <div className="flex items-center gap-2">
          <Table className="border-rounded-lg rounded-lg bg-white shadow-lg">
            <TableHeader>
              <TableRow>
                <TableHead className="p-4">Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="p-4">{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>R$ {product.price}</TableCell>
                    {product.status === "ACTIVE" ? (
                      <TableCell>Ativo</TableCell>
                    ) : (
                      <TableCell>Inativo</TableCell>
                    )}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                            >
                              <MoreHorizontalIcon />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <p>Nenhum produto cadastrado!</p>
              )}
            </TableBody>
          </Table>
        </div>

        <PaginationComponent />
      </div>
    </div>
  )
}
