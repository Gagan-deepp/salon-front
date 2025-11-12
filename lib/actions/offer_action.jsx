"use server"
import axios from "axios"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { auth } from "../auth"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"

async function getAuthHeaders() {
  const jar = cookies()
  const session = await auth().catch(() => null)
  const token =
    session?.accessToken ||
    jar.get("accessToken")?.value ||
    jar.get("token")?.value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Get all offers
export async function getOffers(params = {}) {
  try {
    const headers = await getAuthHeaders()
    console.log("🌐 Getting offers with params:", params)
    
    const res = await axios.get(`${BASE_URL}/offers`, { params, headers })
    console.log("✅ Offers fetched successfully")
    return { success: true, data: res.data }
  } catch (error) {
    console.error("❌ getOffers error:", error)
    return { 
      success: false, 
      error: error.response?.data?.message || "Failed to fetch offers",
      data: { offers: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } }
    }
  }
}

// Get single offer
export async function getOffer(offerId) {
  try {
    const headers = await getAuthHeaders()
    console.log("🌐 Getting offer:", offerId)
    
    const res = await axios.get(`${BASE_URL}/offers/${offerId}`, { headers })
    console.log("✅ Offer fetched successfully")
    return { success: true, data: res.data }
  } catch (error) {
    console.error("❌ getOffer error:", error)
    return { 
      success: false, 
      error: error.response?.data?.message || "Failed to fetch offer"
    }
  }
}

// Create offer
export async function createOffer(offerData) {
  try {
    const headers = await getAuthHeaders()
    console.log("🌐 Creating offer:", offerData.offerCode)
    
    const res = await axios.post(`${BASE_URL}/offers`, offerData, { headers })
    console.log("✅ Offer created successfully")
    revalidatePath("/admin/offers")
    return { success: true, data: res.data }
  } catch (error) {
    console.error("❌ createOffer error:", error)
    return { 
      success: false, 
      error: error.response?.data?.message || "Failed to create offer"
    }
  }
}

// Update offer
export async function updateOffer(offerId, offerData) {
  try {
    const headers = await getAuthHeaders()
    console.log("🌐 Updating offer:", offerId)
    
    const res = await axios.put(`${BASE_URL}/offers/${offerId}`, offerData, { headers })
    console.log("✅ Offer updated successfully")
    revalidatePath("/admin/offers")
    revalidatePath(`/admin/offers/${offerId}`)
    return { success: true, data: res.data }
  } catch (error) {
    console.error("❌ updateOffer error:", error)
    return { 
      success: false, 
      error: error.response?.data?.message || "Failed to update offer"
    }
  }
}

// Delete offer
export async function deleteOffer(offerId) {
  try {
    const headers = await getAuthHeaders()
    console.log("🌐 Deleting offer:", offerId)
    
    const res = await axios.delete(`${BASE_URL}/offers/${offerId}`, { headers })
    console.log("✅ Offer deleted successfully")
    revalidatePath("/admin/offers")
    return { success: true, data: res.data }
  } catch (error) {
    console.error("❌ deleteOffer error:", error)
    return { 
      success: false, 
      error: error.response?.data?.message || "Failed to delete offer"
    }
  }
}

// Validate offer (used during payment)
export async function validateOffer(validationData) {
  try {
    const headers = await getAuthHeaders()
    console.log("🌐 Validating offer:", validationData.offerCode)
    
    const res = await axios.post(`${BASE_URL}/offers/validate`, validationData, { headers })
    console.log("✅ Offer validated successfully")
    return { success: true, data: res.data }
  } catch (error) {
    console.error("❌ validateOffer error:", error)
    return { 
      success: false, 
      error: error.response?.data?.message || "Failed to validate offer"
    }
  }
}

// Get offer statistics
export async function getOfferStatistics(offerId) {
  try {
    const headers = await getAuthHeaders()
    console.log("🌐 Getting offer statistics:", offerId)
    
    const res = await axios.get(`${BASE_URL}/offers/${offerId}/statistics`, { headers })
    console.log("✅ Statistics fetched successfully")
    return { success: true, data: res.data }
  } catch (error) {
    console.error("❌ getOfferStatistics error:", error)
    return { 
      success: false, 
      error: error.response?.data?.message || "Failed to fetch statistics"
    }
  }
}
