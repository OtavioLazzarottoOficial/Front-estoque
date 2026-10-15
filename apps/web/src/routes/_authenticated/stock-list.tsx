import { useAuth } from "@/auth/auth"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/stock-list")({
  component: StockList,
})

function StockList() {
  const auth = useAuth()

  console.log(auth.user)
  return <div>{auth.user?.user_email}</div>
}
