"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function RepeatCustomerFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

    useEffect(() => {
        const params = new URLSearchParams()

        console.log("Start date in effect ==> ", startDate)
        if (startDate) params.set("startDate", format(startDate, "yyyy-MM-dd"))
        if (endDate) params.set("endDate", format(endDate, "yyyy-MM-dd"))
        router.push(`?${params.toString()}`)
    }, [startDate, endDate])

    const clearFilters = () => {
        setStartDate(undefined)
        setEndDate(undefined)
    }

    return (
        <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <div className="flex flex-wrap gap-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-[200px] justify-start text-left font-normal",
                                    !startDate && "text-muted-foreground"
                                )}
                            >
                                <span>From : </span>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, "PPP") : "Start Date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                        </PopoverContent>
                    </Popover>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-[200px] justify-start text-left font-normal",
                                    !endDate && "text-muted-foreground"
                                )}
                            >
                                <span>To : </span>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {endDate ? format(endDate, "PPP") : "End Date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <Button variant="secondary" onClick={clearFilters} className="w-fit">
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
            </Button>
        </div>
    )
}
