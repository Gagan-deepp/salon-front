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

// Optional: light coercion to align with your Mongoose schema
function normalizeServicePayload(payload = {}) {
  const toNum = (v) => (v === undefined || v === null || v === "" ? v : Number(v))
  return {
    ...payload,
    duration: toNum(payload.duration),
    price: toNum(payload.price),
    gstRate: toNum(payload.gstRate),
    commissionRate: toNum(payload.commissionRate),
    // Ensure arrays for allowedRoles
    allowedRoles: Array.isArray(payload.allowedRoles)
      ? payload.allowedRoles
      : payload.allowedRoles
        ? [payload.allowedRoles]
        : [],
  };
}

// ───────────────────────────────────────────────────────────────────────────────
// Services: Create (POST /services)
export async function createService(payload) {
  try {
    const headers = await getAuthHeaders()
    const body = normalizeServicePayload(payload)
    const res = await axios.post(`${BASE_URL}/services`, body, { headers })
    console.log("createService response", res.data)
    revalidatePath("/admin/services")
    return { success: true, data: res.data }
  } catch (error) {
    console.error("createService error", error)
    return { success: false, error: error.response?.data?.message || "createService failed" }
  }
}

// Services: List / Filter (GET /services?page=&limit=&category=&role=&search=)
export async function getServices(params) {
  try {
    const headers = await getAuthHeaders()
    console.log("getServices params", params)
    const res = await axios.get(`${BASE_URL}/services`, { params, headers })
    // console.log("getServices response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getServices error", error.response?.data)
    return { success: false, error: error.response?.data?.message || "getServices failed" }
  }
}

// Services: Categories (GET /services/categories)
export async function getServiceCategories() {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/services/categories`, { headers })
    console.log("getServiceCategories response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getServiceCategories error", error)
    return { success: false, error: error.response?.data?.message || "getServiceCategories failed" }
  }
}

// Services: Popular (GET /services/popular?startDate=&endDate=&limit=)
export async function getPopularServices(params) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/services/popular`, { params, headers })
    console.log("getPopularServices response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getPopularServices error", error)
    return { success: false, error: error.response?.data?.message || "getPopularServices failed" }
  }
}

// Services: By Price Range (GET /services/price-range?minPrice=&maxPrice=)
export async function getServicesByPriceRange(params) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/services/price-range`, { params, headers })
    console.log("getServicesByPriceRange response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getServicesByPriceRange error", error)
    return { success: false, error: error.response?.data?.message || "getServicesByPriceRange failed" }
  }
}

// Services: By Role (GET /services/role/{role})
export async function getServicesByRole(role, params) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/services/role/${role}`, { params, headers })
    console.log("getServicesByRole response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getServicesByRole error", error)
    return { success: false, error: error.response?.data?.message || "getServicesByRole failed" }
  }
}

// Services: Get by ID (GET /services/{serviceId})
export async function getServiceById(serviceId) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/services/${serviceId}`, { headers })
    console.log("getServiceById response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getServiceById error", error.response?.data)
    return { success: false, error: error.response?.data?.message || "getServiceById failed" }
  }
}

// Services: Update (PUT /services/{serviceId})
export async function updateService(serviceId, payload) {
  try {
    const headers = await getAuthHeaders()
    const body = normalizeServicePayload(payload)
    const res = await axios.put(`${BASE_URL}/services/${serviceId}`, body, { headers })
    console.log("updateService response", res.data)
    revalidatePath("/admin/services")
    revalidatePath(`/admin/services/${serviceId}`)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("updateService error", error)
    return { success: false, error: error.response?.data?.message || "updateService failed" }
  }
}

// Services: Delete (deactivate) (DELETE /services/{serviceId})
export async function deleteService(serviceId) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.delete(`${BASE_URL}/services/${serviceId}`, { headers })
    console.log("deleteService response", res.data)
    revalidatePath("/admin/services")
    return { success: true, data: res.data }
  } catch (error) {
    console.error("deleteService error", error)
    return { success: false, error: error.response?.data?.message || "deleteService failed" }
  }
}
