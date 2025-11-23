"use client"

import { useState } from "react"
import RetailerLayout from "@/components/layout/retailer-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import { toast } from "react-hot-toast"

export default function InventoryPage() {
  const { inventory, updateInventory } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState(0)

  const filteredProducts = MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditStock = (productId: string, currentStock: number) => {
    setEditingId(productId)
    setEditValue(currentStock)
  }

  const handleSaveStock = (productId: string) => {
    updateInventory(productId, editValue)
    toast.success("Inventory updated")
    setEditingId(null)
  }

  return (
    <RetailerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">Update stock levels for products</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Product</th>
                    <th className="text-left p-4 font-semibold">Category</th>
                    <th className="text-left p-4 font-semibold">SKU</th>
                    <th className="text-right p-4 font-semibold">Stock</th>
                    <th className="text-right p-4 font-semibold">Price</th>
                    <th className="text-center p-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const stock = inventory.get(product.id) || 0
                    const isLowStock = stock < 10
                    const isEditing = editingId === product.id

                    return (
                      <tr
                        key={product.id}
                        className={`border-b hover:bg-muted transition ${isLowStock ? "bg-orange-500/5" : ""}`}
                      >
                        <td className="p-4 font-semibold">{product.name}</td>
                        <td className="p-4 text-sm text-muted-foreground">{product.category}</td>
                        <td className="p-4 text-sm font-mono">{product.sku}</td>
                        <td className={`p-4 text-right font-bold ${isLowStock ? "text-orange-600" : ""}`}>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(Number.parseInt(e.target.value) || 0)}
                              className="w-20 ml-auto"
                              autoFocus
                            />
                          ) : (
                            stock
                          )}
                        </td>
                        <td className="p-4 text-right">₹{product.price}</td>
                        <td className="p-4 text-center">
                          {isEditing ? (
                            <div className="flex gap-2 justify-center">
                              <Button size="sm" onClick={() => handleSaveStock(product.id)}>
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => handleEditStock(product.id, stock)}>
                              Edit
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </RetailerLayout>
  )
}
