"use client"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { getServices } from "@/lib/actions/service_action"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { useCallback, useEffect, useState, useRef } from "react"

export function ServiceCombobox({ value, onValueChange, disabled, franchiseId }) {
    const [open, setOpen] = useState(false)
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")

    const hasFetchedInitially = useRef(false)

    const fetchServices = useCallback(async (searchQuery = "") => {
        setLoading(true)
        try {
            const result = await getServices({ limit: 50, search: searchQuery, franchiseId })
            console.log("Service search query ==> ", search)
            if (result.success && result.data?.data) {
                setServices(result.data.data)
            }
        } catch (error) {
            console.error("Failed to fetch services in combobox:", error)
        } finally {
            setLoading(false)
        }
    }, [franchiseId])

    useEffect(() => {
        if (open && (!hasFetchedInitially.current || franchiseId)) {
            hasFetchedInitially.current = true
            fetchServices()
        }
    }, [open, fetchServices, franchiseId])

    useEffect(() => {
        if (!open || !hasFetchedInitially.current) return

        const timer = setTimeout(() => {
            fetchServices(search)
        }, 500)

        return () => clearTimeout(timer)
    }, [search, open, fetchServices])

    const selectedService = services.find(s => s._id === value)

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);
    }

    const formatDuration = (minutes) => {
        if (!minutes) return ""
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        if (hours > 0) {
            return `${hours}h ${mins > 0 ? `${mins}m` : ""}`
        }
        return `${mins}m`
    }

    return (
        <Popover open={open} onOpenChange={setOpen} modal>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {selectedService ? (
                        <div className="flex items-center gap-2 truncate">
                            <span className="font-medium">{selectedService.name}</span>
                            <span className="text-xs text-muted-foreground">({formatCurrency(selectedService.price)})</span>
                        </div>
                    ) : (
                        <span className="text-muted-foreground font-normal">Select service...</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[400px] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Search services by name..."
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList className="max-h-[300px] overflow-y-auto">
                        {loading ? (
                            <div className="p-4 space-y-3">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>No services found.</CommandEmpty>
                                <CommandGroup>
                                    {services.map((service) => (
                                        <CommandItem
                                            key={service._id}
                                            value={service._id}
                                            className="group"
                                            onSelect={() => {
                                                const newValue = service._id === value ? "" : service._id;
                                                const serviceObj = service._id === value ? null : service;
                                                onValueChange(newValue, serviceObj)
                                                setOpen(false)
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4 shrink-0",
                                                    value === service._id ? "opacity-100 group-hover:text-white" : "opacity-0"
                                                )}
                                            />
                                            <div className="flex flex-col flex-1 overflow-hidden">
                                                <div className="flex justify-between w-full pr-2">
                                                    <span className="font-medium truncate">{service.name}</span>
                                                    <span className="font-medium text-sm whitespace-nowrap">{formatCurrency(service.price)}</span>
                                                </div>
                                                <div className="text-xs flex items-center gap-1.5 mt-0.5">
                                                    <span className="bg-muted px-1.5 rounded text-muted-foreground">{service.category?.replace(/_/g, ' ')}</span>
                                                    {service.duration && <span>• {formatDuration(service.duration)}</span>}
                                                </div>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
