"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useDebounce from "@/lib/hooks/use-debounce"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const CATEGORIES = [
    { value: "HAIR_CARE", label: "Hair Care" },
    { value: "SKIN_CARE", label: "Skin Care" },
    { value: "MAKEUP", label: "Makeup" },
    { value: "TOOLS", label: "Tools" },
    { value: "ACCESSORIES", label: "Accessories" },
    { value: "OTHER", label: "Other" },
]

export function ProductFilter({ initialSearchTerm, initialCategoryFilter }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
    const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter)

    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    // Combine all filters into a single useEffect to prevent multiple API calls
    useEffect(() => {
        const params = new URLSearchParams()
        
        // Add search param
        if (debouncedSearchTerm) {
            params.set("search", debouncedSearchTerm)
        }
        
        // Add category param
        if (categoryFilter && categoryFilter !== "all") {
            params.set("category", categoryFilter)
        }
        
        // Preserve other existing params (like page, limit)
        const currentPage = searchParams.get("page")
        const currentLimit = searchParams.get("limit")
        if (currentPage) params.set("page", currentPage)
        if (currentLimit) params.set("limit", currentLimit)
        
        const query = params.toString()
        router.push(`/admin/products${query ? `?${query}` : ""}`)
    }, [debouncedSearchTerm, categoryFilter, router])


    return (
        <div
            className="flex flex-col sm:flex-row gap-4 rounded-lg my-8">
            <div className="flex-1">
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10" />
                </div>
            </div>

            <Select value={categoryFilter || "all"} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                            {category.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}