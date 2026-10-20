import { Button } from "@workspace/ui/components/button"
import { Spinner } from "@workspace/ui/components/spinner"

export function SpinnerButton() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button disabled size="sm" variant={"default"}>
        <Spinner data-icon="inline-start" />
        Cadastrando...
      </Button>
    </div>
  )
}
