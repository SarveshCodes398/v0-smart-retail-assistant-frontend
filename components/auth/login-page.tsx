"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-hot-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("customer@test.com")
  const [password, setPassword] = useState("123")
  const [loading, setLoading] = useState(false)
  const { login } = useStore()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise((r) => setTimeout(r, 500))

      if (login(email, password)) {
        toast.success("Login successful!")
        router.push("/")
      } else {
        toast.error("Invalid credentials")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Smart Retail Assistant</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">Sign in to your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="mt-6 space-y-2 border-t pt-4">
              <p className="text-xs font-semibold text-foreground">Demo Accounts:</p>
              <p className="text-xs text-muted-foreground">Customer: customer@test.com / 123</p>
              <p className="text-xs text-muted-foreground">Retailer: retailer@test.com / 123</p>
              <p className="text-xs text-muted-foreground">Admin: admin@test.com / 123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
