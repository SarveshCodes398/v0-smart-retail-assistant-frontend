"use client"

import { useState } from "react"
import AdminLayout from "@/components/layout/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { ChevronDown } from "lucide-react"

interface ReturnRequest {
  id: string
  orderId: string
  reason: string
  status: "pending" | "approved" | "rejected"
}

export default function ReturnsPage() {
  const { orders } = useStore()
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([
    {
      id: "RET-001",
      orderId: orders[0]?.id || "ORD-001",
      reason: "Damaged product",
      status: "pending",
    },
    {
      id: "RET-002",
      orderId: orders[1]?.id || "ORD-002",
      reason: "Wrong item received",
      status: "pending",
    },
  ])

  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null)

  const handleApproveReturn = (requestId: string) => {
    setReturnRequests(returnRequests.map((r) => (r.id === requestId ? { ...r, status: "approved" } : r)))
  }

  const handleRejectReturn = (requestId: string) => {
    setReturnRequests(returnRequests.map((r) => (r.id === requestId ? { ...r, status: "rejected" } : r)))
  }

  const statusColors = {
    pending: "bg-orange-500/20 text-orange-600",
    approved: "bg-green-500/20 text-green-600",
    rejected: "bg-red-500/20 text-red-600",
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Returns Management</h1>
          <p className="text-muted-foreground mt-1">Process customer return requests</p>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Pending", count: returnRequests.filter((r) => r.status === "pending").length, color: "orange" },
            { label: "Approved", count: returnRequests.filter((r) => r.status === "approved").length, color: "green" },
            { label: "Rejected", count: returnRequests.filter((r) => r.status === "rejected").length, color: "red" },
          ].map((item) => (
            <Card key={item.label}>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-3xl font-bold mt-1">{item.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Return Requests */}
        <div className="space-y-3">
          {returnRequests.map((request) => {
            const order = orders.find((o) => o.id === request.orderId)
            return (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedRequestId(expandedRequestId === request.id ? null : request.id)}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{request.id}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Order: {request.orderId} • Reason: {request.reason}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${statusColors[request.status]}`}
                      >
                        {request.status}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition ${expandedRequestId === request.id ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedRequestId === request.id && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      {order && (
                        <>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Order Amount</p>
                            <p className="font-bold">₹{Math.floor(order.total)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Items in Order</p>
                            <p className="text-sm">{order.items.length} items</p>
                          </div>
                        </>
                      )}

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Return Reason</p>
                        <p className="text-sm bg-muted p-2 rounded">{request.reason}</p>
                      </div>

                      {request.status === "pending" && (
                        <div className="flex gap-2 pt-3">
                          <Button size="sm" className="flex-1" onClick={() => handleApproveReturn(request.id)}>
                            Approve Return
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1"
                            onClick={() => handleRejectReturn(request.id)}
                          >
                            Reject Return
                          </Button>
                        </div>
                      )}

                      {request.status === "approved" && (
                        <div className="text-sm text-green-600 font-semibold pt-2">
                          Return has been approved. Process refund.
                        </div>
                      )}

                      {request.status === "rejected" && (
                        <div className="text-sm text-red-600 font-semibold pt-2">Return has been rejected.</div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </AdminLayout>
  )
}
