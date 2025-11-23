"use client"

import type React from "react"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ShoppingCart, BarChart3, AlertCircle, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

export default function RetailerLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout } = useStore()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const navItems = [
    { label: "Dashboard", href: "/retailer/dashboard", icon: BarChart3 },
    { label: "POS Billing", href: "/retailer/pos", icon: ShoppingCart },
    { label: "Inventory", href: "/retailer/inventory", icon: BarChart3 },
    { label: "Stock Audit", href: "/retailer/audit", icon: AlertCircle },
    { label: "Theft Alerts", href: "/retailer/theft-alerts", icon: AlertCircle },
    { label: "Low Stock", href: "/retailer/low-stock", icon: AlertCircle },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-card border-r border-border z-40 transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold">Retail Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">{currentUser?.name}</p>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <Button variant="outline" className="w-full bg-transparent" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Menu Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="lg:hidden fixed bottom-4 right-4 z-30 bg-transparent"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 lg:hidden z-30" onClick={() => setSidebarOpen(false)} />
        )}
        {children}
      </main>
    </div>
  )
}
