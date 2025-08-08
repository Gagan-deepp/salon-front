"use client";
import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { searchCustomers } from "@/lib/actions/customer_action"
import { Search, User, Phone } from 'lucide-react'

export function CustomerSearch({ onSelect, placeholder = "Search customers..." }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

  useEffect(() => {
    const searchCustomersDebounced = async () => {
      if (query.length < 2) {
        setResults([])
        setShowResults(false)
        return
      }

      setLoading(true)
      try {
        const result = await searchCustomers({ q: query, limit: 10 })
        if (result.success) {
          setResults(result.data.customers || result.data || [])
          setShowResults(true)
        }
      } catch (error) {
        console.error("Search error:", error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchCustomersDebounced, 300)
    return () => clearTimeout(debounceTimer);
  }, [query])

  const handleSelect = (customer) => {
    setQuery(customer.name)
    setShowResults(false)
    onSelect?.(customer)
  }

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-8" />
      </div>
      {showResults && (
        <div
          className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {loading && (
            <div className="p-3 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          )}

          {!loading && results.length === 0 && query.length >= 2 && (
            <div className="p-3 text-center text-sm text-muted-foreground">
              No customers found
            </div>
          )}

          {!loading && results.map((customer) => (
            <button
              key={customer._id}
              onClick={() => handleSelect(customer)}
              className="w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center space-x-2">
                      <Phone className="h-3 w-3" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {customer.gender && (
                    <Badge variant="outline" className="text-xs">
                      {customer.gender}
                    </Badge>
                  )}
                  <Badge variant={customer.isActive ? "default" : "secondary"} className="text-xs">
                    {customer.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
