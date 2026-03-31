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
import { getCustomers } from "@/lib/actions/customer_action"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { useCallback, useEffect, useState, useRef } from "react"

export function CustomerCombobox({ value, onValueChange, disabled }) {
    const [open, setOpen] = useState(false)
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")

    // Use a ref to store initial fetch to prevent doing it continuously if search is ""
    const hasFetchedInitially = useRef(false)

    const fetchCustomers = useCallback(async (searchQuery = "") => {
        setLoading(true)
        try {
            const result = await getCustomers({ limit: 50, search: searchQuery, isActive: true })
            if (result.success && result.data?.data?.customers) {
                setCustomers(result.data.data.customers)
            }
        } catch (error) {
            console.error("Failed to fetch customers in combobox:", error)
        } finally {
            setLoading(false)
        }
    }, [])

    // Fetch initially when opened
    useEffect(() => {
        if (open && !hasFetchedInitially.current) {
            hasFetchedInitially.current = true
            fetchCustomers()
        }
    }, [open, fetchCustomers])

    // Debounced search (only runs if user types, not on first open)
    useEffect(() => {
        if (!open || !hasFetchedInitially.current) return

        const timer = setTimeout(() => {
            fetchCustomers(search)
        }, 500)

        return () => clearTimeout(timer)
    }, [search, open, fetchCustomers])

    const selectedCustomer = customers.find(c => c._id === value)

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
                    {selectedCustomer ? (
                        <div className="flex items-center gap-2 truncate">
                            <span className="font-medium">{selectedCustomer.name}</span>
                            {selectedCustomer.phone && <span className="text-xs text-muted-foreground truncate">({selectedCustomer.phone})</span>}
                        </div>
                    ) : (
                        <span className="text-muted-foreground font-normal">Select customer...</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[400px] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Search customers by name or phone..."
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
                                <CommandEmpty>No customers found.</CommandEmpty>
                                <CommandGroup>
                                    {customers.map((customer) => (
                                        <CommandItem
                                            key={customer._id}
                                            value={customer._id}
                                            className="group"
                                            onSelect={() => {
                                                const newValue = customer._id === value ? "" : customer._id;
                                                const customerObj = customer._id === value ? null : customer;
                                                onValueChange(newValue, customerObj)
                                                setOpen(false)
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4 shrink-0",
                                                    value === customer._id ? "opacity-100 group-hover:text-white" : "opacity-0"
                                                )}
                                            />
                                            <div className="flex flex-col flex-1 overflow-hidden">
                                                <span className="font-medium truncate">{customer.name}</span>
                                                <div className="text-xs flex gap-1 truncate">
                                                    <span>{customer.phone}</span>
                                                    {customer.email && <span>• {customer.email}</span>}
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
