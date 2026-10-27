# Melhorias Realizadas no Projeto Front-estoque

**Data:** 2026-10-24  
**Projeto:** Front-estoque (Monorepo com Turborepo, Vite + React 19 + TanStack Router/Query + shadcn/ui)

Este documento detalha todas as melhorias implementadas, mostrando o estado anterior, as alterações feitas e as lições aprendidas para aplicar em projetos futuros.

---

## Sumário

- [Melhorias Realizadas no Projeto Front-estoque](#melhorias-realizadas-no-projeto-front-estoque)
  - [Sumário](#sumário)
  - [1) Integração correta do React Query](#1-integração-correta-do-react-query)
  - [2) Padronização e robustez da autenticação (JWT)](#2-padronização-e-robustez-da-autenticação-jwt)
  - [3) Correção do fluxo de login](#3-correção-do-fluxo-de-login)
  - [4) Centralização e tipagem da chamada de autenticação](#4-centralização-e-tipagem-da-chamada-de-autenticação)
  - [5) Melhoria do cliente HTTP (API)](#5-melhoria-do-cliente-http-api)
  - [6) Correção de imports (renomeação `helpes` → `helpers`)](#6-correção-de-imports-renomeação-helpes--helpers)
  - [7) Melhoria na tipagem do Router (TanStack Router)](#7-melhoria-na-tipagem-do-router-tanstack-router)
  - [8) Configuração de variáveis de ambiente](#8-configuração-de-variáveis-de-ambiente)
  - [9) Sugestões para próximos projetos (lições aprendidas)](#9-sugestões-para-próximos-projetos-lições-aprendidas)
    - [Autenticação \& Segurança](#autenticação--segurança)
    - [Gerenciamento de Estado/Query](#gerenciamento-de-estadoquery)
    - [Arquitetura \& Organização](#arquitetura--organização)
    - [UX/DX](#uxdx)
  - [Arquivos Modificados](#arquivos-modificados)
  - [Arquivos Criados](#arquivos-criados)

---

## 1) Integração correta do React Query

**Arquivo:** `apps/web/src/main.tsx`

### Como estava antes
- `QueryClient` era instanciado, mas **nunca envolto em `QueryClientProvider`**.
- `useMutation`/`useQuery` poderiam não funcionar corretamente em toda a árvore.
- Faltavam `ReactQueryDevtools` para facilitar debug em desenvolvimento.

### Como ficou
- Adicionado `QueryClientProvider` envolvendo toda a aplicação.
- Configurações padrão adicionadas ao `QueryClient` (`gcTime`, `staleTime`).
- `@tanstack/react-query-devtools` adicionado apenas em `import.meta.env.DEV`.
- Mantida a integração com TanStack Router SSR Query.

```tsx
// Antes: sem provider
const queryClient = new QueryClient()
// ...
function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  )
}

// Depois: com provider + devtools
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 5 * 60 * 1000,
      staleTime: 30 * 1000,
    },
  },
})
// ...
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
```

**Lição:** Sempre providencie o `QueryClient` no topo da aplicação. Sem isso, hooks do React Query não compartilham cache e podem falhar em runtime.

---

## 2) Padronização e robustez da autenticação (JWT)

**Arquivo:** `apps/web/src/auth/auth.tsx`

### Como estava antes
- `isLoading` sempre `false` (sem estado real de inicialização).
- `getInitialUser` decodificava sem `try/catch` (token malformado quebrava a inicialização).
- `login` logava o token inteiro no console (`console.log("Token received:", token)`) - **risco de vazamento em logs**.
- Sem sincronização entre abas (alterações no `localStorage` não refletiam no estado).
- `login/logout` não eram memoizados.
- Tipos exportados limitados.

### Como ficou
- `isLoading` gerenciado corretamente (inicializado como `false` após checagem, mas estrutura pronta para estados assíncronos).
- Tratamento robusto com `try/catch` em `getInitialUser`, `login` e sincronização via `storage` event.
- **Removido `console.log` com token sensível**.
- Listener `storage` para sincronizar login/logout entre múltiplas abas do navegador.
- `useCallback`/`useMemo` para evitar re-render desnecessário.
- Tipos exportados (`User`, `AuthContextProps`) para uso em outros arquivos (melhor tipagem global).

```tsx
// Antes: sem try/catch, log sensível, sem sync entre abas
function login(token: string) {
  console.log("Token received:", token)
  localStorage.setItem("token", token)
  const decoded = jwtDecode<User>(token)
  setUser(decoded)
}

// Depois: robusto, sem logs sensíveis, sincronizado
const login = React.useCallback((token: string) => {
  try {
    if (!token) throw new Error("Token is required to login")
    localStorage.setItem("token", token)
    const decoded = jwtDecode<User & { exp?: number }>(token)
    setAuthState({ user: decoded as User, isLoading: false })
  } catch (error) {
    console.error("Failed to login with token", error)
    localStorage.removeItem("token")
    setAuthState({ user: null, isLoading: false })
  }
}, [])
```

**Lições:**
- **Nunca logar tokens** ou dados sensíveis no console.
- Sempre validar/decodificar com `try/catch` (dados corrompidos podem vir do `localStorage`).
- Considerar sincronização entre abas para UX consistente.
- `jwt-decode` apenas decodifica - não valida assinatura. A verificação de `exp` é boa, mas não substitui validação server-side.

---

## 3) Correção do fluxo de login

**Arquivo:** `apps/web/src/routes/index.tsx`

### Como estava antes
- `mutate(data)` chamado sem aguardar (`onSubmit` síncrono) - **erro crítico de fluxo**.
- Lendo `token` do closure logo após `mutate()` (sempre desatualizado/inexistente no momento da checagem).
- Campos limpos com `setValue` antes de saber se login foi bem-sucedido.
- Salvando token com `JSON.stringify(token.access_token)` - **inconsistente com resto da aplicação**.
- Navegação e feedback (`alert`) fora do tratamento de sucesso/erro.
- Importava `type Token` inexistente/irrelevante.

### Como ficou
- Uso de `useMutation` com `onSuccess`/`onError` (tratamento assíncrono correto).
- Integrado com `useAuth().login()` para centralizar lógica de armazenamento/decodificação.
- Exibição de loading (`isPending`) e desabilitação do botão durante requisição.
- Mensagens de erro acessíveis (sem `alert` intrusivo).
- Exibição de erros de validação do Zod abaixo de cada campo.
- Campos não são mais limpos prematuramente.

```tsx
// Antes: incorreto
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

// Depois: correto com onSuccess
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
```

**Lições:**
- Nunca use estado retornado por mutação síncrona logo após `mutate()`. Use `onSuccess`/`onError` ou `mutateAsync` com `await`.
- Centralize efeitos colaterais (navegação, armazenamento, toasts) em callbacks de mutation.
- Evite `alert()` - prefira mensagens inline para melhor UX.
- Sempre mostre estado de loading e feedback de erro.

---

## 4) Centralização e tipagem da chamada de autenticação

**Arquivo:** `apps/web/src/hooks/useAuthenticate.ts`

### Como estava antes
- Retorno `Promise<string | undefined>` genérico.
- `api.post<string>("auth", data)` assumindo resposta é string bruta.
- Em caso de erro apenas logava e retornava `undefined` (ocultava erro do React Query).
- Tipo `Token` importado mas não definido/utilizado.
- Import usava caminho antigo `@/helpes/api`.

### Como ficou
- Função lança erro em caso de falha (permite `onError` do React Query funcionar corretamente).
- Suporta múltiplos formatos de resposta (`string`, `{ access_token }`, `{ token }`, `{ accessToken }`) - mais resiliente a variações de API.
- Tipagem clara com `AuthTokenResponse`, `AuthResponse`.
- Import corrigido para `@/helpers/api`.

```tsx
// Antes
export async function auth(data: Authenticate): Promise<string | undefined> {
  try {
    const response = await api.post<string>("auth", data)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

// Depois
export async function auth(data: Authenticate): Promise<string> {
  const response = await api.post<AuthResponse>("auth", data)
  const responseData = response.data

  if (typeof responseData === "string") return responseData
  if (responseData?.access_token) return responseData.access_token
  if (responseData?.token) return responseData.token
  if (responseData?.accessToken) return responseData.accessToken

  throw new Error("Token not found in authentication response")
}
```

**Lições:**
- Não engula erros silenciosamente. Deixe o chamador (React Query) decidir como tratar.
- APIs nem sempre retornam no mesmo formato. Ser defensivo com normalização ajuda na integração.
- Tipagem explícita evita bugs e melhora autocomplete.

---

## 5) Melhoria do cliente HTTP (API)

**Arquivo:** `apps/web/src/helpers/api.ts` (renomeado de `helpes/api.ts`)

### Como estava antes
- `baseURL` hardcoded `http://localhost:3333/`
- Timeout curto (5000ms)
- Sem tratamento de erros 401
- Interceptor sem `try/catch`
- Sem suporte a variáveis de ambiente

### Como ficou
- `baseURL` via `import.meta.env.VITE_API_URL` com fallback
- Timeout aumentado para 10s (mais tolerante)
- Interceptor de **request** com `try/catch`
- Interceptor de **response** tratando `401` (limpa token localmente) - prepara para fluxo de logout/redirect
- Mais resiliente

```tsx
// Antes
export const api = axios.create({
  baseURL: "http://localhost:3333/",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
})

// Depois
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3333/"

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`)
    }
  } catch (error) {
    console.error("Failed to attach auth token to request", error)
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      try {
        localStorage.removeItem("token")
      } catch (e) {
        console.error("Failed to clear token on 401", e)
      }
    }
    return Promise.reject(error)
  }
)
```

**Lições:**
- **Nunca hardcode URLs** - use variáveis de ambiente por ambiente.
- Trate `401` centralmente (aqui apenas limpa token; idealmente redirecionar para login).
- Adicione `try/catch` em acessos ao `localStorage` (pode falhar em modo privado/SSR).
- Configure timeouts razoáveis.

---

## 6) Correção de imports (renomeação `helpes` → `helpers`)

**Pastas/Arquivos afetados:**
- Renomeado `apps/web/src/helpes/` → `apps/web/src/helpers/`
- Atualizados imports em:
  - `apps/web/src/hooks/useAuthenticate.ts`
  - `apps/web/src/hooks/useProducts.ts`
  - `apps/web/src/hooks/useDeleteProduct.ts`
  - `apps/web/src/hooks/useInsertProduct.ts`
  - `apps/web/src/hooks/useInsertStock.ts`
  - `apps/web/src/hooks/useGetStockByProduct.ts`

**Lição:** Erros de digitação em nomes de pastas se propagam. Use busca global (`grep`) para corrigir todos os imports de uma vez.

---

## 7) Melhoria na tipagem do Router (TanStack Router)

**Arquivo:** `apps/web/src/main.tsx`

### Como ficou
- Adicionado augmentation de `RouteContext` para incluir `auth: AuthContextProps`.
- Melhora autocomplete e type-safety em `beforeLoad`, loaders e componentes que usam contexto.

```tsx
// Augment router context types
declare module "@tanstack/react-router" {
  interface RouteContext {
    auth: AuthContextProps
  }
}
```

**Lição:** Sempre estenda os tipos do TanStack Router quando customizar contexto. Evita `any` implícito e pega erros em tempo de desenvolvimento.

---

## 8) Configuração de variáveis de ambiente

**Arquivo criado:** `apps/web/.env.example`

```env
VITE_API_URL=http://localhost:3333/
```

**Lição:**
- Sempre crie `.env.example` com chaves necessárias (sem valores sensíveis reais).
- Adicione `.env` ao `.gitignore` (já presente no projeto).
- Documente no README como configurar variáveis locais.

---

## 9) Sugestões para próximos projetos (lições aprendidas)

### Autenticação & Segurança
- **Não armazene tokens em `localStorage` se puder evitar.** Prefira cookies `HttpOnly` + `Secure` + `SameSite` gerenciados pelo backend (protege contra XSS).
- **Nunca logue dados sensíveis** (tokens, senhas, PII).
- **Valide expiração** (feito), mas considere renovação com refresh token.
- **Centralize auth** - componentes não devem manipular `localStorage` diretamente (feito com `AuthProvider`).
- **Sincronize entre abas** (implementado) - importante para UX.

### Gerenciamento de Estado/Query
- **Sempre providencie QueryClient** com `QueryClientProvider`.
- **Use `onSuccess`/`onError`** ao invés de ler dados de mutation imediatamente após `mutate()`.
- **Não engula erros** em funções de API - deixe React Query tratar.
- **Configure defaults** (`staleTime`, `gcTime`) conforme necessidade.

### Arquitetura & Organização
- **Nomenclatura consistente** - evite typos em pastas (`helpers` não `helpes`).
- **Separação de responsabilidades** - auth no provider/contexto, chamadas HTTP em hooks/services, UI em componentes.
- **Tipagem forte** - estenda tipos de bibliotecas (Router context, Query, etc.).
- **Variáveis de ambiente** - nunca hardcode URLs/chaves.

### UX/DX
- **Feedback claro** - loading states, mensagens de erro inline (evite `alert`).
- **Acessibilidade** - use `aria-invalid`, labels corretos, mensagens associadas.
- **Devtools** apenas em desenvolvimento.
- **Tratamento de erros** em inicialização (evitar crash por dados corrompidos).

---

## Arquivos Modificados

| Arquivo | Alteração |
| --- | --- |
| `apps/web/src/main.tsx` | Adicionado `QueryClientProvider`, `ReactQueryDevtools`, tipos de contexto do router, config do QueryClient |
| `apps/web/src/auth/auth.tsx` | Robusto com try/catch, removido log sensível, sync entre abas, callbacks memoizados, tipos exportados |
| `apps/web/src/routes/index.tsx` | Fluxo de login corrigido com onSuccess/onError, uso de `useAuth().login()`, loading/erros inline |
| `apps/web/src/hooks/useAuthenticate.ts` | Tipagem correta, suporta múltiplos formatos de resposta, lança erros, import corrigido |
| `apps/web/src/helpers/api.ts` | Env var para baseURL, interceptors melhorados, tratamento 401, try/catch |
| `apps/web/src/hooks/useProducts.ts` | Corrigido import `helpes` → `helpers` |
| `apps/web/src/hooks/useDeleteProduct.ts` | Corrigido import `helpes` → `helpers` |
| `apps/web/src/hooks/useInsertProduct.ts` | Corrigido import `helpes` → `helpers` |
| `apps/web/src/hooks/useInsertStock.ts` | Corrigido import `helpes` → `helpers` |
| `apps/web/src/hooks/useGetStockByProduct.ts` | Corrigido import `helpes` → `helpers` |

## Arquivos Criados

| Arquivo | Descrição |
| --- | --- |
| `apps/web/.env.example` | Exemplo de variáveis de ambiente necessárias |
| `MELHORIAS_REALIZADAS.md` | Este documento |
| `apps/web/src/helpers/` | Pasta renomeada (substituindo `helpes/`) |
