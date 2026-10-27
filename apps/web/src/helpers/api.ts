import axios from "axios"

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
