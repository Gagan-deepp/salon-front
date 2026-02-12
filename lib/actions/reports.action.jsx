"use server"
import axios from "axios"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { auth } from "../auth"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"

async function getAuthHeaders() {
    const jar = cookies()
    const session = await auth().catch(() => null) // guards against auth() throwing
    const token =
        session?.accessToken ||
        jar.get("accessToken")?.value ||
        jar.get("token")?.value
    return token ? { Authorization: `Bearer ${token}` } : {}
}

// ───────────────────────────────────────────────────────────────────────────────
export async function getCustomerMetricsReport(franchiseId, startDate, endDate) {
    console.log("Url ==> ", `${BASE_URL}/customerreport/customer-metrics?franchiseId=${franchiseId}&startDate=${startDate}&endDate=${endDate}`)
    try {
        const headers = await getAuthHeaders()
        const res = await axios.get(`${BASE_URL}/customerreport/customer-metrics?franchiseId=${franchiseId}&startDate=${startDate}&endDate=${endDate}`, {
            headers
        })
        console.log("getCustomerMetricsReport response", res.data)
        return { success: true, data: res.data.data }
    } catch (error) {
        console.error("getCustomerMetricsReport error", error.response?.data)
        return { success: false, error: error.response?.data?.message || "getCustomerMetricsReport failed" }
    }
}


// ───────────────────────────────────────────────────────────────────────────────
export async function getCustomerOverallBasket(franchiseId, startDate, endDate, customerType = "Overall") {
    try {
        const headers = await getAuthHeaders()
        const res = await axios.get(`${BASE_URL}/customerreport/service-count?franchiseId=${franchiseId}&customerType=${customerType}&startDate=${startDate}&endDate=${endDate}`, {
            headers
        })
        console.log("getCustomerOverallBasket response", res.data)
        return { success: true, data: res.data.data }
    } catch (error) {
        console.error("getCustomerOverallBasket error", error.response?.data)
        return { success: false, error: error.response?.data?.message || "getCustomerOverallBasket failed" }
    }
}


// ───────────────────────────────────────────────────────────────────────────────
export async function getCustomerPurchase(franchiseId, startDate, endDate, customerType = "Total") {
    try {
        const headers = await getAuthHeaders()
        const res = await axios.get(`${BASE_URL}/customerreport/service-category?franchiseId=${franchiseId}&customerType=${customerType}&startDate=${startDate}&endDate=${endDate}`, {
            headers
        })
        console.log("getCustomerPurchase response", res.data)
        return { success: true, data: res.data.data }
    } catch (error) {
        console.error("getCustomerPurchase error", error.response?.data)
        return { success: false, error: error.response?.data?.message || "getCustomerPurchase failed" }
    }
}


// ───────────────────────────────────────────────────────────────────────────────
export async function getGainLoss(franchiseId, analysisPeriodStart, analysisPeriodEnd, basePeriodStart, basePeriodEnd) {
    try {
        const headers = await getAuthHeaders()
        const res = await axios.get(`${BASE_URL}/customerreport/gain-loss?franchiseId=${"691e06a8f4564ffa2f5c2110"}&analysisPeriodStart=${"2025-01-01"}&analysisPeriodEnd=${"2025-10-31"}&basePeriodStart=${"2024-01-01"}&basePeriodEnd=${"2024-10-31"}`, {
            headers
        })
        console.log("getGainLoss response", res.data)
        return { success: true, data: res.data.data }
    } catch (error) {
        console.error("getGainLoss error", error.response?.data)
        return { success: false, error: error.response?.data?.message || "getGainLoss failed" }
    }
}
