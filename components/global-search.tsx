"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { searchProducts } from "@/lib/search"
import type { MOCK_PRODUCTS } from "@/lib/mock-data"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

export function GlobalSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<typeof MOCK_PRODUCTS>([])
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchProducts(query)
      setResults(searchResults.slice(0, 5))
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query])

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-8"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {results.map((product) => (
            <Button
              key={product.id}
              variant="ghost"
              className="w-full justify-start p-3 h-auto flex-col items-start rounded-none border-b last:border-0"
              onClick={() => {
                router.push(`/customer/products/${product.id}`)
                setQuery("")
              }}
            >
              <p className="font-semibold text-sm">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.category}</p>
              <p className="text-xs font-bold">₹{product.price}</p>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
