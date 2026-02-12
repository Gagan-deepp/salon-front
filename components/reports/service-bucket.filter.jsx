"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Filter, CalendarIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"

export function ServiceBucketFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [startDate, setStartDate] = useState(
        searchParams.get("startDate") ? new Date(searchParams.get("startDate")) : undefined
    )
    const [endDate, setEndDate] = useState(
        searchParams.get("endDate") ? new Date(searchParams.get("endDate")) : undefined
    )
    const [customerType, setCustomerType] = useState(
        searchParams.get("customerType") || "Overall"
    )

    // Combine all filters into a single useEffect to prevent multiple API calls
    useEffect(() => {
        const params = new URLSearchParams()

        // Add date params
        if (startDate) {
            params.set("startDate", format(startDate, "yyyy-MM-dd"))
        }
        if (endDate) {
            params.set("endDate", format(endDate, "yyyy-MM-dd"))
        }

        // Add customer type
        if (customerType) {
            params.set("customerType", customerType)
        }

        const query = params.toString()
        router.push(`/admin/reports/customer-service-bucket${query ? `?${query}` : ""}`)
    }, [startDate, endDate, customerType, router])

    const clearFilters = () => {
        setStartDate(undefined)
        setEndDate(undefined)
        setCustomerType("Overall")
        router.push("/admin/reports/customer-service-bucket")
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4 flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <Popover>
                            <PopoverTrigger asChild className="w-full">
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
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
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
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

                        <Select value={customerType} onValueChange={setCustomerType}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Customer Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Overall">Overall</SelectItem>
                                <SelectItem value="New">New Customers</SelectItem>
                                <SelectItem value="Existing">Existing Customers</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="secondary" onClick={clearFilters} className="w-full">
                            <Filter className="w-4 h-4 mr-2" />
                            Clear Filters
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
