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
import { getProducts } from "@/lib/actions/product_action"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

export function ProductCombobox({ value, onValueChange, disabled, params = {} }) {
    const [open, setOpen] = useState(false)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")

    const hasFetchedInitially = useRef(false)

    const fetchProducts = useCallback(async (searchQuery = "") => {
        setLoading(true)
        try {
            const result = await getProducts({ 
                limit: 50, 
                search: searchQuery,
                ...params
            })
            if (result.success && result.data?.data) {
                setProducts(result.data.data)
            }
        } catch (error) {
            console.error("Failed to fetch products in combobox:", error)
        } finally {
            setLoading(false)
        }
    }, [JSON.stringify(params)])

    // Initial fetch when popover opens
    useEffect(() => {
        if (open && !hasFetchedInitially.current) {
            hasFetchedInitially.current = true
            fetchProducts()
        }
    }, [open, fetchProducts])

    // Debounced search — only runs after first open
    useEffect(() => {
        if (!open || !hasFetchedInitially.current) return

        const timer = setTimeout(() => {
            fetchProducts(search)
        }, 500)

        return () => clearTimeout(timer)
    }, [search, open, fetchProducts])

    const selectedProduct = products.find(p => p._id === value)

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount || 0)

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
                    {selectedProduct ? (
                        <div className="flex items-center gap-2 truncate">
                            <span className="font-medium">{selectedProduct.name}</span>
                            <span className="text-xs text-muted-foreground">
                                ({formatCurrency(selectedProduct.price?.mrp)})
                            </span>
                        </div>
                    ) : (
                        <span className="text-muted-foreground font-normal">Select product...</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[400px] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Search products by name..."
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
                                <CommandEmpty>No products found.</CommandEmpty>
                                <CommandGroup>
                                    {products.map((product) => (
                                        <CommandItem
                                            key={product._id}
                                            value={product._id}
                                            onSelect={() => {
                                                const newValue = product._id === value ? "" : product._id
                                                const productObj = product._id === value ? null : product
                                                onValueChange(newValue, productObj)
                                                setOpen(false)
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4 shrink-0",
                                                    value === product._id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <div className="flex flex-col flex-1 overflow-hidden">
                                                <div className="flex justify-between w-full pr-2">
                                                    <span className="font-medium truncate">{product.name}</span>
                                                    <span className="font-medium text-sm text-primary whitespace-nowrap">
                                                        {formatCurrency(product.price?.mrp)}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                    {product.category && (
                                                        <span className="bg-muted px-1.5 rounded">{product.category}</span>
                                                    )}
                                                    {product.brand && <span>• {product.brand}</span>}
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
