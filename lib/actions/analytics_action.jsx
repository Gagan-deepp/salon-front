"use server"
import axios from "axios"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { auth } from "../auth" // adjust if needed

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"

// Resolve Bearer token (next-auth session → cookie fallback)
async function getAuthHeaders() {
    const jar = cookies()
    const session = await auth().catch(() => null)
    const token = session?.accessToken || jar.get("accessToken")?.value || jar.get("token")?.value

    return token ? { Authorization: `Bearer ${token}` } : {}
}

// ───────────────────────────────────────────────────────────────────────────────
export async function getCustomerData() {
    try {
        const headers = await getAuthHeaders()
        const res = await axios.get(`${BASE_URL}/analytics/customers`, { headers })
        // console.log("getCustomerData response", res.data)
        return { success: true, data: res.data }
    } catch (error) {
        console.error("getCustomerData error", error)
        return { success: false, error: error.response?.data?.message || "getCustomerData failed" }
    }
}

export async function getSalesData() {
    try {
        const headers = await getAuthHeaders()
        const res = await axios.get(`${BASE_URL}/analytics/sales`, { headers })
        // console.log("getSalesData response", res.data)
        return res.data
    } catch (error) {
        console.error("getSalesData error", error)
        return { success: false, error: error.response?.data?.message || "getSalesData failed" }
    }
}

export async function getMetrics() {
    try {
        const headers = await getAuthHeaders()
        const res = await axios.get(`${BASE_URL}/analytics/metrics`, { headers })
        // console.log("getSalesData response", res.data)
        return res.data
    } catch (error) {
        console.error("getSalesData error", error)
        return { success: false, error: error.response?.data?.message || "getSalesData failed" }
    }
}