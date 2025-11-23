"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import CustomerLayout from "@/components/layout/customer-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { Gift, User, LogOut, Award } from "lucide-react"

export default function AccountPage() {
  const router = useRouter()
  const { currentUser, logout, loyaltyPoints, orders, addLoyaltyPoints } = useStore()
  const [showLoyaltyRedeemModal, setShowLoyaltyRedeemModal] = useState(false)
  const [redeemAmount, setRedeemAmount] = useState(0)

  if (!currentUser) {
    return null
  }

  const userOrders = orders.filter((o) => o.userId === currentUser.id)
  const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0)
  const deliveredOrders = userOrders.filter((o) => o.status === "Delivered").length

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <CustomerLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Profile Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{currentUser.name}</h3>
                <p className="text-muted-foreground">{currentUser.email}</p>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Member Since:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Account Type:</span>
                <span className="capitalize font-semibold">{currentUser.role}</span>
              </div>
            </div>

            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{userOrders.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Delivered</p>
              <p className="text-2xl font-bold">{deliveredOrders}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">₹{Math.floor(totalSpent)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loyalty Points Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Loyalty Points
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-accent/20 to-primary/20 p-6 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Available Points</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{loyaltyPoints}</span>
              <span className="text-muted-foreground">= ₹{Math.floor(loyaltyPoints / 100)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-semibold mb-2">How to Earn</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 1 point per ₹10 spent</li>
                <li>• Bonus points on special offers</li>
                <li>• Referral bonuses</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-semibold mb-2">Redeem</p>
              <p className="text-sm text-muted-foreground mb-3">100 points = ₹1 discount</p>
              <Button size="sm" className="w-full" onClick={() => setShowLoyaltyRedeemModal(true)}>
                <Gift className="w-4 h-4 mr-2" />
                Redeem Points
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {userOrders.length === 0 ? (
            <p className="text-muted-foreground">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {userOrders
                .slice(-5)
                .reverse()
                .map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center p-3 bg-muted rounded cursor-pointer hover:bg-muted/80 transition"
                    onClick={() => router.push(`/customer/orders/${order.id}`)}
                  >
                    <div>
                      <p className="font-semibold">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{Math.floor(order.total)}</p>
                      <p className="text-sm text-muted-foreground">{order.status}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Redeem Modal */}
      {showLoyaltyRedeemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Redeem Loyalty Points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Available: {loyaltyPoints} points</p>
                <Input
                  type="number"
                  max={loyaltyPoints}
                  value={redeemAmount}
                  onChange={(e) => setRedeemAmount(Number.parseInt(e.target.value) || 0)}
                  placeholder="Enter points to redeem"
                />
                {redeemAmount > 0 && (
                  <p className="text-sm text-green-600 mt-2">You'll get ₹{Math.floor(redeemAmount / 100)} credit</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowLoyaltyRedeemModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    addLoyaltyPoints(-redeemAmount)
                    setShowLoyaltyRedeemModal(false)
                    setRedeemAmount(0)
                  }}
                  disabled={redeemAmount === 0}
                >
                  Redeem
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </CustomerLayout>
  )
}
