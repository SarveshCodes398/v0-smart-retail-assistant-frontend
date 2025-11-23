import Fuse from "fuse.js"
import { MOCK_PRODUCTS } from "./mock-data"

const options = {
  keys: ["name", "description", "category", "sku"],
  threshold: 0.3,
  includeScore: true,
}

export const fuse = new Fuse(MOCK_PRODUCTS, options)

export const searchProducts = (query: string) => {
  if (!query.trim()) return MOCK_PRODUCTS
  return fuse.search(query).map((result) => result.item)
}
