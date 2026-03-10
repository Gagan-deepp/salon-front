"use server"
import axios from "axios"
import { getAuthHeaders } from "./franchise_action"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"


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
        const res = await axios.get(`${BASE_URL}/customerreport/gain-loss?franchiseId=${franchiseId}&analysisPeriodStart=${analysisPeriodStart}&analysisPeriodEnd=${analysisPeriodEnd}&basePeriodStart=${basePeriodStart}&basePeriodEnd=${basePeriodEnd}`, {
            headers
        })
        console.log("getGainLoss response", res.data)
        return { success: true, data: res.data.data }
    } catch (error) {
        console.error("getGainLoss error", error.response?.data)
        return { success: false, error: error.response?.data?.message || "getGainLoss failed" }
    }
}
