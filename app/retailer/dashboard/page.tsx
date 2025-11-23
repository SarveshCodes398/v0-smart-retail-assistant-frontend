"use client"

import RetailerLayout from "@/components/layout/retailer-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { AlertCircle } from "lucide-react"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RetailerDashboard() {
  const { inventory, checkLowStock, suspiciousEvents } = useStore()

  const lowStockCount = checkLowStock().length
  const totalInventoryValue = Array.from(inventory.entries()).reduce((sum, [productId, qty]) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === productId)
    return sum + (product?.price || 0) * qty
  }, 0)

  const recentEvents = suspiciousEvents.slice(-5)

  return (
    <RetailerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Retailer Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your store inventory and operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total SKUs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{MOCK_PRODUCTS.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Products in catalog</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₹{Math.floor(totalInventoryValue)}</p>
              <p className="text-xs text-muted-foreground mt-1">Total stock value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Low Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">{lowStockCount}</p>
              <Link href="/retailer/low-stock">
                <Button variant="link" size="sm" className="p-0 h-auto">
                  View →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Suspicious Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{suspiciousEvents.length}</p>
              <Link href="/retailer/theft-alerts">
                <Button variant="link" size="sm" className="p-0 h-auto">
                  View →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/retailer/pos">
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🛒</div>
                <h3 className="font-semibold">POS Billing</h3>
                <p className="text-sm text-muted-foreground mt-1">Sell items & process transactions</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/retailer/inventory">
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">📦</div>
                <h3 className="font-semibold">Inventory</h3>
                <p className="text-sm text-muted-foreground mt-1">Manage stock levels</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/retailer/audit">
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">✓</div>
                <h3 className="font-semibold">Stock Audit</h3>
                <p className="text-sm text-muted-foreground mt-1">Compare physical & system</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Events */}
        {recentEvents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Suspicious Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex justify-between items-center p-3 bg-muted rounded">
                    <div>
                      <p className="font-semibold">{event.id}</p>
                      <p className="text-sm text-muted-foreground">{event.type}</p>
                    </div>
                    <div>
                      <p className="font-bold">{event.score}%</p>
                      <p className="text-xs text-muted-foreground">Risk score</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </RetailerLayout>
  )
}
