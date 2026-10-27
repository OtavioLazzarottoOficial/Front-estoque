import { auth, type Authenticate } from "@/hooks/useAuthenticate"
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
import { useAuth } from "@/auth/auth"

import { useMutation } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Boxes, Eye, EyeOff, Loader2 } from "lucide-react"

export const Route = createFileRoute("/")({
  component: Login,
})

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Authenticate>({
    resolver: zodResolver(authenticateFormZodSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { mutate, isPending } = useMutation<string, Error, Authenticate>({
    mutationKey: ["authenticate"],
    mutationFn: async (data: Authenticate) => await auth(data),
    onSuccess: (token) => {
      setErrorMessage(null)
      login(token)
      navigate({ to: "/dashboard" })
    },
    onError: (error) => {
      console.error("Authentication failed", error)
      setErrorMessage("Login falhou. Verifique suas credenciais e tente novamente.")
    },
  })

  const onSubmit: SubmitHandler<Authenticate> = (data) => {
    setErrorMessage(null)
    mutate(data)
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-br from-background via-background to-muted/40 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Boxes className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">My Estoque</h1>
          <p className="text-sm text-muted-foreground">
            Acesse sua conta para gerenciar seu estoque
          </p>
        </div>
        <Card className="border-border/60 shadow-lg shadow-primary/5">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Faça seu login</CardTitle>
            <CardDescription>
              Entre com seu e-mail e senha para acessar o sistema
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="seuemail@exemplo.com"
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      disabled={isPending}
                    />
                  )}
                />
                {errors.email ? (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        autoComplete="current-password"
                        aria-invalid={!!errors.password}
                        disabled={isPending}
                        className="pr-10"
                      />
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    disabled={isPending}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password ? (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>
              {errorMessage ? (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {errorMessage}
                </div>
              ) : null}
            </CardContent>
            <CardFooter className="flex-col pt-4">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} My Estoque. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
