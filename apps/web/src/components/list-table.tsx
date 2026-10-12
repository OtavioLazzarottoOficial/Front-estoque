import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import type { ReactNode } from "react"

interface ListTableProps<T> {
  data: T[] | undefined
  headers: string[]
  renderRow: (item: T) => ReactNode
  emptyMessage?: string
}

export function ListTable<T>({
  data,
  headers,
  renderRow,
  emptyMessage = "Nenhum registro encontrado!",
}: ListTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header) => (
            <TableHead key={header} className="capitalize">
              {header}
            </TableHead>
          ))}
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data && data.length > 0 ? (
          data.map((item) => renderRow(item))
        ) : (
          <TableRow>
            <TableCell colSpan={headers.length + 1} className="p-4 text-center">
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
