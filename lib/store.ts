import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: "customer" | "retailer" | "admin"
  loyaltyPoints: number
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  image: string
  description: string
  rating: number
  stock: number
  sku: string
}

export interface CartItem {
  productId: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "Placed" | "Packed" | "OTD" | "Delivered"
  createdAt: string
  deliveryAddress: string
  loyaltyPointsUsed: number
}

export interface StoreState {
  currentUser: User | null
  cart: CartItem[]
  orders: Order[]
  products: Product[]
  loyaltyPoints: number
  promoCode: string
  inventory: Map<string, number>
  lowStockAlerts: string[]
  suspiciousEvents: { id: string; productId: string; type: string; score: number; timestamp: string }[]

  // Auth actions
  login: (email: string, password: string) => boolean
  logout: () => void

  // Cart actions
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void

  // Order actions
  createOrder: (address: string, loyaltyPointsUsed: number) => Order | null
  updateOrderStatus: (orderId: string, status: Order["status"]) => void

  // Loyalty actions
  addLoyaltyPoints: (points: number) => void
  useLoyaltyPoints: (points: number) => boolean

  // Retailer actions
  updateInventory: (productId: string, quantity: number) => void
  checkLowStock: () => string[]
  addSuspiciousEvent: (productId: string, type: string) => void
}

const DEMO_USERS: User[] = [
  {
    id: "1",
    email: "customer@test.com",
    password: "123",
    name: "John Customer",
    role: "customer",
    loyaltyPoints: 500,
  },
  {
    id: "2",
    email: "retailer@test.com",
    password: "123",
    name: "Retail Store",
    role: "retailer",
    loyaltyPoints: 0,
  },
  {
    id: "3",
    email: "admin@test.com",
    password: "123",
    name: "Admin User",
    role: "admin",
    loyaltyPoints: 0,
  },
]

const MOCK_PRODUCTS: Product[] = [
  {
    id: "P1",
    name: "Product 1",
    category: "Category 1",
    price: 10,
    image: "image1.jpg",
    description: "Description 1",
    rating: 4.5,
    stock: 15,
    sku: "SKU1",
  },
  {
    id: "P2",
    name: "Product 2",
    category: "Category 2",
    price: 20,
    image: "image2.jpg",
    description: "Description 2",
    rating: 4.7,
    stock: 5,
    sku: "SKU2",
  },
]

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      cart: [],
      orders: [],
      products: [],
      loyaltyPoints: 0,
      promoCode: "",
      inventory: new Map(MOCK_PRODUCTS.map((p) => [p.id, p.stock])),
      lowStockAlerts: [],
      suspiciousEvents: [],

      login: (email: string, password: string) => {
        const user = DEMO_USERS.find((u) => u.email === email && u.password === password)
        if (user) {
          set({
            currentUser: user,
            loyaltyPoints: user.loyaltyPoints,
          })
          return true
        }
        return false
      },

      logout: () => {
        set({
          currentUser: null,
          cart: [],
          loyaltyPoints: 0,
        })
      },

      addToCart: (product: Product, quantity: number) => {
        const { cart } = get()
        const existingItem = cart.find((item) => item.productId === product.id)

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item,
            ),
          })
        } else {
          set({
            cart: [...cart, { productId: product.id, quantity, price: product.price }],
          })
        }
      },

      removeFromCart: (productId: string) => {
        set({
          cart: get().cart.filter((item) => item.productId !== productId),
        })
      },

      updateCartQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId)
        } else {
          set({
            cart: get().cart.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
          })
        }
      },

      clearCart: () => {
        set({ cart: [] })
      },

      createOrder: (address: string, loyaltyPointsUsed: number) => {
        const { cart, currentUser, loyaltyPoints } = get()

        if (!currentUser || cart.length === 0) return null
        if (loyaltyPointsUsed > loyaltyPoints) return null

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

        // Apply loyalty discount
        const discountAmount = (loyaltyPointsUsed / 100) * total
        const finalTotal = Math.max(0, total - discountAmount)

        const order: Order = {
          id: `ORD-${Date.now()}`,
          userId: currentUser.id,
          items: cart,
          total: finalTotal,
          status: "Placed",
          createdAt: new Date().toISOString(),
          deliveryAddress: address,
          loyaltyPointsUsed,
        }

        set({
          orders: [...get().orders, order],
          cart: [],
          loyaltyPoints: loyaltyPoints - loyaltyPointsUsed,
        })

        return order
      },

      updateOrderStatus: (orderId: string, status: Order["status"]) => {
        set({
          orders: get().orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
        })
      },

      addLoyaltyPoints: (points: number) => {
        set({ loyaltyPoints: get().loyaltyPoints + points })
      },

      useLoyaltyPoints: (points: number) => {
        const { loyaltyPoints } = get()
        if (points <= loyaltyPoints) {
          set({ loyaltyPoints: loyaltyPoints - points })
          return true
        }
        return false
      },

      updateInventory: (productId: string, quantity: number) => {
        const { inventory } = get()
        const newInventory = new Map(inventory)
        newInventory.set(productId, quantity)
        set({ inventory: newInventory })
      },

      checkLowStock: () => {
        const { inventory } = get()
        const lowStockItems = Array.from(inventory.entries())
          .filter(([_, qty]) => qty < 10)
          .map(([productId]) => productId)
        set({ lowStockAlerts: lowStockItems })
        return lowStockItems
      },

      addSuspiciousEvent: (productId: string, type: string) => {
        const event = {
          id: `EVT-${Date.now()}`,
          productId,
          type,
          score: Math.floor(Math.random() * 100),
          timestamp: new Date().toISOString(),
        }
        set({
          suspiciousEvents: [...get().suspiciousEvents, event],
        })
      },
    }),
    {
      name: "retail-store",
    },
  ),
)
