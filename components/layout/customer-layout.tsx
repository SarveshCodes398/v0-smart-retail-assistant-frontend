"use client"

import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ShoppingCart, LogOut, Menu, Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"
import { useThemeToggle } from "@/hooks/use-theme-toggle"

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, cart } = useStore()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme, mounted } = useThemeToggle()
  const [showCartAbandonmentAlert, setShowCartAbandonmentAlert] = useState(false)
  const [idleTime, setIdleTime] = useState(0)

  useEffect(() => {
    if (cart.length === 0) return

    const timer = setInterval(() => {
      setIdleTime((prev) => prev + 1)
      if (idleTime + 1 === 300) {
        // 5 minutes
        setShowCartAbandonmentAlert(true)
      }
    }, 1000)

    const resetIdle = () => {
      setIdleTime(0)
    }

    document.addEventListener("mousemove", resetIdle)
    document.addEventListener("keydown", resetIdle)

    return () => {
      clearInterval(timer)
      document.removeEventListener("mousemove", resetIdle)
      document.removeEventListener("keydown", resetIdle)
    }
  }, [cart.length])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const navItems = [
    { label: "Home", href: "/customer/home" },
    { label: "Categories", href: "/customer/categories" },
    { label: "Orders", href: "/customer/orders" },
    { label: "Account", href: "/customer/account" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/customer/home" className="text-xl font-bold">
            🛍️ Retail Store
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-foreground hover:text-primary transition">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link href="/customer/cart" className="relative">
              <Button variant="outline" size="icon">
                <ShoppingCart className="w-5 h-5" />
              </Button>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            {mounted && (
              <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            )}

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-sm">{currentUser?.name}</span>
              <Button variant="outline" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden bg-transparent"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-card border-t border-border p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block p-2 text-foreground hover:bg-secondary rounded transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* Cart Abandonment Alert */}
      {showCartAbandonmentAlert && cart.length > 0 && (
        <div className="bg-orange-500/20 border-b border-orange-500/50 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <p className="font-semibold">Don't forget your cart!</p>
              <p className="text-sm text-muted-foreground">Complete your purchase and save with loyalty points</p>
            </div>
            <Button onClick={() => router.push("/customer/cart")}>Complete Order</Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
