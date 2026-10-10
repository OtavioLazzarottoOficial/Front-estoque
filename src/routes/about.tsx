import { DialogDemo } from "@/components/dialog-demo"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/about")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello "/about"! <DialogDemo />
    </div>
  )
}
