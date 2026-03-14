'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon, FilterX } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export function ConsumableUsageFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const [startDate, setStartDate] = useState(
        searchParams.get('startDate') ? new Date(searchParams.get('startDate')) : null
    )
    const [endDate, setEndDate] = useState(
        searchParams.get('endDate') ? new Date(searchParams.get('endDate')) : null
    )
    const [serviceId, setServiceId] = useState(searchParams.get('serviceId') || 'all')
    const [productId, setProductId] = useState(searchParams.get('productId') || 'all')

    const applyFilters = () => {
        const params = new URLSearchParams()
        
        if (startDate) params.set('startDate', format(startDate, 'yyyy-MM-dd'))
        if (endDate) params.set('endDate', format(endDate, 'yyyy-MM-dd'))
        if (serviceId && serviceId !== 'all') params.set('serviceId', serviceId)
        if (productId && productId !== 'all') params.set('productId', productId)

        startTransition(() => {
            router.push(`?${params.toString()}`)
        })
    }

    const clearFilters = () => {
        setStartDate(null)
        setEndDate(null)
        setServiceId('all')
        setProductId('all')
        
        startTransition(() => {
            router.push(window.location.pathname)
        })
    }

    return (
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Start Date */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                'w-full sm:w-[200px] justify-start text-left font-normal',
                                !startDate && 'text-muted-foreground'
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, 'PPP') : 'Start Date'}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                {/* End Date */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                'w-full sm:w-[200px] justify-start text-left font-normal',
                                !endDate && 'text-muted-foreground'
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, 'PPP') : 'End Date'}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                {/* Service Filter */}
                <Select value={serviceId} onValueChange={setServiceId}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="All Services" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        {/* Add service options here dynamically */}
                        {/* Example: services.map(service => (
                            <SelectItem key={service._id} value={service._id}>
                                {service.name}
                            </SelectItem>
                        )) */}
                    </SelectContent>
                </Select>

                {/* Product Filter */}
                <Select value={productId} onValueChange={setProductId}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="All Products" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Products</SelectItem>
                        {/* Add product options here dynamically */}
                        {/* Example: products.map(product => (
                            <SelectItem key={product._id} value={product._id}>
                                {product.name}
                            </SelectItem>
                        )) */}
                    </SelectContent>
                </Select>

                {/* Action Buttons */}
                <div className="flex gap-2 ml-auto">
                    <Button
                        onClick={applyFilters}
                        disabled={isPending}
                        className="flex-1 sm:flex-none"
                    >
                        {isPending ? 'Applying...' : 'Apply Filters'}
                    </Button>
                    <Button
                        onClick={clearFilters}
                        variant="outline"
                        disabled={isPending}
                        className="flex-1 sm:flex-none"
                    >
                        <FilterX className="h-4 w-4 mr-2" />
                        Clear
                    </Button>
                </div>
            </div>
        </div>
    )
}

export function ServiceProfitabilityFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const [startDate, setStartDate] = useState(
        searchParams.get('startDate') ? new Date(searchParams.get('startDate')) : null
    )
    const [endDate, setEndDate] = useState(
        searchParams.get('endDate') ? new Date(searchParams.get('endDate')) : null
    )

    const applyFilters = () => {
        const params = new URLSearchParams()
        
        if (startDate) params.set('startDate', format(startDate, 'yyyy-MM-dd'))
        if (endDate) params.set('endDate', format(endDate, 'yyyy-MM-dd'))

        startTransition(() => {
            router.push(`?${params.toString()}`)
        })
    }

    const clearFilters = () => {
        setStartDate(null)
        setEndDate(null)
        
        startTransition(() => {
            router.push(window.location.pathname)
        })
    }

    return (
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Start Date */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                'w-full sm:w-[200px] justify-start text-left font-normal',
                                !startDate && 'text-muted-foreground'
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, 'PPP') : 'Start Date'}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                {/* End Date */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                'w-full sm:w-[200px] justify-start text-left font-normal',
                                !endDate && 'text-muted-foreground'
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, 'PPP') : 'End Date'}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                {/* Action Buttons */}
                <div className="flex gap-2 ml-auto">
                    <Button
                        onClick={applyFilters}
                        disabled={isPending}
                        className="flex-1 sm:flex-none"
                    >
                        {isPending ? 'Applying...' : 'Apply Filters'}
                    </Button>
                    <Button
                        onClick={clearFilters}
                        variant="outline"
                        disabled={isPending}
                        className="flex-1 sm:flex-none"
                    >
                        <FilterX className="h-4 w-4 mr-2" />
                        Clear
                    </Button>
                </div>
            </div>
        </div>
    )
}