"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import CustomerLayout from "@/components/layout/customer-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import { useStore } from "@/lib/store"
import { toast } from "react-hot-toast"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, createOrder, loyaltyPoints } = useStore()
  const [address, setAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [loyaltyPointsToUse, setLoyaltyPointsToUse] = useState(0)
  const [loading, setLoading] = useState(false)

  const cartItems = cart.map((item) => ({
    ...item,
    product: MOCK_PRODUCTS.find((p) => p.id === item.productId),
  }))

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
  const tax = Math.round(subtotal * 0.18)
  const discountFromLoyalty = (loyaltyPointsToUse / 100) * subtotal
  const total = Math.max(0, subtotal + tax - discountFromLoyalty)

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!address.trim()) {
      toast.error("Please enter delivery address")
      return
    }

    if (loyaltyPointsToUse > loyaltyPoints) {
      toast.error("Insufficient loyalty points")
      return
    }

    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 800))

      const order = createOrder(address, loyaltyPointsToUse)
      if (order) {
        toast.success("Order placed successfully!")
        router.push(`/customer/order-confirmation/${order.id}`)
      }
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <CustomerLayout>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={() => router.push("/customer/categories")}>Continue Shopping</Button>
          </CardContent>
        </Card>
      </CustomerLayout>
    )
  }

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checkout Form */}
          <form onSubmit={handleCheckout} className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter complete delivery address"
                  className="w-full border rounded p-3 min-h-24 bg-background"
                  required
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {["upi", "card", "net-banking"].map((method) => (
                  <label key={method} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="w-4 h-4"
                    />
                    <span className="capitalize">{method.replace("-", " ")}</span>
                  </label>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Use Loyalty Points (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Available Points:</span>
                  <span className="font-bold">{loyaltyPoints}</span>
                </div>
                <Input
                  type="number"
                  max={loyaltyPoints}
                  value={loyaltyPointsToUse}
                  onChange={(e) => setLoyaltyPointsToUse(Math.min(Number.parseInt(e.target.value) || 0, loyaltyPoints))}
                  placeholder="Points to redeem"
                />
                {loyaltyPointsToUse > 0 && (
                  <p className="text-sm text-green-600">
                    You'll save ₹{Math.floor((loyaltyPointsToUse / 100) * subtotal)}
                  </p>
                )}
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Processing..." : "Place Order"}
            </Button>
          </form>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="text-sm flex justify-between">
                      <span>{item.product?.name}</span>
                      <span>₹{(item.product?.price || 0) * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%)</span>
                    <span>₹{tax}</span>
                  </div>
                  {loyaltyPointsToUse > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Loyalty Discount</span>
                      <span>-₹{Math.floor(discountFromLoyalty)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{Math.floor(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}
