import ReactDOM from "react-dom/client"
import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"
import "@workspace/ui/globals.css"
import { AuthProvider, useAuth, type AuthContextProps } from "./auth/auth"

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
  interface HistoryState {
    // extend if needed
  }
}

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

// Augment router context types
declare module "@tanstack/react-router" {
  interface RouteContext {
    auth: AuthContextProps
  }
}

function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
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
