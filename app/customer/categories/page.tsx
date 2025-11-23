"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import CustomerLayout from "@/components/layout/customer-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CATEGORIES, MOCK_PRODUCTS } from "@/lib/mock-data"
import { useStore } from "@/lib/store"
import { Star } from "lucide-react"

export default function CategoriesPage() {
  const router = useRouter()
  const { addToCart } = useStore()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(10000)
  const [sortBy, setSortBy] = useState("newest")
  const [addedProductId, setAddedProductId] = useState<string | null>(null)

  let filteredProducts = MOCK_PRODUCTS

  if (selectedCategory) {
    filteredProducts = filteredProducts.filter((p) => p.category === selectedCategory)
  }

  if (searchTerm) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="space-y-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </Button>
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  className="w-full justify-start text-left"
                  onClick={() => setSelectedCategory(cat)}
                >
                  <span className="truncate">{cat}</span>
                </Button>
              ))}
            </div>
          </div>

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

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search */}
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-6"
          />

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                >
                  <CardContent className="p-0">
                    <div className="relative bg-gradient-to-br from-muted to-muted/50 rounded-t-lg aspect-square flex items-center justify-center overflow-hidden">
                      <img
                        src={`/public/${product.id}.jpg`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = "/retail-product.jpg"
                        }}
                      />
                      {product.stock < 10 && (
                        <div className="absolute top-3 right-3">
                          <span className="text-xs bg-destructive text-destructive-foreground px-3 py-1.5 rounded-full font-semibold">
                            Low Stock
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{product.category}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-bold text-lg">₹{product.price}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-muted-foreground">{product.rating}</span>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{product.stock} in stock</span>
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
