"use client"

import { useState } from "react"
import RetailerLayout from "@/components/layout/retailer-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import { Trash2, Printer } from "lucide-react"
import { toast } from "react-hot-toast"

export default function POSPage() {
  const { inventory, updateInventory, addLoyaltyPoints } = useStore()
  const [cart, setCart] = useState<{ productId: string; quantity: number; price: number }[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loyaltyPointsRedeemed, setLoyaltyPointsRedeemed] = useState(0)

  const filteredProducts = MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddToCart = (product: any) => {
    const currentStock = inventory.get(product.id) || 0
    if (currentStock > 0) {
      const existingItem = cart.find((item) => item.productId === product.id)
      if (existingItem && existingItem.quantity < currentStock) {
        setCart(cart.map((item) => (item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
      } else if (!existingItem) {
        setCart([...cart, { productId: product.id, quantity: 1, price: product.price }])
      }
      toast.success(`${product.name} added to cart`)
    } else {
      toast.error("Out of stock")
    }
  }

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId))
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty")
      return
    }

    // Deduct from inventory
    cart.forEach((item) => {
      const currentStock = inventory.get(item.productId) || 0
      updateInventory(item.productId, currentStock - item.quantity)
    })

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const earnedPoints = Math.floor(total / 10)

    addLoyaltyPoints(earnedPoints)
    toast.success(`Sale completed! Customer earned ${earnedPoints} loyalty points`)
    setCart([])
    setLoyaltyPointsRedeemed(0)
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + tax - (loyaltyPointsRedeemed / 100) * subtotal

  return (
    <RetailerLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">POS Billing</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Search */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Search Products</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-4"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                  {filteredProducts.map((product) => {
                    const stock = inventory.get(product.id) || 0
                    const isInCart = cart.some((item) => item.productId === product.id)
                    return (
                      <Card key={product.id} className={isInCart ? "border-primary" : ""}>
                        <CardContent className="p-3">
                          <p className="font-semibold text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground mb-2">{product.sku}</p>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold">₹{product.price}</span>
                            <span className="text-xs bg-muted px-2 py-1 rounded">{stock} left</span>
                          </div>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => handleAddToCart(product)}
                            disabled={stock === 0}
                          >
                            Add
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cart Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bill</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {cart.map((item) => {
                        const product = MOCK_PRODUCTS.find((p) => p.id === item.productId)
                        return (
                          <div key={item.productId} className="flex justify-between items-start text-sm">
                            <div className="flex-1">
                              <p className="font-semibold">{product?.name}</p>
                              <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">₹{item.price * item.quantity}</p>
                              <Button variant="ghost" size="sm" onClick={() => handleRemoveFromCart(item.productId)}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax (18%)</span>
                        <span>₹{tax}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{Math.floor(total)}</span>
                      </div>
                    </div>

                    <Button size="lg" className="w-full" onClick={handleCheckout}>
                      <Printer className="w-4 h-4 mr-2" />
                      Complete Sale
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RetailerLayout>
  )
}
