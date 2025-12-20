"use server"
import axios from "axios"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { auth } from "../auth"        // adjust path if different

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080/api"

// -----------------------------------------------------------------------------
// Shared Bearer-token helper
async function getAuthHeaders() {
  const jar = cookies()
  const session = await auth().catch(() => null)
  const token =
    session?.accessToken ||
    jar.get("accessToken")?.value ||
    jar.get("token")?.value

  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ──────────────────────────────────────────────────────────────────────────────
// 1) Create Payment  – POST /payments
export async function createPayment(payload) {
  try {
    const headers = await getAuthHeaders()

    console.log("Payment paylod ==> ", payload)
    const res = await axios.post(`${BASE_URL}/payments`, payload, { headers })
    console.log("createPayment response", res.data)
    revalidatePath("/admin/payments")
    return res.data
  } catch (error) {
    console.error("createPayment error", error.response?.data?.message)
    return { success: false, error: error.response?.data?.message || "createPayment failed" }
  }
}

// 8) Get All payments
export async function getAllPayments(params) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/payments/all`, { params, headers })
    console.log("getAllPayments response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getAllPayments error", error)
    return { success: false, error: error.response?.data?.message || "getAllPayments failed" }
  }
}

// 2) Get Payment by ID  – GET /payments/{paymentId}
export async function getPaymentById(paymentId) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/payments/${paymentId}`, { headers })
    console.log("getPaymentById response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getPaymentById error", error)
    return { success: false, error: error.response?.data?.message || "getPaymentById failed" }
  }
}

// 3) Get Payments for a Customer  – GET /payments/customer/{customerId}
export async function getPaymentsByCustomer(customerId, params) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/payments/customer/${customerId}`, {
      params,  // { page, limit }
      headers,
    })
    console.log("getPaymentsByCustomer response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getPaymentsByCustomer error", error)
    return { success: false, error: error.response?.data?.message || "getPaymentsByCustomer failed" }
  }
}

// 4) Get All Franchise Payments  – GET /payments
export async function getFranchisePayments(params) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/payments`, { params, headers })
    console.log("getFranchisePayments response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getFranchisePayments error", error.response?.data)
    return { success: false, error: error.response?.data?.message || "getFranchisePayments failed" }
  }
}

export async function getCashierPayments(params, cashierId) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/payments/cashier/${cashierId}`, { params, headers })
    console.log("getCashierPayments response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getCashierPayments error", error.response?.data)
    return { success: false, error: error.response?.data?.message || "getCashierPayments failed" }
  }
}

// 5) Validate Promo Code  – POST /payments/validate-promo
export async function validatePromoCode(payload) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.post(`${BASE_URL}/payments/validate-promo`, payload, { headers })
    console.log("validatePromoCode response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("validatePromoCode error", error)
    return { success: false, error: error.response?.data?.message || "validatePromoCode failed" }
  }
}

// 6) Calculate Final Amount  – POST /payments/calculate-amount
export async function calculatePaymentAmount(payload) {
  try {
    const headers = await getAuthHeaders()

    console.debug("payload for calculation ==> ", payload)
    const res = await axios.post(`${BASE_URL}/payments/calculate-amount`, payload, { headers })
    console.log("calculatePaymentAmount response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("calculatePaymentAmount error", error.response?.data)
    return { success: false, error: error.response?.data?.message || "calculatePaymentAmount failed" }
  }
}

// 7) Payment Analytics Summary  – GET /payments/analytics/summary
export async function getPaymentAnalyticsSummary(params) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/payments/analytics/summary`, { params, headers })
    console.log("getPaymentAnalyticsSummary response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getPaymentAnalyticsSummary error", error)
    return { success: false, error: error.response?.data?.message || "getPaymentAnalyticsSummary failed" }
  }
}
