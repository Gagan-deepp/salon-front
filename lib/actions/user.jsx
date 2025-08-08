"use server"
import axios from "axios"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { auth } from "../auth"

const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:8080/api"

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
// Create User (POST /users)
export async function createUser(payload) {
    try {
        const res = await axios.post(`${BASE_URL}/users`, payload, {
            headers: { ...getAuthHeaders() },
        })
        console.log("createUser response", res.data)
        revalidatePath("/admin/users")
        return { success: true, data: res.data }
    } catch (error) {
        console.error("createUser error", error)
        return { success: false, error: error.response?.data?.message || "createUser failed" }
    }
}

// Get Users (GET /users?page=&limit=&role=&isActive=)
export async function getUsers(params) {
    try {
        const headers = await getAuthHeaders()
        console.debug("i am in get user action...")
        const res = await axios.get(`${BASE_URL}/users`, { params, headers })
        console.log("getUsers response", res.data)
        return { success: true, data: res.data }
    } catch (error) {
        console.error("getUsers error", error)
        return { success: false, error: error.response?.data?.message || "getUsers failed" }
    }
}

// Get User by ID (GET /users/{userId})
export async function getUserById(userId) {
    try {
        const res = await axios.get(`${BASE_URL}/users/${userId}`, {
            headers: { ...getAuthHeaders() },
        })
        console.log("getUserById response", res.data)
        return { success: true, data: res.data }
    } catch (error) {
        console.error("getUserById error", error)
        return { success: false, error: error.response?.data?.message || "getUserById failed" }
    }
}

// Update User (PUT /users/{userId})
export async function updateUser(userId, payload) {
    try {
        const res = await axios.put(`${BASE_URL}/users/${userId}`, payload, {
            headers: { ...getAuthHeaders() },
        })
        console.log("updateUser response", res.data)
        revalidatePath("/admin/users")
        revalidatePath(`/admin/users/${userId}`)
        return { success: true, data: res.data }
    } catch (error) {
        console.error("updateUser error", error)
        return { success: false, error: error.response?.data?.message || "updateUser failed" }
    }
}

// Delete User (DELETE /users/{userId})
export async function deleteUser(userId) {
    try {
        const res = await axios.delete(`${BASE_URL}/users/${userId}`, {
            headers: { ...getAuthHeaders() },
        })
        console.log("deleteUser response", res.data)
        revalidatePath("/admin/users")
        return { success: true, data: res.data }
    } catch (error) {
        console.error("deleteUser error", error)
        return { success: false, error: error.response?.data?.message || "deleteUser failed" }
    }
}

// Stats Overview (GET /users/stats/overview)
export async function getUserStatsOverview() {
    try {
        const res = await axios.get(`${BASE_URL}/users/stats/overview`, {
            headers: { ...getAuthHeaders() },
        })
        console.log("getUserStatsOverview response", res.data)
        return { success: true, data: res.data }
    } catch (error) {
        console.error("getUserStatsOverview error", error)
        return { success: false, error: error.response?.data?.message || "getUserStatsOverview failed" }
    }
}
