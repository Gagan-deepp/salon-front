"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Filter, CalendarIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import useDebounce from "@/lib/hooks/use-debounce"

export function PaymentFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
    const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all")
    const [paymentModeFilter, setPaymentModeFilter] = useState(searchParams.get("paymentMode") || "all")
    const [startDate, setStartDate] = useState(
        searchParams.get("startDate") ? new Date(searchParams.get("startDate")) : undefined
    )
    const [endDate, setEndDate] = useState(
        searchParams.get("endDate") ? new Date(searchParams.get("endDate")) : undefined
    )

    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    // Combine all filters into a single useEffect to prevent multiple API calls
    useEffect(() => {
        const params = new URLSearchParams()
        
        // Add search param
        if (debouncedSearchTerm) {
            params.set("search", debouncedSearchTerm)
        }
        
        // Add status param
        if (statusFilter && statusFilter !== "all") {
            params.set("status", statusFilter)
        }
        
        // Add payment mode param
        if (paymentModeFilter && paymentModeFilter !== "all") {
            params.set("paymentMode", paymentModeFilter)
        }
        
        // Add date params
        if (startDate) {
            params.set("startDate", format(startDate, "yyyy-MM-dd"))
        }
        if (endDate) {
            params.set("endDate", format(endDate, "yyyy-MM-dd"))
        }
        
        // Preserve pagination
        const currentPage = searchParams.get("page")
        const currentLimit = searchParams.get("limit")
        if (currentPage) params.set("page", currentPage)
        if (currentLimit) params.set("limit", currentLimit)
        
        const query = params.toString()
        router.push(`/admin/payments${query ? `?${query}` : ""}`)
    }, [debouncedSearchTerm, statusFilter, paymentModeFilter, startDate, endDate, router])

    const clearFilters = () => {
        setSearchTerm("")
        setStartDate(undefined)
        setEndDate(undefined)
        router.push("/admin/payments")
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">

                    <div className="flex items-center gap-4">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
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
                        <Select value={paymentModeFilter} onValueChange={setPaymentModeFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="All Payment Modes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Payment Modes</SelectItem>
                                <SelectItem value="CASH">Cash</SelectItem>
                                <SelectItem value="CARD">Card</SelectItem>
                                <SelectItem value="UPI">UPI</SelectItem>
                            </SelectContent>
                        </Select>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {startDate ? format(startDate, "PPP") : "Start Date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={setStartDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {endDate ? format(endDate, "PPP") : "End Date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setEndDate}
                                    initialFocus
                                    disabled={(date) => startDate ? date < startDate : false}
                                />
                            </PopoverContent>
                        </Popover>
                        <Button variant="outline" onClick={clearFilters}>
                            <Filter className="w-4 h-4 mr-2" />
                            Clear Filters
                        </Button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search payments..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
