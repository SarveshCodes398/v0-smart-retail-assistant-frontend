"use client"

import RetailerLayout from "@/components/layout/retailer-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function LowStockPage() {
  const { inventory, checkLowStock } = useStore()
  const lowStockIds = checkLowStock()

  const lowStockProducts = MOCK_PRODUCTS.filter((p) => lowStockIds.includes(p.id))

  return (
    <RetailerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <AlertCircle className="w-8 h-8 text-orange-600" />
            Low Stock Alerts
          </h1>
          <p className="text-muted-foreground mt-1">Products with stock below 10 units</p>
        </div>

        {lowStockProducts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg mb-4">All products have sufficient stock!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {lowStockProducts.map((product) => {
              const stock = inventory.get(product.id) || 0
              return (
                <Card key={product.id} className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Current Stock</p>
                        <p className="text-3xl font-bold text-orange-600">{stock}</p>
                      </div>
                      <Link href="/retailer/inventory">
                        <Button>Reorder</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </RetailerLayout>
  )
}
