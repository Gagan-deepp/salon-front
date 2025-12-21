"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Package as PackageIcon, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CreatePackageModal from "@/components/packages/CreatePackageModal"
import PackageCard from "@/components/packages/PackageCard"
import { getPackages } from "@/lib/actions/package_actions"

export default function PackagesPage() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("ALL")
  const [activeFilter, setActiveFilter] = useState("true")

  useEffect(() => {
    fetchPackages()
  }, [typeFilter, activeFilter])

  const fetchPackages = async () => {
    setLoading(true)
    try {
      const params = {
        activeOnly: activeFilter
      }
      if (typeFilter !== "ALL") params.type = typeFilter

      const response = await getPackages(params)
      setPackages(response.data || [])
    } catch (error) {
      console.error("Error fetching packages:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <PackageIcon className="w-8 h-8 text-primary" />
              Packages
            </h1>
            <p className="text-gray-600 mt-1">Manage salon packages and memberships</p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Package
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Packages</p>
                  <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
                </div>
                <PackageIcon className="w-10 h-10 text-primary/20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Packages</p>
                  <p className="text-2xl font-bold text-green-600">
                    {packages.filter((p) => p.isActive).length}
                  </p>
                </div>
                <Calendar className="w-10 h-10 text-green-500/20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-primary">
                    ₹{packages.reduce((sum, p) => sum + (p.totalValue || 0), 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-10 h-10 text-primary/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search packages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Package Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="VALUE_BASED">Value Based</SelectItem>
                  <SelectItem value="SERVICE_BASED">Service Based</SelectItem>
                  <SelectItem value="MEMBERSHIP">Membership</SelectItem>
                </SelectContent>
              </Select>

              {/* Active Filter */}
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active Only</SelectItem>
                  <SelectItem value="false">All Packages</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={fetchPackages}>
                <Filter className="w-4 h-4 mr-2" />
                Apply
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Package Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPackages.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <PackageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No packages found</h3>
              <p className="text-gray-600 mb-6">Create your first package to get started</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Package
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <PackageCard key={pkg._id} package={pkg} onUpdate={fetchPackages} />
            ))}
          </div>
        )}
      </div>

      {/* Create Package Modal */}
      <CreatePackageModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchPackages}
      />
    </div>
  )
}
