"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

const SUBSCRIPTION_PLANS = [
  { value: "all", label: "All Plans" },
  { value: "BASIC", label: "Basic" },
  { value: "STANDARD", label: "Standard" },
  { value: "PREMIUM", label: "Premium" },
]

const SUBSCRIPTION_STATUS = [
  { value: "all", label: "All Status" },
  { value: "TRIAL", label: "Trial" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "EXPIRED", label: "Expired" },
]

export function CompanyFilter({
  initialSearchTerm = "",
  initialStatusFilter = "all",
  initialPlanFilter = "all"
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter)
  const [planFilter, setPlanFilter] = useState(initialPlanFilter)

  const updateURL = (newParams) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    params.delete("page") // Reset to first page when filtering
    params.set("page", "1")
    const queryString = params.toString()
    const url = queryString ? `?${queryString}` : ""

    router.push(`/admin/companies${url}`)
  }

  const handleSearch = () => {
    updateURL({
      search: searchTerm,
      status: statusFilter,
      plan: planFilter,
    })
  }

  const handleClear = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setPlanFilter("all")
    router.push("/admin/companies")
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search companies, owners, or company IDs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
      </div>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {SUBSCRIPTION_STATUS.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={planFilter} onValueChange={setPlanFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by plan" />
        </SelectTrigger>
        <SelectContent>
          {SUBSCRIPTION_PLANS.map((plan) => (
            <SelectItem key={plan.value} value={plan.value}>
              {plan.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Button onClick={handleSearch}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
        <Button variant="outline" onClick={handleClear}>
          <X className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>
    </div>
  )
}
