import { auth, type Authenticate, type Token } from "@/hooks/useAuthenticate"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Controller, useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { authenticateFormZodSchema } from "@/schemas/authenticateFormZodSchema"

import { useMutation } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"

export const Route = createFileRoute("/")({
  component: Login,
})

function Login() {
  const navigate = useNavigate()
  const { control, handleSubmit, setValue } = useForm<Authenticate>({
    resolver: zodResolver(authenticateFormZodSchema),
  })

  const { mutate, data: token } = useMutation<
    string | undefined,
    Error,
    Authenticate
  >({
    mutationKey: ["authenticate"],
    mutationFn: async (data: Authenticate) => await auth(data),
  })

  const onSubmit: SubmitHandler<Authenticate> = (data) => {
    mutate(data)
    setValue("email", "")
    setValue("password", "")

    if (token) {
      localStorage.setItem("token", JSON.stringify(token.access_token))

      navigate({ to: "/dashboard" })
      alert("Login successful!")
    } else {
      alert("Login failed. Please check your credentials.")
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <form className="flex h-auto w-xl" onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full">
          <CardHeader className="space-y-2">
            <CardTitle>Faça seu login</CardTitle>
            <CardDescription>
              Entre com seu e-mail e senha para acessar o sistema!
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-4">
            <div className="flex flex-col gap-6">
              <div className="grid gap-4">
                <Label htmlFor="email">Email</Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  )}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="********"
                      required
                    />
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-2">
            <Button type="submit" className="w-full">
              Login
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
