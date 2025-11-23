"use client"

import AdminLayout from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { Package, Truck, DollarSign } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const { orders } = useStore()

  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => !["Delivered"].includes(o.status)).length
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)

  const stats = [
    { label: "Total Orders", value: totalOrders, icon: Package, color: "blue" },
    { label: "Pending", value: pendingOrders, icon: Truck, color: "orange" },
    { label: "Delivered", value: deliveredOrders, icon: Package, color: "green" },
    { label: "Total Revenue", value: `₹${Math.floor(totalRevenue)}`, icon: DollarSign, color: "purple" },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage orders, deliveries, and returns</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            const colorClass = {
              blue: "bg-blue-500/10 text-blue-600",
              orange: "bg-orange-500/10 text-orange-600",
              green: "bg-green-500/10 text-green-600",
              purple: "bg-purple-500/10 text-purple-600",
            }[stat.color]

            return (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${colorClass}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/orders">
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">📦</div>
                <h3 className="font-semibold">Manage Orders</h3>
                <p className="text-sm text-muted-foreground mt-1">{totalOrders} total orders</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/delivery">
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🚚</div>
                <h3 className="font-semibold">Delivery Routes</h3>
                <p className="text-sm text-muted-foreground mt-1">{pendingOrders} pending</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/returns">
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">↩️</div>
                <h3 className="font-semibold">Returns</h3>
                <p className="text-sm text-muted-foreground mt-1">Process returns</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-semibold">Order ID</th>
                    <th className="text-left p-2 font-semibold">Total</th>
                    <th className="text-left p-2 font-semibold">Items</th>
                    <th className="text-left p-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .slice(-5)
                    .reverse()
                    .map((order) => (
                      <tr key={order.id} className="border-b hover:bg-muted">
                        <td className="p-2 font-mono">{order.id}</td>
                        <td className="p-2 font-bold">₹{Math.floor(order.total)}</td>
                        <td className="p-2">{order.items.length}</td>
                        <td className="p-2">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              order.status === "Delivered"
                                ? "bg-green-500/20 text-green-600"
                                : order.status === "OTD"
                                  ? "bg-blue-500/20 text-blue-600"
                                  : "bg-orange-500/20 text-orange-600"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
