"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import CustomerLayout from "@/components/layout/customer-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import { useStore } from "@/lib/store"
import { Star, ArrowLeft } from "lucide-react"

export default function CategoryPage() {
  const router = useRouter()
  const params = useParams()
  const category = decodeURIComponent(params.category as string)

  const { addToCart } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(10000)
  const [sortBy, setSortBy] = useState("newest")
  const [addedProductId, setAddedProductId] = useState<string | null>(null)

  let filteredProducts = MOCK_PRODUCTS.filter((p) => p.category === category)

  if (searchTerm) {
    filteredProducts = filteredProducts.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  filteredProducts = filteredProducts.filter((p) => p.price >= minPrice && p.price <= maxPrice)

  if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price)
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price)
  } else if (sortBy === "rating") {
    filteredProducts.sort((a, b) => b.rating - a.rating)
  }

  const handleAddToCart = (product: any) => {
    addToCart(product, 1)
    setAddedProductId(product.id)
    setTimeout(() => setAddedProductId(null), 1500)
  }

  return (
    <CustomerLayout>
      <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <h1 className="text-3xl font-bold mb-6">{category}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3">Price Range</h3>
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(Number.parseInt(e.target.value) || 0)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number.parseInt(e.target.value) || 10000)}
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border rounded bg-background"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <Input
            placeholder="Search in category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-6"
          />

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition">
                  <CardContent className="p-4">
                    <div className="mb-3 bg-muted rounded aspect-square flex items-center justify-center overflow-hidden">
                      <img
                        src={`/public/${product.id}.jpg`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=250&width=250"
                        }}
                      />
                    </div>
                    <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between my-2">
                      <div>
                        <p className="font-bold">₹{product.price}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">{product.rating}</span>
                        </div>
                      </div>
                      {product.stock < 10 && (
                        <span className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded">
                          Low Stock
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => router.push(`/customer/products/${product.id}`)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAddToCart(product)}
                        disabled={addedProductId === product.id}
                      >
                        {addedProductId === product.id ? "✓" : "Add"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  )
}
