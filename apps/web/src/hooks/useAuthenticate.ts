export interface Authenticate {
  email: string
  password: string
}

export interface Token {
  access_token: string
}

export async function auth(data: Authenticate): Promise<Token | undefined> {
  try {
    const response = await fetch("http://localhost:3333/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to post product")
    }

    const token: Token = (await response.json()) as Token

    console.log("Token:", token)
    return token
  } catch (error) {
    console.error(error)
  }
}
