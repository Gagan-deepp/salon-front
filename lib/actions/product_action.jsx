"use server"
import axios from "axios"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { auth } from "../auth"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080/api" // adjust per env

// Resolve Bearer token from next-auth session (preferred) or cookies (fallback)
async function getAuthHeaders() {
  const jar = cookies()
  const session = await auth().catch(() => null)
  const token =
    session?.accessToken ||
    jar.get("accessToken")?.value ||
    jar.get("token")?.value

  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ───────────────────────────────────────────────────────────────────────────────


// Products: Create  (POST /products)
export async function createProduct(payload) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.post(`${BASE_URL}/products`, payload, { headers })
    console.log("createProduct response", res.data)
    revalidatePath("/admin/products")
    return { success: true, data: res.data }
  } catch (error) {
    console.error("createProduct error", error)
    return { success: false, error: error.response?.data?.message || "createProduct failed" }
  }
}

// Products: List / Filter  (GET /products?page=&limit=&category=&search=&lowStock=)
export async function getProducts(params) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/products`, { params, headers })
    console.log("getProducts response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getProducts error", error)
    return { success: false, error: error.response?.data?.message || "getProducts failed" }
  }
}

// Products: Get Categories  (GET /products/categories)
export async function getProductCategories() {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/products/categories`, { headers })
    console.log("getProductCategories response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getProductCategories error", error)
    return { success: false, error: error.response?.data?.message || "getProductCategories failed" }
  }
}

// Products: Low Stock  (GET /products/low-stock)
export async function getLowStockProducts() {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/products/low-stock`, { headers })
    console.log("getLowStockProducts response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getLowStockProducts error", error)
    return { success: false, error: error.response?.data?.message || "getLowStockProducts failed" }
  }
}

// Products: Top Selling  (GET /products/top-selling?startDate=&endDate=&limit=)
export async function getTopSellingProducts(params) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/products/top-selling`, { params, headers })
    console.log("getTopSellingProducts response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getTopSellingProducts error", error)
    return { success: false, error: error.response?.data?.message || "getTopSellingProducts failed" }
  }
}

// Products: Get by ID  (GET /products/{productId})
export async function getProductById(productId) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.get(`${BASE_URL}/products/${productId}`, { headers })
    console.log("getProductById response", res.data)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("getProductById error", error)
    return { success: false, error: error.response?.data?.message || "getProductById failed" }
  }
}

// Products: Update  (PUT /products/{productId})
export async function updateProduct(productId, payload) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.put(`${BASE_URL}/products/${productId}`, payload, { headers })
    console.log("updateProduct response", res.data)
    revalidatePath("/admin/products")
    revalidatePath(`/admin/products/${productId}`)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("updateProduct error", error)
    return { success: false, error: error.response?.data?.message || "updateProduct failed" }
  }
}

// Products: Update Stock  (PUT /products/{productId}/stock)
export async function updateProductStock(productId, payload) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.put(`${BASE_URL}/products/${productId}/stock`, payload, { headers })
    console.log("updateProductStock response", res.data)
    revalidatePath("/admin/products")
    revalidatePath(`/admin/products/${productId}`)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("updateProductStock error", error)
    return { success: false, error: error.response?.data?.message || "updateProductStock failed" }
  }
}

// Products: Delete (deactivate)  (DELETE /products/{productId})
export async function deleteProduct(productId) {
  try {
    const headers = await getAuthHeaders()
    const res = await axios.delete(`${BASE_URL}/products/${productId}`, { headers })
    console.log("deleteProduct response", res.data)
    revalidatePath("/admin/products")
    return { success: true, data: res.data }
  } catch (error) {
    console.error("deleteProduct error", error)
    return { success: false, error: error.response?.data?.message || "deleteProduct failed" }
  }
}
