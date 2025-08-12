"use server"
import axios from "axios"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { auth } from "../auth"            // adjust path if needed

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080/api"             // override per env

// ─── Resolve Bearer token ─────────────────────────────────────────────────────
async function getAuthHeaders() {
  const jar = cookies()
  const session = await auth().catch(() => null)
  const token =
    session?.accessToken ||
    jar.get("accessToken")?.value ||
    jar.get("token")?.value

  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ─── Customer APIs ────────────────────────────────────────────────────────────
// 1. Create Customer  (POST /customers)
export async function createCustomer(payload) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.post(`${BASE_URL}/customers`, payload, { headers })
    console.log("createCustomer response", res.data)
    revalidatePath("/admin/customers")
    revalidatePath("/admin/create/payments")
    return { success: true, data: res.data }
  } catch (error) {
    console.error("createCustomer error", error)
    return { success: false, error: error.response?.data?.message || "createCustomer failed" }
  }
}

// 10. Get All Customers list  (GET /customers?page=&limit=&search=&gender=&isActive=)
export async function getAllCustomers(params) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/customers/all`, { params, headers })
    console.log("getAllCustomers response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getAllCustomers error", error.response?.data)
    return { success: false, error: error.response?.data || "getAllCustomers failed" }
  }
}
// 2. Get Customers list  (GET /customers?page=&limit=&search=&gender=&isActive=)
export async function getCustomers(params) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/customers`, { params, headers })
    console.log("getCustomers response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getCustomers error", error)
    return { success: false, error: error.response?.data?.message || "getCustomers failed" }
  }
}

// 3. Dropdown list  (GET /customers/dropdown?search=&limit=)
export async function getCustomersDropdown(params) {
  console.debug("I am in drop down action")
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/customers/dropdown`, { params, headers })
    console.log("getCustomersDropdown response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getCustomersDropdown error", error)
    return { success: false, error: error.response?.data?.message || "getCustomersDropdown failed" }
  }
}

// 4. Search autocomplete  (GET /customers/search?q=&limit=)
export async function searchCustomers(params) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/customers/search`, { params, headers })
    console.log("searchCustomers response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("searchCustomers error", error)
    return { success: false, error: error.response?.data?.message || "searchCustomers failed" }
  }
}

// 5. Get Customer by ID  (GET /customers/{customerId})
export async function getCustomerById(customerId) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/customers/${customerId}`, { headers })
    console.log("getCustomerById response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getCustomerById error", error)
    return { success: false, error: error.response?.data?.message || "getCustomerById failed" }
  }
}

// 6. Update Customer  (PUT /customers/{customerId})
export async function updateCustomer(customerId, payload) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.put(`${BASE_URL}/customers/${customerId}`, payload, { headers })
    console.log("updateCustomer response", res.data)
    revalidatePath("/admin/customers")
    revalidatePath(`/admin/customers/${customerId}`)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("updateCustomer error", error)
    return { success: false, error: error.response?.data?.message || "updateCustomer failed" }
  }
}

// 7. Delete Customer  (DELETE /customers/{customerId})
export async function deleteCustomer(customerId) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.delete(`${BASE_URL}/customers/${customerId}`, { headers })
    console.log("deleteCustomer response", res.data)
    revalidatePath("/admin/customers")
    return { success: true, data: res.data }
  } catch (error) {
    console.error("deleteCustomer error", error)
    return { success: false, error: error.response?.data?.message || "deleteCustomer failed" }
  }
}

// 8. Payment & service history  (GET /customers/{customerId}/history?page=&limit=)
export async function getCustomerHistory(customerId, params) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/customers/${customerId}/history`, { params, headers })
    console.log("getCustomerHistory response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getCustomerHistory error", error)
    return { success: false, error: error.response?.data?.message || "getCustomerHistory failed" }
  }
}

// 9. Customer stats  (GET /customers/{customerId}/stats?startDate=&endDate=)
export async function getCustomerStats(customerId, params) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/customers/${customerId}/stats`, { params, headers })
    console.log("getCustomerStats response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getCustomerStats error", error)
    return { success: false, error: error.response?.data?.message || "getCustomerStats failed" }
  }
}
