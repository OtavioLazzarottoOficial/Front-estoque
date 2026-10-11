import {
  Table,
  TableBody,
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
import { Button } from "@workspace/ui/components/button"
import { MoreHorizontalIcon } from "lucide-react"
import type { ProductProps } from "@/types/product"

interface TableProps {
  products: ProductProps[] | undefined
}

export function ListTable({ products }: TableProps) {
  return (
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
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem variant="destructive">Editar</DropdownMenuItem>
                    <DropdownMenuItem>Deletar</DropdownMenuItem>
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
  )
}
