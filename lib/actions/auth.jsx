"use server"
import axios from "axios"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { signIn } from "../auth"
import { AuthError } from "next-auth"

const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:8080/api"

function getAuthHeaders() {
    const jar = cookies()
    const token =
        jar.get("accessToken")?.value ||
        jar.get("token")?.value
    return token ? { Authorization: `Bearer ${token}` } : {}
}

// ───────────────────────────────────────────────────────────────────────────────

export const signinAction = async ({ email, password }) => {
    try {
        await signIn("credentials", { email, password, redirectTo: "/admin" })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {
                        message: "Invalid Credentials"
                    }
                default:
                    return {
                        message: "Something went wrong!!"
                    }
            }
        }

        throw error;
    }
}

// Login (POST /auth/login) — sets token client-side; here we just return data.
export async function login({ email, password }) {
    try {
        console.debug(`Email in login action : ${email} and password : ${password}`)
        const res = await axios.post(`${BASE_URL}/auth/login`, { email, password })
        console.log("login response", res.data)
        revalidatePath("/")
        return { success: true, data: res.data }
    } catch (error) {
        console.error("login error", error)
        return { success: false, error: error.response?.data?.message || "login failed" }
    }
}

// Verify Email (GET /auth/verify-email/:token)
export async function verifyEmail(token) {
    try {
        const res = await axios.get(`${BASE_URL}/auth/verify-email/${token}`)
        console.log("verifyEmail response", res.data)
        return { success: true, data: res.data }
    } catch (error) {
        console.error("verifyEmail error", error)
        return { success: false, error: error.response?.data?.message || "verifyEmail failed" }
    }
}

// Resend Verification (POST /auth/resend-verification)
export async function resendVerification({ email }) {
    try {
        const res = await axios.post(`${BASE_URL}/auth/resend-verification`, { email })
        console.log("resendVerification response", res.data)
        return { success: true, data: res.data }
    } catch (error) {
        console.error("resendVerification error", error)
        return { success: false, error: error.response?.data?.message || "resendVerification failed" }
    }
}

// Forgot Password (POST /auth/forgot-password)
export async function forgotPassword({ email }) {
    try {
        const res = await axios.post(`${BASE_URL}/auth/forgot-password`, { email })
        console.log("forgotPassword response", res.data)
        return { success: true, data: res.data }
    } catch (error) {
        console.error("forgotPassword error", error)
        return { success: false, error: error.response?.data?.message || "forgotPassword failed" }
    }
}

// Reset Password (POST /auth/reset-password/:token)
export async function resetPassword(token, { password }) {
    try {
        const res = await axios.post(`${BASE_URL}/auth/reset-password/${token}`, { password })
        console.log("resetPassword response", res.data)
        return { success: true, data: res.data }
    } catch (error) {
        console.error("resetPassword error", error)
        return { success: false, error: error.response?.data?.message || "resetPassword failed" }
    }
}

// Refresh Token (POST /auth/refresh-token)
export async function refreshToken() {
    try {
        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, null, {
            headers: { ...getAuthHeaders() },
        })
        console.log("refreshToken response", res.data)
        return { success: true, data: res.data }
    } catch (error) {
        console.error("refreshToken error", error)
        return { success: false, error: error.response?.data?.message || "refreshToken failed" }
    }
}

// Logout (POST /auth/logout)
export async function logout() {
    try {
        const res = await axios.post(`${BASE_URL}/auth/logout`, null, {
            headers: { ...getAuthHeaders() },
        })
        console.log("logout response", res.data)
        // Revalidate app shell or dashboard
        revalidatePath("/")
        return { success: true, data: res.data }
    } catch (error) {
        console.error("logout error", error)
        return { success: false, error: error.response?.data?.message || "logout failed" }
    }
}
