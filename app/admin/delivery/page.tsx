"use client"

import { useState } from "react"
import AdminLayout from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { MapPin, Download } from "lucide-react"

export default function DeliveryPage() {
  const { orders, updateOrderStatus } = useStore()
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)

  // Group orders into delivery routes
  const pendingOrders = orders.filter((o) => ["Packed", "OTD"].includes(o.status))
  const routes = [
    {
      id: "ROUTE-001",
      name: "North Zone",
      orders: pendingOrders.filter((_, i) => i % 3 === 0),
      coords: [
        [28.7041, 77.1025],
        [28.5355, 77.391],
      ],
    },
    {
      id: "ROUTE-002",
      name: "South Zone",
      orders: pendingOrders.filter((_, i) => i % 3 === 1),
      coords: [
        [28.5305, 77.0863],
        [28.4089, 77.0784],
      ],
    },
    {
      id: "ROUTE-003",
      name: "East Zone",
      orders: pendingOrders.filter((_, i) => i % 3 === 2),
      coords: [
        [28.6192, 77.2025],
        [28.6328, 77.22],
      ],
    },
  ]

  const currentRoute = routes.find((r) => r.id === selectedRoute)

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Delivery Management</h1>
          <p className="text-muted-foreground mt-1">Manage delivery routes and tracking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Routes Sidebar */}
          <div className="space-y-2">
            {routes.map((route) => (
              <Card
                key={route.id}
                className={`cursor-pointer transition ${selectedRoute === route.id ? "border-primary" : ""}`}
                onClick={() => setSelectedRoute(route.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{route.name}</p>
                      <p className="text-sm text-muted-foreground">{route.orders.length} orders</p>
                    </div>
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Route Details */}
          {currentRoute ? (
            <div className="lg:col-span-2 space-y-4">
              {/* Map Simulation */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Route Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-8 text-center">
                    <div className="text-4xl mb-4">🗺️</div>
                    <p className="text-muted-foreground mb-4">Route Map Visualization</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {currentRoute.name} - Optimized delivery sequence
                    </p>
                    <div className="text-sm space-y-1">
                      {currentRoute.coords.map((coord, i) => (
                        <p key={i} className="text-muted-foreground">
                          Stop {i + 1}: {coord[0].toFixed(4)}, {coord[1].toFixed(4)}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Orders in Route */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Orders in Route</CardTitle>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Print Labels
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentRoute.orders.map((order, idx) => (
                      <div key={order.id} className="flex items-start gap-4 p-3 border rounded">
                        <div className="font-bold bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                          <p className="text-sm mt-1">₹{Math.floor(order.total)}</p>
                        </div>
                        {order.status === "Packed" && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, "OTD")}>
                            Start Delivery
                          </Button>
                        )}
                        {order.status === "OTD" && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, "Delivered")}>
                            Delivered
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Select a route to view details</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
