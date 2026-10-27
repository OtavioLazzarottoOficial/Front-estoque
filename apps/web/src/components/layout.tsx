import type { ReactNode } from "react"
import { Toaster } from "@workspace/ui/components/toast"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
