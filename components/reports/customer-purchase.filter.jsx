"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export default function CustomerPurchaseFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [customerType, setCustomerType] = useState("Total")

    useEffect(() => {
        const params = new URLSearchParams(searchParams)
        if (startDate) params.set("startDate", format(startDate, "yyyy-MM-dd"))
        if (endDate) params.set("endDate", format(endDate, "yyyy-MM-dd"))
        if (customerType) params.set("customerType", customerType)
        router.push(`?${params.toString()}`)
    }, [startDate, endDate, customerType])

    return (
        <div className="flex flex-wrap gap-4 items-center">
            {/* Start Date */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-[200px] justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Start Date"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
            </Popover>

            {/* End Date */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-[200px] justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "End Date"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
            </Popover>

            {/* Customer Type */}
            <Select value={customerType} onValueChange={setCustomerType}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Customer Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Total">Total Customers</SelectItem>
                    <SelectItem value="New">New Customers</SelectItem>
                    <SelectItem value="Existing">Existing Customers</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
