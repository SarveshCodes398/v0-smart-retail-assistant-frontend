"use client"

import { useRouter } from "next/navigation"
import CustomerLayout from "@/components/layout/customer-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import { useStore } from "@/lib/store"
import { Trash2, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const router = useRouter()
  const { cart, removeFromCart, updateCartQuantity, loyaltyPoints } = useStore()

  const cartItems = cart.map((item) => ({
    ...item,
    product: MOCK_PRODUCTS.find((p) => p.id === item.productId),
  }))

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + tax

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
              <Link href="/customer/categories">
                <Button>Continue Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.productId}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                        <img
                          src={`/public/${item.productId}.jpg`}
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=80&width=80"
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.product?.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.product?.category}</p>
                        <p className="font-bold mt-1">₹{item.product?.price}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border rounded">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="px-3">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <span className="font-bold min-w-20 text-right">
                          ₹{(item.product?.price || 0) * item.quantity}
                        </span>
                        <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.productId)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%)</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>

                  <Card className="bg-accent/10">
                    <CardContent className="p-3">
                      <p className="text-sm font-semibold">Loyalty Points</p>
                      <p className="text-2xl font-bold">{loyaltyPoints}</p>
                      <p className="text-xs text-muted-foreground">= ₹{Math.floor(loyaltyPoints / 100)}</p>
                    </CardContent>
                  </Card>

                  <Button size="lg" className="w-full" onClick={() => router.push("/customer/checkout")}>
                    Proceed to Checkout
                  </Button>
                  <Link href="/customer/categories">
                    <Button variant="outline" className="w-full bg-transparent">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}
