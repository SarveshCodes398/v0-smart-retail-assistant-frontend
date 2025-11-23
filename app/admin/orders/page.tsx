"use client"

import { useState } from "react"
import AdminLayout from "@/components/layout/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { ChevronDown } from "lucide-react"

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useStore()
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const filteredOrders = filterStatus ? orders.filter((o) => o.status === filterStatus) : orders

  const statusColors: Record<string, string> = {
    Placed: "bg-blue-500/20 text-blue-600",
    Packed: "bg-purple-500/20 text-purple-600",
    OTD: "bg-orange-500/20 text-orange-600",
    Delivered: "bg-green-500/20 text-green-600",
  }

  const nextStatuses: Record<string, string[]> = {
    Placed: ["Packed"],
    Packed: ["OTD"],
    OTD: ["Delivered"],
    Delivered: [],
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground mt-1">View and update order statuses</p>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button variant={filterStatus === null ? "default" : "outline"} onClick={() => setFilterStatus(null)}>
            All ({orders.length})
          </Button>
          {["Placed", "Packed", "OTD", "Delivered"].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              onClick={() => setFilterStatus(status)}
            >
              {status} ({orders.filter((o) => o.status === status).length})
            </Button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No orders found</p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{order.id}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.items.length} items • ₹{Math.floor(order.total)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status]}`}
                      >
                        {order.status}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition ${expandedOrderId === order.id ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedOrderId === order.id && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Delivery Address</p>
                        <p className="text-sm">{order.deliveryAddress}</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Items</p>
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <div key={item.productId} className="text-sm">
                              Product {item.productId}: x{item.quantity} @ ₹{item.price}
                            </div>
                          ))}
                        </div>
                      </div>

                      {nextStatuses[order.status]?.length > 0 && (
                        <div className="flex gap-2 pt-3">
                          {nextStatuses[order.status].map((nextStatus) => (
                            <Button
                              key={nextStatus}
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, nextStatus as any)}
                            >
                              Mark as {nextStatus}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
