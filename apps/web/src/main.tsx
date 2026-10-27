import ReactDOM from "react-dom/client"
import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"
import "@workspace/ui/globals.css"
import { AuthProvider, useAuth } from "./auth/auth"
import { Toaster } from "@workspace/ui/components/toast"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 5 * 60 * 1000,
      staleTime: 30 * 1000,
    },
  },
})

// Set up a Router instance
const router = createRouter({
  routeTree,
  context: { auth: undefined! },
  defaultPreload: "intent",
  scrollRestoration: true,
})

setupRouterSsrQueryIntegration({
  router,
  queryClient,
  hydrateOptions: {
    defaultOptions: {
      queries: {
        gcTime: 5 * 60 * 1000,
      },
    },
  },
})

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster>
        <AuthProvider>
          <InnerApp />
        </AuthProvider>
      </Toaster>
      {import.meta.env.DEV ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  )
}

const rootElement = document.getElementById("app")!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
