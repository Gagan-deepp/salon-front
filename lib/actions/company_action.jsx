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

// Optional: light coercion to align with your company schema
function normalizeCompanyPayload(payload = {}) {
  const toNum = (v) => (v === undefined || v === null || v === "" ? v : Number(v))
  return {
    ...payload,
    // Normalize subscription if present
    subscription: payload.subscription ? {
      ...payload.subscription,
      monthlyPrice: toNum(payload.subscription.monthlyPrice),
      maxUsers: toNum(payload.subscription.maxUsers),
      maxFranchises: toNum(payload.subscription.maxFranchises),
    } : payload.subscription,
  };
}

// ───────────────────────────────────────────────────────────────────────────────
// Companies: Create (POST /companies)
export async function createCompany(payload) {
  try {
    const headers = await getAuthHeaders()
    const body = normalizeCompanyPayload(payload)
    const res = await axios.post(`${BASE_URL}/companies`, body, { headers })
    console.log("createCompany response", res.data)
    revalidatePath("/admin/companies")
    return { success: true, data: res.data }
  } catch (error) {
    console.error("createCompany error", error)
    return { success: false, error: error.response?.data?.message || "createCompany failed" }
  }
}

// Companies: List / Filter (GET /companies?page=&limit=&status=&plan=&search=)
export async function getCompanies(params = {}) {
  try {
    const headers = await getAuthHeaders()
    console.log("getCompanies params:", params)
    console.log("getCompanies headers:", headers)
    
    const res = await axios.get(`${BASE_URL}/companies`, { params, headers })
    console.log("getCompanies response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getCompanies error", error)
    return { 
      success: false, 
      error: error.response?.data?.message || "getCompanies failed",
      data: { companies: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } }
    }
  }
}

// Companies: Get SaaS Dashboard (GET /companies/dashboard)
export async function getSaaSDashboard() {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/companies/dashboard`, { headers })
    console.log("getSaaSDashboard response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getSaaSDashboard error", error)
    return { success: false, error: error.response?.data?.message || "getSaaSDashboard failed" }
  }
}

// Companies: Get by ID (GET /companies/{companyId})
export async function getCompany(companyId) {
  try {
    const headers = await getAuthHeaders()
    console.log("company in api ====================",companyId)
    const res = await axios.get(`${BASE_URL}/companies/${companyId}`, { headers })
    console.log("getCompany response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getCompany error", error)
    return { success: false, error: error.response?.data?.message || "getCompany failed" }
  }
}

// Companies: Get Company Stats (GET /companies/{companyId}/stats)
export async function getCompanyStats(companyId) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/companies/${companyId}/stats`, { headers })
    console.log("getCompanyStats response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getCompanyStats error", error)
    return { success: false, error: error.response?.data?.message || "getCompanyStats failed" }
  }
}

// Companies: Update Subscription (PUT /companies/{companyId}/subscription)
export async function updateCompanySubscription(companyId, payload) {
  try {
    const headers = await getAuthHeaders()
    const body = normalizeCompanyPayload({ subscription: payload }).subscription
    const res = await axios.put(`${BASE_URL}/companies/${companyId}/subscription`, body, { headers })
    console.log("updateCompanySubscription response", res.data)
    revalidatePath("/admin/companies")
    revalidatePath(`/admin/companies/${companyId}`)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("updateCompanySubscription error", error)
    return { success: false, error: error.response?.data?.message || "updateCompanySubscription failed" }
  }
}

// Companies: Toggle Status (PUT /companies/{companyId}/status)
export async function toggleCompanyStatus(companyId, isActive) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.put(`${BASE_URL}/companies/${companyId}/status`, { isActive }, { headers })
    console.log("toggleCompanyStatus response", res.data)
    revalidatePath("/admin/companies")
    revalidatePath(`/admin/companies/${companyId}`)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("toggleCompanyStatus error", error)
    return { success: false, error: error.response?.data?.message || "toggleCompanyStatus failed" }
  }
}

// Companies: Approve Company (PUT /companies/{companyId}/approve) - if you implement this later
export async function approveCompany(companyId, approved, reason) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.put(`${BASE_URL}/companies/${companyId}/approve`, { approved, reason }, { headers })
    console.log("approveCompany response", res.data)
    revalidatePath("/admin/companies")
    revalidatePath(`/admin/companies/${companyId}`)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("approveCompany error", error)
    return { success: false, error: error.response?.data?.message || "approveCompany failed" }
  }
}

// Companies: Suspend Company (PUT /companies/{companyId}/suspend) - if you implement this later
export async function suspendCompany(companyId, reason) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.put(`${BASE_URL}/companies/${companyId}/suspend`, { reason }, { headers })
    console.log("suspendCompany response", res.data)
    revalidatePath("/admin/companies")
    revalidatePath(`/admin/companies/${companyId}`)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("suspendCompany error", error)
    return { success: false, error: error.response?.data?.message || "suspendCompany failed" }
  }
}

// Companies: Reactivate Company (PUT /companies/{companyId}/reactivate) - if you implement this later
export async function reactivateCompany(companyId) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.put(`${BASE_URL}/companies/${companyId}/reactivate`, {}, { headers })
    console.log("reactivateCompany response", res.data)
    revalidatePath("/admin/companies")
    revalidatePath(`/admin/companies/${companyId}`)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("reactivateCompany error", error)
    return { success: false, error: error.response?.data?.message || "reactivateCompany failed" }
  }
}

// Companies: Get Companies by Status (GET /companies?status={status})
export async function getCompaniesByStatus(status, params = {}) {
  try {
    const headers = await getAuthHeaders()
    const queryParams = { ...params, status }
    const res = await axios.get(`${BASE_URL}/companies`, { params: queryParams, headers })
    console.log("getCompaniesByStatus response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getCompaniesByStatus error", error)
    return { success: false, error: error.response?.data?.message || "getCompaniesByStatus failed" }
  }
}

// Companies: Get Companies by Plan (GET /companies?plan={plan})
export async function getCompaniesByPlan(plan, params = {}) {
  try {
    const headers = await getAuthHeaders()
    const queryParams = { ...params, plan }
    const res = await axios.get(`${BASE_URL}/companies`, { params: queryParams, headers })
    console.log("getCompaniesByPlan response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getCompaniesByPlan error", error)
    return { success: false, error: error.response?.data?.message || "getCompaniesByPlan failed" }
  }
}

// Companies: Search Companies (GET /companies?search={searchTerm})
export async function searchCompanies(searchTerm, params = {}) {
  try {
    const headers = await getAuthHeaders()
    const queryParams = { ...params, search: searchTerm }
    const res = await axios.get(`${BASE_URL}/companies`, { params: queryParams, headers })
    console.log("searchCompanies response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("searchCompanies error", error)
    return { success: false, error: error.response?.data?.message || "searchCompanies failed" }
  }
}

// Companies: Get Company Analytics (GET /companies/{companyId}/analytics) - if you implement this
export async function getCompanyAnalytics(companyId, params = {}) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/companies/${companyId}/analytics`, { params, headers })
    console.log("getCompanyAnalytics response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getCompanyAnalytics error", error)
    return { success: false, error: error.response?.data?.message || "getCompanyAnalytics failed" }
  }
}

// Companies: Update Company (PUT /companies/{companyId}) - if you implement this
export async function updateCompany(companyId, payload) {
  try {
    const headers = await getAuthHeaders()
    const body = normalizeCompanyPayload(payload)
    const res = await axios.put(`${BASE_URL}/companies/${companyId}`, body, { headers })
    console.log("updateCompany response", res.data)
    revalidatePath("/admin/companies")
    revalidatePath(`/admin/companies/${companyId}`)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("updateCompany error", error)
    return { success: false, error: error.response?.data?.message || "updateCompany failed" }
  }
}

// Companies: Delete Company (DELETE /companies/{companyId}) - if you implement this
export async function deleteCompany(companyId) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.delete(`${BASE_URL}/companies/${companyId}`, { headers })
    console.log("deleteCompany response", res.data)
    revalidatePath("/admin/companies")
    return { success: true, data: res.data }
  } catch (error) {
    console.error("deleteCompany error", error)
    return { success: false, error: error.response?.data?.message || "deleteCompany failed" }
  }
}
