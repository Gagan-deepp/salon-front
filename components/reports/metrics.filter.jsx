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

export function CustomerMetricsFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [startDate, setStartDate] = useState(
        searchParams.get("startDate") ? new Date(searchParams.get("startDate")) : undefined
    )
    const [endDate, setEndDate] = useState(
        searchParams.get("endDate") ? new Date(searchParams.get("endDate")) : undefined
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

        const query = params.toString()
        router.push(`/admin/reports/customer-metrics${query ? `?${query}` : ""}`)
    }, [startDate, endDate, router])

    const clearFilters = () => {
        setStartDate(undefined)
        setEndDate(undefined)
        router.push("/admin/reports/customer-metrics")
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4 flex-1">

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <Popover>
                            <PopoverTrigger asChild className="w-full" >
                                <Button variant="outline" className="w-[200px] justify-start text-left font-normal w-full">
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
                                <Button variant="outline" className="w-[200px] justify-start text-left font-normal w-full">
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
                        <Button variant="secondary" onClick={clearFilters} className="w-full" >
                            <Filter className="w-4 h-4 mr-2" />
                            Clear Filters
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
