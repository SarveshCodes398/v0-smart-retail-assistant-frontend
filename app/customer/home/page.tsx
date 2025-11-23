"use client"

import { useRouter } from "next/navigation"
import CustomerLayout from "@/components/layout/customer-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CATEGORIES, MOCK_PRODUCTS } from "@/lib/mock-data"
import { useStore } from "@/lib/store"
import { Star } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CustomerHome() {
  const router = useRouter()
  const { addToCart } = useStore()
  const [addedProductId, setAddedProductId] = useState<string | null>(null)

  const featuredProducts = MOCK_PRODUCTS.slice(0, 8)

  const handleAddToCart = (product: any) => {
    addToCart(product, 1)
    setAddedProductId(product.id)
    setTimeout(() => setAddedProductId(null), 1500)
  }

  return (
    <CustomerLayout>
      <div className="space-y-12">
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 rounded-lg p-8 text-primary-foreground">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Smart Retail</h1>
          <p className="text-lg opacity-90 mb-6">
            Discover thousands of quality products at unbeatable prices. Shop now and earn loyalty points!
          </p>
          <Button
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-secondary"
            onClick={() => router.push("/customer/categories")}
          >
            Start Shopping
          </Button>
        </section>

        {/* Categories Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((category) => (
              <Link key={category} href={`/customer/categories/${encodeURIComponent(category)}`}>
                <Card className="hover:shadow-lg transition cursor-pointer h-24 flex items-center justify-center">
                  <p className="text-center text-sm font-medium px-2 line-clamp-2">{category}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link href="/customer/categories">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                <CardContent className="p-0">
                  <div className="relative mb-0 bg-gradient-to-br from-muted to-muted/50 rounded-t-lg aspect-square flex items-center justify-center overflow-hidden">
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
                    <h3 className="font-semibold line-clamp-2 mb-2">{product.name}</h3>
                    <div className="flex items-center gap-1 my-2 mb-3">
                      <span className="text-xs text-muted-foreground">{product.category}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-bold text-lg">₹{product.price}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">{product.rating}</span>
                        </div>
                      </div>
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
        </section>
      </div>
    </CustomerLayout>
  )
}
