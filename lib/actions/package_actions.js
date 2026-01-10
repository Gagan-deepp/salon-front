"use server"

import axios from "axios"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { auth } from "../auth"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"
// https://2dj4ta4it2.us-east-1.awsapprunner.com/api

// ───────────────────────────────────────────────────────────────────────────────
// Resolve Bearer token (next-auth session → cookie fallback)
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
// Get Packages  (GET /packages?page=&limit=&search=&... if you pass params)
export async function getPackages(params) {
  try {
    const headers = await getAuthHeaders()
    const response = await axios.get(`${API_BASE}/packages/packages`, {
      params,
      headers,
    })
    return { success: true, data: response.data.data }
  } catch (error) {
    console.error("getPackages error", error)
    return {
      success: false,
      error: error.response?.data?.message || "getPackages failed",
    }
  }


}


export async function purchasePackage(purchaseData) {
  try {
    const headers = await getAuthHeaders()
    console.log("purchasePackage payload:", purchaseData)

    const response = await fetch(
      `${API_BASE}/packages/customer-packages/purchase`, // Adjust endpoint as needed
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseData),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to purchase package",
      }
    }

    console.log("purchasePackage success:", data)

    // Revalidate relevant paths
    revalidatePath("/admin/packages")
    revalidatePath("/admin/customers/[id]/packages") // Customer packages page

    return {
      success: true,
      data: data,
    }
  } catch (error) {
    console.error("Purchase package error:", error)
    return {
      success: false,
      error: error.message || "Failed to purchase package",
    }
  }
}

export async function redeemPackage(payload) {
  try {
    const headers = await getAuthHeaders()
    console.log("payload=============", payload)

    const response = await fetch(
      `${API_BASE}/packages/customer-packages/redeem`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",  // ← Add this
        },
        body: JSON.stringify(payload),  // ← Stringify the payload
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to redeem package",
      }
    }

    return {
      success: true,
      data: data,
    }
  } catch (error) {
    console.error("Redeem package error:", error)
    return {
      success: false,
      error: error.message || "Failed to redeem package",
    }
  }
}




export async function getCustomerPackages(customerId) {
  try {
    const headers = await getAuthHeaders()

    const response = await fetch(
      `${API_BASE}/customer-packages/${customerId}`,
      {
        headers
      }
    )

    // console.log("response =========",response)

    const data = await response.json()

    console.log("data from respone", data)

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to fetch customer packages",
      }
    }

    return {
      success: true,
      data: data,
    }
  } catch (error) {
    console.error("Get customer packages error:", error)
    return {
      success: false,
      error: error.message || "Failed to fetch customer packages",
    }
  }
}

// Get Package by ID  (GET /packages/{id})
export async function getPackageById(id) {
  try {
    const headers = await getAuthHeaders()
    const response = await axios.get(`${API_BASE}/packages/${id}`, {
      headers,
    })
    console.log("getPackageById response", response.data)
    return { success: true, data: response.data.data }
  } catch (error) {
    console.error("getPackageById error", error)
    return {
      success: false,
      error: error.response?.data?.message || "getPackageById failed",
    }
  }
}

// Create Package  (POST /packages)
export async function createPackage(data) {
  console.log("createPackage data", data)
  try {
    const headers = await getAuthHeaders()
    const response = await axios.post(`${API_BASE}/packages`, data, {
      headers,
    })
    console.log("createPackage response", response.data)

    // Revalidate packages list (and optionally detail) page(s)
    revalidatePath("/admin/packages")
    // If your detail route uses /admin/packages/[id], you can also:
    // revalidatePath(`/admin/packages/${response.data.id}`)

    return { success: true, data: response.data }
  } catch (error) {
    console.error("createPackage error", error.response?.data)
    return {
      success: false,
      error: error.response?.data?.message || "createPackage failed",
    }
  }
}

// Delete Package  (DELETE /packages/{id})
export async function deletePackage(id) {
  try {
    const headers = await getAuthHeaders()
    const response = await axios.delete(`${API_BASE}/packages/${id}`, {
      headers,
    })
    console.log("deletePackage response", response.data)

    // Revalidate list after deletion
    revalidatePath("/admin/packages")

    return { success: true, data: response.data }
  } catch (error) {
    console.error("deletePackage error", error)
    return {
      success: false,
      error: error.response?.data?.message || "deletePackage failed",
    }
  }
}
