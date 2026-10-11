import ReactDOM from "react-dom/client"
import { QueryClient } from "@tanstack/react-query"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"
import "@workspace/ui/globals.css"

const queryClient = new QueryClient()

// Set up a Router instance
const router = createRouter({
  routeTree,
  context: { queryClient },
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

const rootElement = document.getElementById("app")!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<RouterProvider router={router} />)
}
