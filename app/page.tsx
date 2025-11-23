"use client"

import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import LoginPage from "@/components/auth/login-page"

export default function Home() {
  const { currentUser } = useStore()
  const router = useRouter()

  if (!currentUser) {
    return <LoginPage />
  }

  // Redirect based on role
  if (currentUser.role === "customer") {
    router.push("/customer/home")
  } else if (currentUser.role === "retailer") {
    router.push("/retailer/dashboard")
  } else if (currentUser.role === "admin") {
    router.push("/admin/dashboard")
  }

  return null
}
