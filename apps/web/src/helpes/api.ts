import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:3333/",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`)
  }
  return config
})
