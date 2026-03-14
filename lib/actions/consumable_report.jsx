'use server'

import { revalidatePath } from 'next/cache'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

/**
 * Get Consumable Usage Report
 * GET /api/reports/consumable-usage
 */
export async function getConsumableUsageReport({ 
    franchiseId, 
    startDate, 
    endDate, 
    serviceId, 
    productId, 
    providerId 
}) {
    try {
        const params = new URLSearchParams()
        params.append('franchiseId', franchiseId)
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)
        if (serviceId) params.append('serviceId', serviceId)
        if (productId) params.append('productId', productId)
        if (providerId) params.append('providerId', providerId)

        const response = await fetch(
            `${API_BASE_URL}/api/consumablereport/consumable-usage?${params.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store' // Always get fresh data
            }
        )

        const data = await response.json()

        if (!response.ok) {
            return {
                success: false,
                error: data.message || 'Failed to fetch consumable usage report'
            }
        }

        return {
            success: true,
            data: data.data
        }
    } catch (error) {
        console.error('Error fetching consumable usage report:', error)
        return {
            success: false,
            error: error.message || 'An unexpected error occurred'
        }
    }
}

/**
 * Get Detailed Consumable Usage
 * GET /api/reports/consumable-usage/detailed
 */
export async function getDetailedConsumableUsage({
    franchiseId,
    startDate,
    endDate,
    page = 1,
    limit = 50
}) {
    try {
        const params = new URLSearchParams()
        params.append('franchiseId', franchiseId)
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)
        params.append('page', page.toString())
        params.append('limit', limit.toString())

        const response = await fetch(
            `${API_BASE_URL}/api/reports/consumable-usage/detailed?${params.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store'
            }
        )

        const data = await response.json()

        if (!response.ok) {
            return {
                success: false,
                error: data.message || 'Failed to fetch detailed consumable usage'
            }
        }

        return {
            success: true,
            data: data.data
        }
    } catch (error) {
        console.error('Error fetching detailed consumable usage:', error)
        return {
            success: false,
            error: error.message || 'An unexpected error occurred'
        }
    }
}

/**
 * Get Service Profitability
 * GET /api/reports/service-profitability
 */
export async function getServiceProfitability({
    franchiseId,
    startDate,
    endDate
}) {
    try {
        const params = new URLSearchParams()
        params.append('franchiseId', franchiseId)
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)

        const response = await fetch(
            `${API_BASE_URL}/api/reports/service-profitability?${params.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store'
            }
        )

        const data = await response.json()

        if (!response.ok) {
            return {
                success: false,
                error: data.message || 'Failed to fetch service profitability'
            }
        }

        return {
            success: true,
            data: data.data
        }
    } catch (error) {
        console.error('Error fetching service profitability:', error)
        return {
            success: false,
            error: error.message || 'An unexpected error occurred'
        }
    }
}

/**
 * Revalidate report paths
 */
export async function revalidateReports() {
    revalidatePath('/reports/consumable-usage')
    revalidatePath('/reports/service-profitability')
    revalidatePath('/reports/detailed-consumable-usage')
}