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

    useEffect(() => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        if (debouncedSearchTerm) {
            current.set("search", debouncedSearchTerm)
        } else {
            current.delete("search")
        }
        router.push(`?${current.toString()}`)
    }, [debouncedSearchTerm, router, searchParams])

    useEffect(() => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        if (categoryFilter && categoryFilter !== "all") {
            current.set("category", categoryFilter)
        } else {
            current.delete("category")
        }
        router.push(`?${current.toString()}`)
    }, [categoryFilter, router, searchParams])


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