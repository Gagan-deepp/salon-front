"use server"
import axios from "axios"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { auth } from "../auth"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"

// Resolve the Bearer token from next-auth session (preferred) or cookies (fallback)
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
// Franchises: Create (POST /franchises)
export async function createFranchise(payload) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.post(`${BASE_URL}/franchises`, payload, { headers })
    console.log("createFranchise response", res.data)
    revalidatePath("/admin/franchises")
    return { success: true, data: res.data }
  } catch (error) {
    console.error("createFranchise error", error)
    return { success: false, error: error.response?.data?.message || "createFranchise failed" }
  }
}

// Franchises: Update (PUT /franchises/{franchiseId})
export async function updateFranchise(franchiseId, payload) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.put(`${BASE_URL}/franchises/${franchiseId}`, payload, { headers })
    console.log("updateFranchise response", res.data)
    revalidatePath("/admin/franchises")
    revalidatePath(`/admin/franchises/${franchiseId}`)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("updateFranchise error", error)
    return { success: false, error: error.response?.data?.message || "updateFranchise failed" }
  }
}

// Franchises: List (GET /franchises?page=&limit=&q=&sort=...)
export async function getFranchises(params) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/franchises`, { params, headers })
    console.log("getFranchises response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getFranchises error", error)
    return { success: false, error: error.response?.data?.message || "getFranchises failed" }
  }
}

// Franchises: Get by ID (GET /franchises/{franchiseId})
export async function getFranchiseById(franchiseId) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/franchises/${franchiseId}`, { headers })
    console.log("getFranchiseById response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getFranchiseById error", error)
    return { success: false, error: error.response?.data?.message || "getFranchiseById failed" }
  }
}

// Franchises: My Franchise (GET /franchises/my-franchise)
export async function getMyFranchise() {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/franchises/my-franchise`, { headers })
    console.log("getMyFranchise response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getMyFranchise error", error)
    return { success: false, error: error.response?.data?.message || "getMyFranchise failed" }
  }
}

// Franchises: Analytics (GET /franchises/{franchiseId}/analytics?startDate=&endDate=)
export async function getFranchiseAnalytics(franchiseId, params) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/franchises/${franchiseId}/analytics`, {
      params,
      headers,
    })
    console.log("getFranchiseAnalytics response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getFranchiseAnalytics error", error)
    return { success: false, error: error.response?.data?.message || "getFranchiseAnalytics failed" }
  }
}
