import type { ProductProps } from "./product"

export type StockProps = {
  id: string
  productId: string
  quantityInStock: number
  quantityMax: number
  quantityMin: number
  product?: ProductProps
  createdAt: Date
  updatedAt: Date | null
}
