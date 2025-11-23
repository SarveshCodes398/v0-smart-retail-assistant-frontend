"use client"

import { useRouter } from "next/navigation"
import CustomerLayout from "@/components/layout/customer-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import { ArrowLeft, CheckCircle2, Package, Truck, Home } from "lucide-react"

export default function OrderDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { orders } = useStore()
  const order = orders.find((o) => o.id === params.id)

  if (!order) {
    return (
      <CustomerLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Order not found</p>
        </div>
      </CustomerLayout>
    )
  }

  const statusTimeline = [
    { step: "Placed", icon: Package, completed: true },
    { step: "Packed", icon: Package, completed: ["Packed", "OTD", "Delivered"].includes(order.status) },
    { step: "OTD", icon: Truck, completed: ["OTD", "Delivered"].includes(order.status) },
    { step: "Delivered", icon: Home, completed: order.status === "Delivered" },
  ]

  return (
    <CustomerLayout>
      <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="space-y-6">
        {/* Order Header */}
        <Card>
          <CardHeader>
            <CardTitle>Order {order.id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Placed on:</span>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span className="font-bold text-lg">₹{Math.floor(order.total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Address:</span>
              <span className="text-right">{order.deliveryAddress}</span>
            </div>
          </CardContent>
        </Card>

        {/* Status Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="space-y-6">
                {statusTimeline.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            item.completed ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.completed ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                        </div>
                        {index !== statusTimeline.length - 1 && (
                          <div className={`w-1 h-12 mt-2 ${item.completed ? "bg-green-500" : "bg-muted"}`} />
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <p className={`font-semibold ${item.completed ? "text-foreground" : "text-muted-foreground"}`}>
                          {item.step}
                        </p>
                        {item.step === order.status && <p className="text-sm text-muted-foreground">Current status</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Items in This Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items.map((item) => {
              const product = MOCK_PRODUCTS.find((p) => p.id === item.productId)
              return (
                <div key={item.productId} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="w-20 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                    <img
                      src={`/public/${item.productId}.jpg`}
                      alt={product?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=80&width=80"
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{product?.name}</p>
                    <p className="text-sm text-muted-foreground">{product?.category}</p>
                    <div className="flex justify-between mt-1">
                      <span>Qty: {item.quantity}</span>
                      <span className="font-bold">₹{(product?.price || 0) * item.quantity}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{Math.floor(order.total * (100 / 118))}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18%)</span>
              <span>₹{Math.floor(order.total - order.total * (100 / 118))}</span>
            </div>
            {order.loyaltyPointsUsed > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Loyalty Discount</span>
                <span>-₹{Math.floor((order.loyaltyPointsUsed / 100) * (order.total * (100 / 118)))}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{Math.floor(order.total)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  )
}
