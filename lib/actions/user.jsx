"use server"
import axios from "axios"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { auth } from "../auth" // adjust if needed

const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:8080/api"

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
// Create User  (POST /users)
export async function createUser(payload) {
    try {
        const headers = await getAuthHeaders()
        const res = await axios.post(`${BASE_URL}/users`, payload, { headers })
        console.log("createUser response", res.data)
        revalidatePath("/admin/users")
        return { success: true, data: res.data }
    } catch (error) {
        console.error("createUser error", error)
        return { success: false, error: error.response?.data?.message || "createUser failed" }
    }
}

// Get Users (filters/pagination)  (GET /users?page=&limit=&role=&isActive=&search=&franchiseId=)
export async function getUsers(params) {
    try {
        const headers = await getAuthHeaders()
        const res = await axios.get(`${BASE_URL}/users`, { params, headers })
        console.log("getUsers response", res.data)
        return { success: true, data: res.data }
    } catch (error) {
        console.error("getUsers error", error)
        return { success: false, error: error.response?.data?.message || "getUsers failed" }
    }
}

// Get User by ID  (GET /users/{userId})
export async function getUserById(userId) {
    try {
        const headers = await getAuthHeaders()
        const res = await axios.get(`${BASE_URL}/users/${userId}`, { headers })
        console.log("getUserById response", res.data)
        return { success: true, data: res.data }
    } catch (error) {
        console.error("getUserById error", error)
        return { success: false, error: error.response?.data?.message || "getUserById failed" }
    }
}

// Update User  (PUT /users/{userId})
export async function updateUser(userId, payload) {
    try {
        const headers = await getAuthHeaders()
        const res = await axios.put(`${BASE_URL}/users/${userId}`, payload, { headers })
        console.log("updateUser response", res.data)
        revalidatePath("/admin/users")
        revalidatePath(`/admin/users/${userId}`)
        return { success: true, data: res.data }
    } catch (error) {
        console.error("updateUser error", error)
        return { success: false, error: error.response?.data?.message || "updateUser failed" }
    }
}

// Delete User  (DELETE /users/{userId})
export async function deleteUser(userId) {
    try {
        const headers = await getAuthHeaders()
        const res = await axios.delete(`${BASE_URL}/users/${userId}`, { headers })
        console.log("deleteUser response", res.data)
        revalidatePath("/admin/users")
        return { success: true, data: res.data }
    } catch (error) {
        console.error("deleteUser error", error)
        return { success: false, error: error.response?.data?.message || "deleteUser failed" }
    }
}

// Users Overview Stats  (GET /users/stats/overview?franchiseId=)
export async function getUserStatsOverview(params) {
    try {
        const headers = await getAuthHeaders()
        const res = await axios.get(`${BASE_URL}/users/stats/overview`, { params, headers })
        console.log("getUserStatsOverview response", res.data)
        return { success: true, data: res.data }
    } catch (error) {
        console.error("getUserStatsOverview error", error)
        return { success: false, error: error.response?.data?.message || "getUserStatsOverview failed" }
    }
}

// Performance (keep)  (GET /users/employees/{id}/performance?startDate=&endDate=)
export async function getUserPerformance(userId, params) {
    try {
        const headers = await getAuthHeaders()
        const res = await axios.get(`${BASE_URL}/users/employees/${userId}/performance`, {
            params,
            headers,
        })
        console.log("getUserPerformance response", res.data)
        return { success: true, data: res.data }
    } catch (error) {
        console.error("getUserPerformance error", error)
        return { success: false, error: error.response?.data?.message || "getUserPerformance failed" }
    }
}

// Referrals (keep)  (GET /users/employees/{id}/referrals?page=&limit=)
export async function getUserReferrals(userId, params) {
    try {
        const headers = await getAuthHeaders()
        const res = await axios.get(`${BASE_URL}/users/employees/${userId}/referrals`, {
            params,
            headers,
        })
        console.log("getUserReferrals response", res.data)
        return { success: true, data: res.data }
    } catch (error) {
        console.error("getUserReferrals error", error)
        return { success: false, error: error.response?.data?.message || "getUserReferrals failed" }
    }
}
