

interface Authenticate {
    email: string
    password: string 
}

export async function auth(data: Authenticate): Promise<string | undefined> {
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

    const token: string = (await response.json()) as string
    return token
  } catch (error) {
    console.error(error)
  }
}