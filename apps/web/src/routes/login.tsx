import { auth } from "@/hooks/useAuthenticate"
import { createFileRoute } from "@tanstack/react-router"
import type React from "react"
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

export const Route = createFileRoute("/login")({
  component: Login,
})

function Login() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const token = await auth({ email, password })
      if (token) {
        localStorage.setItem("token", JSON.stringify(token))
        // Redirect to the dashboard or another page after successful login
        window.location.href = "/dashboard"
      } else {
        alert("Login failed. Please check your credentials.")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred during login. Please try again.")
    }
  }

  return (
    <div className="flex justify-center">
      <div className="flex w-xl gap-4">
        <Card className="w-full">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Faça seu login</CardTitle>
              <CardDescription>
                Entre com seu e-mail e senha para acessar o sistema!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    onChange={(e) => e.currentTarget.value}
                    placeholder="m@example.com"
                    required
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
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    onChange={(e) => e.currentTarget.value}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                Login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
