"use client"

import { useRouter } from "next/navigation"
import CustomerLayout from "@/components/layout/customer-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function OrderConfirmation({ params }: { params: { id: string } }) {
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

  return (
    <CustomerLayout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">Thank you for your purchase</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span className="font-mono font-bold">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-600 rounded-full text-sm font-medium">
                {order.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span className="font-bold text-lg">₹{Math.floor(order.total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Address:</span>
              <span className="text-right">{order.deliveryAddress}</span>
            </div>
            {order.loyaltyPointsUsed > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Loyalty Points Used:</span>
                <span>{order.loyaltyPointsUsed}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Link href="/customer/orders" className="flex-1">
            <Button className="w-full">Track Order</Button>
          </Link>
          <Link href="/customer/categories" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </CustomerLayout>
  )
}
