"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import CustomerLayout from "@/components/layout/customer-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { ChevronRight, Calendar } from "lucide-react"

export default function OrdersPage() {
  const router = useRouter()
  const { orders, currentUser } = useStore()
  const [filter, setFilter] = useState<string | null>(null)

  const userOrders = orders.filter((o) => o.userId === currentUser?.id)
  const filteredOrders = filter ? userOrders.filter((o) => o.status === filter) : userOrders

  const statusColors: Record<string, string> = {
    Placed: "bg-blue-500/20 text-blue-600",
    Packed: "bg-purple-500/20 text-purple-600",
    OTD: "bg-orange-500/20 text-orange-600",
    Delivered: "bg-green-500/20 text-green-600",
  }

  return (
    <CustomerLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button variant={filter === null ? "default" : "outline"} onClick={() => setFilter(null)}>
            All Orders ({userOrders.length})
          </Button>
          {["Placed", "Packed", "OTD", "Delivered"].map((status) => (
            <Button key={status} variant={filter === status ? "default" : "outline"} onClick={() => setFilter(status)}>
              {status} ({userOrders.filter((o) => o.status === status).length})
            </Button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg mb-4">No orders found</p>
              <Button onClick={() => router.push("/customer/categories")}>Start Shopping</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="hover:shadow-lg transition cursor-pointer"
                onClick={() => router.push(`/customer/orders/${order.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div>
                          <p className="font-semibold text-lg">{order.id}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{order.items.length} items</p>
                      <p className="text-sm">Delivery: {order.deliveryAddress}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-xl mb-2">₹{Math.floor(order.total)}</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || "bg-gray-500/20 text-gray-600"}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}
