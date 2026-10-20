import { createFileRoute, Link } from "@tanstack/react-router"

import { useQuery } from "@tanstack/react-query"

import type { ProductProps } from "@/types/product"

import PaginationComponent from "@/components/pagination-component"
import { fetchProducts } from "@/hooks/useProducts"
import { Field } from "@workspace/ui/components/field"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { ListTable } from "@/components/list-table"
import {
  EyeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  Search,
  TrashIcon,
} from "lucide-react"
import PostModal from "@/components/post-modal"
import { fetchCategories } from "@/hooks/useCategories"
import { TableCell, TableRow } from "@workspace/ui/components/table"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Toggle } from "@workspace/ui/components/toggle"
import { Spinner } from "@workspace/ui/components/spinner"
import { useDeleteProduct } from "@/hooks/useDeleteProduct"
import { SkeletonTable } from "@/components/skeleton-table"

export const Route = createFileRoute("/_authenticated/product-list")({
  component: ProductList,
  loader: async () => fetchProducts(),
})

function ProductList() {
  const products: ProductProps[] = Route.useLoaderData()
  const { mutate, isPending } = useDeleteProduct()

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await fetchCategories(),
  })

  const handleDelete = (id: string) => {
    mutate(id)
  }
  return (
    <div className="flex min-h-svh justify-center p-6">
      <div className="flex w-[70%] flex-col gap-4 text-sm leading-loose">
        <div className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white p-2 shadow-lg">
          <Field className="w-64">
            <ButtonGroup>
              <Input id="input-button-group" placeholder="Buscar produto..." />
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </ButtonGroup>
          </Field>

          <Field className="w-32">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASC">Asc</SelectItem>
                <SelectItem value="DESC">Desc</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field className="w-64">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <PostModal categories={categories} />
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 shadow-lg">
          {isPending ? (
            <SkeletonTable length={6} />
          ) : (
            <ListTable
              data={products}
              headers={[
                "Nome",
                "Descrição",
                "Categoria",
                "SKU",
                "Preço",
                "Status",
              ]}
              emptyMessage="Nenhum produto cadastrado!"

              renderRow={(product) => (
                <TableRow key={product.id}>
                  <TableCell className="p-4">{product.name}</TableCell>
                  <TableCell>
                    {product.description.substring(0, 20)}...
                  </TableCell>
                  <TableCell>{product.category?.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>R$ {product.price}</TableCell>
                  <TableCell>
                    <Toggle variant={"outline"} aria-label="Toggle default">
                      {product.status === "ACTIVE" ? "Ativo" : "Inativo"}
                    </Toggle>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="link" size="icon" className="size-8">
                            <MoreHorizontalIcon />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="start" sideOffset={4}>
                        <DropdownMenuGroup>
                          <DropdownMenuItem className="cursor-pointer">
                            <PencilIcon />
                            Editar
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleDelete(product.id)}
                          >
                            <TrashIcon />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <Link
                            to="/view-stock/product/$productId"
                            params={{ productId: product.id }}
                          >
                            <DropdownMenuItem className="cursor-pointer">
                              <PlusIcon />
                              Adicionar estoque
                            </DropdownMenuItem>
                          </Link>
                          <Link
                            to="/view-stock/product/$productId"
                            params={{ productId: product.id }}
                          >
                            <DropdownMenuItem className="cursor-pointer">
                              <EyeIcon />
                              Ver estoque
                            </DropdownMenuItem>
                          </Link>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )}
            />
          )}
        </div>

        <PaginationComponent />
      </div>
    </div>
  )
}
