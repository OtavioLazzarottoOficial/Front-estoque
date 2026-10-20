export async function fetchProductById(
  productId: string
): Promise<StockProps | undefined> {
  try {
    const response = await api.get(`/stock/product/${productId}`)

    return response.data
  } catch (error) {
    console.error(error)
    return undefined
  }
}
