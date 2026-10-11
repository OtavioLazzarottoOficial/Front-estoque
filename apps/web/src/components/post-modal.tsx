import type { CategoryProps } from "@/types/category"
import { Button } from "@workspace/ui/components/button"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Textarea } from "@workspace/ui/components/textarea"
import { Plus } from "lucide-react"

interface PostModalProps {
  categories: CategoryProps[] | undefined
}

export default function PostModal({ categories }: PostModalProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant={"default"}>
            Adicionar <Plus />
          </Button>
        }
      />

      <DialogContent>
        <form>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Cadastrar Produto</FieldLegend>
              <FieldDescription>
                Preencha todos os campos com informações do produto
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Nome</FieldLabel>
                  <Input id="name" placeholder="Nome do produto..." required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="price">Preço</FieldLabel>
                  <Input
                    id="price"
                    placeholder="Digite o valor do produto..."
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="category">Categoria</FieldLabel>

                  {categories && categories.length > 0 ? (
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value={"Nenhuma categoria cadastrada"}>
                            Nenhuma categoria cadastrada
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />

            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="description">Descrição</FieldLabel>
                  <Textarea
                    id="description"
                    placeholder="Digite a descrição do produto"
                    className="resize-none"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
            <Field orientation="horizontal">
              <Button type="submit">Cadastrar</Button>
              <DialogClose
                render={
                  <Button variant={"outline"} type="button">
                    Cancelar
                  </Button>
                }
              />
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
