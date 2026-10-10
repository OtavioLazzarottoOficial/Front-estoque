import { createFileRoute } from "@tanstack/react-router"

import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogDemo } from "@/components/dialog-demo"


export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="flex min-h-svh justify-center p-6">
      <div className="flex flex-col gap-4 text-sm leading-loose">
        <div className="flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 shadow-black">
          <Field className="w-64">
            <ButtonGroup>
              <Input id="input-button-group" placeholder="Buscar produto..." />
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </ButtonGroup>
          </Field>

          <DialogDemo />
        </div>

        <div className="flex items-center gap-2 bg-amber-50">
          <Table className="border border-gray-300 bg-white p-4">
            <TableCaption className="bg-white">
              Produtos cadastrados no estoque
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow>
                <TableCell>Produto A</TableCell>
                <TableCell>Descrição do Produto A</TableCell>
                <TableCell>SKU001</TableCell>
                <TableCell>R$ 100,00</TableCell>
                <TableCell>Disponível</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Produto B</TableCell>
                <TableCell>Descrição do Produto B</TableCell>
                <TableCell>SKU002</TableCell>
                <TableCell>R$ 200,00</TableCell>
                <TableCell>Indisponível</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Produto C</TableCell>
                <TableCell>Descrição do Produto C</TableCell>
                <TableCell>SKU003</TableCell>
                <TableCell>R$ 300,00</TableCell>
                <TableCell>Disponível</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Produto D</TableCell>
                <TableCell>Descrição do Produto D</TableCell>
                <TableCell>SKU004</TableCell>
                <TableCell>R$ 400,00</TableCell>
                <TableCell>Indisponível</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Produto E</TableCell>
                <TableCell>Descrição do Produto E</TableCell>
                <TableCell>SKU005</TableCell>
                <TableCell>R$ 500,00</TableCell>
                <TableCell>Disponível</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Produto F</TableCell>
                <TableCell>Descrição do Produto F</TableCell>
                <TableCell>SKU006</TableCell>
                <TableCell>R$ 600,00</TableCell>
                <TableCell>Indisponível</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
