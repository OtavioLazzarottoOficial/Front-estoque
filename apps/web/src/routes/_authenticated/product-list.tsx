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
  ImageIcon,
  MoreHorizontalIcon,
  PencilIcon,
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@workspace/ui/components/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Badge } from "@workspace/ui/components/badge"
import { useDeleteProduct } from "@/hooks/useDeleteProduct"
import { SkeletonTable } from "@/components/skeleton-table"
import InsertStockModal from "@/components/insert-stock-modal"
import React from "react"

export const Route = createFileRoute("/_authenticated/product-list")({
  component: ProductList,
  loader: async () => fetchProducts(),
})

function ProductList() {
  const products: ProductProps[] = Route.useLoaderData()
  const { mutate, isPending } = useDeleteProduct()

  const [item, setItem] = React.useState<string>("")

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await fetchCategories(),
  })

  const handleDelete = (id: string) => {
    mutate(id)
  }

  const filteredProducts = React.useMemo(() => {
    if (!products) return []
    return products.filter((cat) =>
      cat.name.toLowerCase().includes(item.toLowerCase())
    )
  }, [products, item])

  console.log(products)

  return (
    <div className="flex min-h-svh justify-center p-6">
      <div className="flex w-[70%] flex-col gap-4 text-sm leading-loose">
        <div className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white p-2 shadow-lg">
          <Field className="w-64">
            <ButtonGroup>
              <Input
                value={item}
                onChange={(e) => {
                  setItem(e.target.value)
                }}
                id="input-button-group"
                placeholder="Buscar produto..."
              />
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
              data={filteredProducts}
              headers={[
                "Foto",
                "Nome",
                "Descrição",
                "Categoria",
                "SKU",
                "Preço",
                "Status",
              ]}
              emptyMessage="Nenhum produto cadastrado!"
              renderRow={(product) => {
                return (
                  <TableRow key={product.id}>
                    <TableCell className="p-2">
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images?.[0]?.url}
                          alt={product.name}
                          className="h-10 w-10 rounded-md border border-gray-200 object-cover shadow-xs"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="p-4 font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      {product.description.substring(0, 20)}...
                    </TableCell>
                    <TableCell>{product.category?.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>R$ {product.price}</TableCell>
                    <TableCell>
                      {product.status === "ACTIVE" && (
                        <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                          Ativo
                        </Badge>
                      )}

                      {product.status === "INACTIVE" && (
                        <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          Inativo
                        </Badge>
                      )}

                      {product.status === "OUT_OF_STOCK" && (
                        <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
                          Fora de estoque
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="link"
                              size="icon"
                              className="size-8"
                            >
                              <MoreHorizontalIcon />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="start" sideOffset={4}>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              Estoque
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <Link
                                  to="/view-stock/product/$productId"
                                  params={{ productId: product.id }}
                                >
                                  <DropdownMenuItem className="cursor-pointer">
                                    <EyeIcon />
                                    Visualizar
                                  </DropdownMenuItem>
                                </Link>

                                <InsertStockModal
                                  productId={product.id}
                                  produtoName={product.name}
                                />
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>

                          <DropdownMenuSeparator />

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
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              }}
            />
          )}
        </div>

        <PaginationComponent />
      </div>
    </div>
  )
}
