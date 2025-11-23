"use client"

import { useState } from "react"
import AdminLayout from "@/components/layout/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import { toast } from "react-hot-toast"

interface PricingData {
  productId: string
  ourPrice: number
  competitorPrice: number
  suggestion: string
}

export default function PricingPage() {
  const [pricingData, setPricingData] = useState<PricingData[]>(
    MOCK_PRODUCTS.slice(0, 8).map((p) => ({
      productId: p.id,
      ourPrice: p.price,
      competitorPrice: p.price + Math.floor(Math.random() * 100 - 50),
      suggestion: Math.random() > 0.5 ? "Increase" : "Decrease",
    })),
  )

  const handleUpdatePrice = (productId: string, newPrice: number) => {
    setPricingData(pricingData.map((p) => (p.productId === productId ? { ...p, ourPrice: newPrice } : p)))
  }

  const handleSavePricing = () => {
    toast.success("Prices updated successfully")
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pricing Management</h1>
          <p className="text-muted-foreground mt-1">Compare and adjust competitor prices</p>
        </div>

        {/* Pricing Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Product</th>
                    <th className="text-right p-4 font-semibold">Our Price</th>
                    <th className="text-right p-4 font-semibold">Competitor</th>
                    <th className="text-center p-4 font-semibold">Difference</th>
                    <th className="text-center p-4 font-semibold">AI Suggestion</th>
                    <th className="text-center p-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingData.map((item) => {
                    const product = MOCK_PRODUCTS.find((p) => p.id === item.productId)
                    const difference = item.ourPrice - item.competitorPrice
                    const isHigher = difference > 0

                    return (
                      <tr key={item.productId} className="border-b hover:bg-muted">
                        <td className="p-4 font-semibold">{product?.name}</td>
                        <td className="p-4 text-right">
                          <Input
                            type="number"
                            value={item.ourPrice}
                            onChange={(e) => handleUpdatePrice(item.productId, Number.parseInt(e.target.value) || 0)}
                            className="w-24 ml-auto"
                          />
                        </td>
                        <td className="p-4 text-right">₹{item.competitorPrice}</td>
                        <td className={`p-4 text-center font-bold ${isHigher ? "text-red-600" : "text-green-600"}`}>
                          {isHigher ? "+" : ""}₹{difference}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              item.suggestion === "Increase"
                                ? "bg-green-500/20 text-green-600"
                                : "bg-red-500/20 text-red-600"
                            }`}
                          >
                            {item.suggestion}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <Button size="sm" variant="outline">
                            Apply
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Reset</Button>
          <Button onClick={handleSavePricing}>Save All Changes</Button>
        </div>
      </div>
    </AdminLayout>
  )
}
