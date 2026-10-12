import { ListTable } from "@/components/list-table"
import PaginationComponent from "@/components/pagination-component"
import PostCategoryModal from "@/components/post-category-modal"
import { fetchCategories } from "@/hooks/useFetchCategories"
import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@workspace/ui/components/dropdown-menu"
import { Field } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { TableCell, TableRow } from "@workspace/ui/components/table"
import { MoreHorizontalIcon, Search } from "lucide-react"

export const Route = createFileRoute("/category-list")({
  component: CategoryList,
  loader: async () => fetchCategories(),
})

function CategoryList() {
  const categories = Route.useLoaderData()

  return (
    <div className="flex min-h-svh justify-center p-6">
      <div className="flex w-1/2 flex-col gap-4 text-sm leading-loose">
        <div className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white p-2 shadow-lg">
          <Field className="w-64">
            <ButtonGroup>
              <Input
                id="input-button-group"
                placeholder="Buscar categoria..."
              />
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </ButtonGroup>
          </Field>

          <PostCategoryModal />
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 shadow-lg">
          <ListTable
            data={categories}
            headers={["Nome", "Descrição"]}
            emptyMessage="Nenhuma categoria cadastrada!"
            renderRow={(category) => (
              <TableRow key={category.id}>
                <TableCell className="p-4">{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
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
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive">
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )}
          />
        </div>

        <PaginationComponent />
      </div>
    </div>
  )
}
