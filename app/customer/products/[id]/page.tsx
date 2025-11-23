"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import CustomerLayout from "@/components/layout/customer-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import { useStore } from "@/lib/store"
import { Star, ArrowLeft } from "lucide-react"

export default function ProductDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { addToCart } = useStore()
  const [quantity, setQuantity] = useState(1)
  const product = MOCK_PRODUCTS.find((p) => p.id === params.id)

  if (!product) {
    return (
      <CustomerLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Product not found</p>
        </div>
      </CustomerLayout>
    )
  }

  const relatedProducts = MOCK_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(
    0,
    4,
  )

  const handleAddToCart = () => {
    addToCart(product, quantity)
    router.push("/customer/cart")
  }

  return (
    <CustomerLayout>
      <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        {/* Product Image */}
        <div className="bg-gradient-to-br from-muted to-muted/50 rounded-xl aspect-square flex items-center justify-center overflow-hidden shadow-2xl">
          <img
            src={`/public/${product.id}.jpg`}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = "/retail-product.jpg"
            }}
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <span className="text-sm text-muted-foreground">{product.category}</span>
            <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.rating})</span>
            </div>
          </div>

          <div>
            <p className="text-4xl font-bold">₹{product.price}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </p>
          </div>

          <p className="text-foreground leading-relaxed">{product.description}</p>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
              <p className="text-sm text-muted-foreground mt-2">Category: {product.category}</p>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <label className="font-medium">Quantity:</label>
              <div className="flex items-center border rounded">
                <Button variant="ghost" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  -
                </Button>
                <span className="px-4">{quantity}</span>
                <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)}>
                  +
                </Button>
              </div>
            </div>

            <Button size="lg" className="w-full" disabled={product.stock === 0} onClick={handleAddToCart}>
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <Card
                key={relProduct.id}
                className="hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="relative bg-gradient-to-br from-muted to-muted/50 rounded-t-lg aspect-square flex items-center justify-center overflow-hidden">
                    <img
                      src={`/public/${relProduct.id}.jpg`}
                      alt={relProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "/retail-product.jpg"
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2 mb-2">{relProduct.name}</h3>
                    <p className="font-bold text-lg mb-3">₹{relProduct.price}</p>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => router.push(`/customer/products/${relProduct.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </CustomerLayout>
  )
}
