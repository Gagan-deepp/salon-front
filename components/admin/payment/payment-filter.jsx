"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export function PaymentFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")

    const handleSearch = (value) => {
        const params = new URLSearchParams(searchParams)
        if (value) {
            params.set("search", value)
        } else {
            params.delete("search")
        }
        params.delete("page")
        router.push(`/admin/payments?${params.toString()}`)
    }

    const handleStatusFilter = (value) => {
        const params = new URLSearchParams(searchParams)
        if (value && value !== "all") {
            params.set("status", value)
        } else {
            params.delete("status")
        }
        params.delete("page")
        router.push(`/admin/payments?${params.toString()}`)
    }

    const handlePaymentModeFilter = (value) => {
        const params = new URLSearchParams(searchParams)
        if (value && value !== "all") {
            params.set("paymentMode", value)
        } else {
            params.delete("paymentMode")
        }
        params.delete("page")
        router.push(`/admin/payments?${params.toString()}`)
    }

    const clearFilters = () => {
        setSearchTerm("")
        router.push("/admin/payments")
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search payments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch(searchTerm)
                                }
                            }}
                            className="pl-10"
                        />
                    </div>
                    <Select value={searchParams.get("status") || "all"} onValueChange={handleStatusFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="FAILED">Failed</SelectItem>
                            <SelectItem value="REFUNDED">Refunded</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={searchParams.get("paymentMode") || "all"} onValueChange={handlePaymentModeFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Payment Modes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Payment Modes</SelectItem>
                            <SelectItem value="CASH">Cash</SelectItem>
                            <SelectItem value="CARD">Card</SelectItem>
                            <SelectItem value="UPI">UPI</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={clearFilters}>
                        <Filter className="w-4 h-4 mr-2" />
                        Clear Filters
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
