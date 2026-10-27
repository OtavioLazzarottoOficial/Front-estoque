import type { CategoryProps } from "./category"

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  OUT_OF_STOCK = "OUT_OF_STOCK",
}

export type ProductImageProps = {
  id: string
  storageKey: string
  originalName: string
  mimeType: string
  size: number
  url: string
  createdAt: string | Date
}

export type ProductProps = {
  id: string
  sku: string
  name: string
  description: string
  categoryId: string
  category?: CategoryProps
  status: Status
  price: number
  images?: ProductImageProps[]
  createdAt: Date
  updatedAt: Date | null
}
