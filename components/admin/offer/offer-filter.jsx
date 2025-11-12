"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function OfferFilter({ initialSearchTerm, initialStatusFilter, initialActiveOnly }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter)
  const [activeOnly, setActiveOnly] = useState(initialActiveOnly)

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    
    if (searchTerm) {
      params.set("search", searchTerm)
    } else {
      params.delete("search")
    }

    if (statusFilter && statusFilter !== "all") {
      params.set("status", statusFilter)
    } else {
      params.delete("status")
    }

    if (activeOnly) {
      params.set("activeOnly", "true")
    } else {
      params.delete("activeOnly")
    }

    params.set("page", "1") // Reset to first page on filter change

    router.push(`/admin/offers?${params.toString()}`)
  }, [searchTerm, statusFilter, activeOnly, router, searchParams])

  const handleClearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setActiveOnly(false)
    router.push("/admin/offers")
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by offer code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="EXPIRED">Expired</SelectItem>
            <SelectItem value="EXHAUSTED">Exhausted</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        <Button 
          variant="outline" 
          onClick={handleClearFilters}
          className="w-full md:w-auto"
        >
          <X className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      </div>

      {/* Active Only Toggle */}
      <div className="flex items-center space-x-2">
        <Switch
          id="active-only"
          checked={activeOnly}
          onCheckedChange={setActiveOnly}
        />
        <Label htmlFor="active-only" className="cursor-pointer">
          Show only active offers
        </Label>
      </div>
    </div>
  )
}
