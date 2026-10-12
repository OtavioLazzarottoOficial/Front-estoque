import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/stock-list")({
  component: StockList,
})

function StockList() {
  return <div>Hello "/stock-list"!</div>
}
