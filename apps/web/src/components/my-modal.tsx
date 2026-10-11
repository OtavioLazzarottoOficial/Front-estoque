import { Plus } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

export default function Modal() {
  return (
    <div>
      <Dialog>
        <DialogTrigger
          render={
            <Button variant={"default"} className={"p-5"}>
              Adicionar <Plus />
            </Button>
          }
        />

        <DialogContent className={"w-4xl"}>
          <DialogHeader>
            <DialogTitle>Cadastrar Produto</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="name">Full name</FieldLabel>
              <Input id="name" autoComplete="off" placeholder="Evil Rabbit" />
              <FieldDescription className="text-red-600">
                This appears on invoices and emails.
              </FieldDescription>
            </Field>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  )
}
