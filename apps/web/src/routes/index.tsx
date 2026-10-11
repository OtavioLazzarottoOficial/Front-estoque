import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import type { ProductProps } from "@/types/product"

import PaginationComponent from "@/components/pagination-component"
import { fetchProducts } from "@/hooks/useFetchProducts"
import { Field } from "@workspace/ui/components/field"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { ListTable } from "@/components/list-table"
import { Search } from "lucide-react"
import PostModal from "@/components/post-modal"
import { fetchCategories } from "@/hooks/useFetchCategories"

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => fetchProducts(),
})

function App() {
  const products: ProductProps[] = Route.useLoaderData()

  const { data: categoires } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await fetchCategories(),
  })

  console.log(categoires)

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

          <PostModal />
        </div>

        <div className="flex items-center gap-2">
          <ListTable products={products} />
        </div>

        <PaginationComponent />
      </div>
    </div>
  )
}
