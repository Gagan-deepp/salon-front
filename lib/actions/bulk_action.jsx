"use server"
import axios from "axios"
import { revalidatePath } from "next/cache"
import { getAuthHeaders } from "./customer_action"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"


// ───────────────────────────────────────────────────────────────
export async function bulkcreateCustomer(formData) {
    try {
        const headers = await getAuthHeaders()

        console.debug("Bulk createCustomer file upload")
        const res = await axios.post(`${BASE_URL}/bulkimport/bulk-import/customer`, formData, {
            headers: {
                ...headers,
                "Content-Type": "multipart/form-data",
            },
        })
        console.log("bulkcreateCustomer response", res.data)
        revalidatePath("/admin/customers")
        revalidatePath("/admin/create/payments")
        return { success: true, data: res.data }
    } catch (error) {
        console.error("bulkcreateCustomer error", error.response?.data)
        return {
            success: false,
            error: error.response?.data?.message || "bulkcreateCustomer failed",
            errors: error.response?.data?.errors || [],
        }
    }
}