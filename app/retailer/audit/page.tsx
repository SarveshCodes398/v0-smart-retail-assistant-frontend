"use client"

import { useState } from "react"
import RetailerLayout from "@/components/layout/retailer-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import { toast } from "react-hot-toast"

export default function StockAuditPage() {
  const { inventory, updateInventory } = useStore()
  const [auditData, setAuditData] = useState<Map<string, number>>(new Map())
  const [submitted, setSubmitted] = useState(false)

  const handlePhysicalCount = (productId: string, count: number) => {
    const newAuditData = new Map(auditData)
    newAuditData.set(productId, count)
    setAuditData(newAuditData)
  }

  const handleSubmitAudit = () => {
    auditData.forEach((count, productId) => {
      updateInventory(productId, count)
    })
    toast.success("Stock audit submitted successfully")
    setAuditData(new Map())
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const discrepancies = MOCK_PRODUCTS.map((product) => {
    const systemStock = inventory.get(product.id) || 0
    const physicalCount = auditData.get(product.id)
    const hasCount = physicalCount !== undefined

    return {
      product,
      systemStock,
      physicalCount: physicalCount || 0,
      difference: (physicalCount || 0) - systemStock,
      hasDiscrepancy: hasCount && physicalCount !== systemStock,
    }
  }).filter((item) => item.hasCount)

  return (
    <RetailerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Stock Audit</h1>
          <p className="text-muted-foreground mt-1">Count physical stock and compare with system</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Physical Count Entry</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {MOCK_PRODUCTS.map((product) => (
                    <div key={product.id} className="flex gap-3 items-center p-3 border rounded">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Count"
                        value={auditData.get(product.id) || ""}
                        onChange={(e) => handlePhysicalCount(product.id, Number.parseInt(e.target.value) || 0)}
                        className="w-24"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Total Entered</p>
                  <p className="text-2xl font-bold">{auditData.size}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Discrepancies</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {discrepancies.filter((d) => d.hasDiscrepancy).length}
                  </p>
                </div>
                <Button size="lg" className="w-full" onClick={handleSubmitAudit} disabled={auditData.size === 0}>
                  Submit Audit
                </Button>
                {submitted && <p className="text-sm text-green-600 text-center">Audit submitted!</p>}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Discrepancies Table */}
        {discrepancies.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Discrepancies Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-semibold">Product</th>
                      <th className="text-right p-2 font-semibold">System</th>
                      <th className="text-right p-2 font-semibold">Physical</th>
                      <th className="text-right p-2 font-semibold">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discrepancies
                      .filter((d) => d.hasDiscrepancy)
                      .map((d) => (
                        <tr key={d.product.id} className="border-b bg-orange-500/5 hover:bg-orange-500/10">
                          <td className="p-2">
                            <p className="font-semibold text-sm">{d.product.name}</p>
                            <p className="text-xs text-muted-foreground">{d.product.sku}</p>
                          </td>
                          <td className="p-2 text-right font-bold">{d.systemStock}</td>
                          <td className="p-2 text-right font-bold">{d.physicalCount}</td>
                          <td
                            className={`p-2 text-right font-bold ${
                              d.difference > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {d.difference > 0 ? "+" : ""}
                            {d.difference}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </RetailerLayout>
  )
}
