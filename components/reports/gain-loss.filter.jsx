"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function GainLossFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [analysisPeriodStart, setAnalysisPeriodStart] = useState(null)
    const [analysisPeriodEnd, setAnalysisPeriodEnd] = useState(null)
    const [basePeriodStart, setBasePeriodStart] = useState(null)
    const [basePeriodEnd, setBasePeriodEnd] = useState(null)

    useEffect(() => {
        const params = new URLSearchParams()
        if (analysisPeriodStart) params.set("analysisPeriodStart", format(analysisPeriodStart, "yyyy-MM-dd"))
        if (analysisPeriodEnd) params.set("analysisPeriodEnd", format(analysisPeriodEnd, "yyyy-MM-dd"))
        if (basePeriodStart) params.set("basePeriodStart", format(basePeriodStart, "yyyy-MM-dd"))
        if (basePeriodEnd) params.set("basePeriodEnd", format(basePeriodEnd, "yyyy-MM-dd"))
        router.push(`?${params.toString()}`)
    }, [analysisPeriodStart, analysisPeriodEnd, basePeriodStart, basePeriodEnd])

    const clearFilters = () => {
        setAnalysisPeriodStart(undefined)
        setAnalysisPeriodEnd(undefined)
        setBasePeriodStart(undefined)
        setBasePeriodEnd(undefined)
        router.push("/admin/reports/gain-loss")
    }

    return (
        <div className="space-y-4 flex justify-between items-center ">
            {/* Analysis Period */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Analysis Period (Current)</label>
                <div className="flex flex-wrap gap-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-[200px] justify-start text-left font-normal",
                                    !analysisPeriodStart && "text-muted-foreground"
                                )}
                            >
                                 <span> From : </span>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {analysisPeriodStart ? format(analysisPeriodStart, "PPP") : "Start Date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={analysisPeriodStart} onSelect={setAnalysisPeriodStart} initialFocus />
                        </PopoverContent>
                    </Popover>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-[200px] justify-start text-left font-normal",
                                    !analysisPeriodEnd && "text-muted-foreground"
                                )}
                            >
                                <span> To : </span>

                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {analysisPeriodEnd ? format(analysisPeriodEnd, "PPP") : "End Date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={analysisPeriodEnd} onSelect={setAnalysisPeriodEnd} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Base Period */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Base Period (Comparison)</label>
                <div className="flex flex-wrap gap-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-[200px] justify-start text-left font-normal",
                                    !basePeriodStart && "text-muted-foreground"
                                )}
                            >
                                <span> From : </span>

                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {basePeriodStart ? format(basePeriodStart, "PPP") : "Start Date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={basePeriodStart} onSelect={setBasePeriodStart} initialFocus />
                        </PopoverContent>
                    </Popover>

                    <Popover>
                        <PopoverTrigger asChild>
                            
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-[200px] justify-start text-left font-normal",
                                    !basePeriodEnd && "text-muted-foreground"
                                )}
                            >
                                <span> To : </span>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {basePeriodEnd ? format(basePeriodEnd, "PPP") : "End Date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={basePeriodEnd} onSelect={setBasePeriodEnd} initialFocus />
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
