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

// ───────────────────────────────────────────────────────────────
export async function bulkcreatePayment(formData) {
    try {
        const headers = await getAuthHeaders()

        console.debug("Bulk createPayment file upload")
        const res = await axios.post(`${BASE_URL}/bulkimportpayment/bulk-import`, formData, {
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


// ───────────────────────────────────────────────────────────────
export async function bulkcreateProduct(formData) {
    try {
        const headers = await getAuthHeaders()

        console.debug("Bulk createProduct file upload")
        const res = await axios.post(`${BASE_URL}/bulkimportproduct/bulk-import`, formData, {
            headers: {
                ...headers,
                "Content-Type": "multipart/form-data",
            },
        })
        console.log("bulkcreateProduct response", res.data)
        revalidatePath("/admin/customers")
        revalidatePath("/admin/create/payments")
        return { success: true, data: res.data }
    } catch (error) {
        console.error("bulkcreateProduct error", error.response?.data)
        return {
            success: false,
            error: error.response?.data?.message || "Bulk create product failed",
            errors: error.response?.data?.errors || [],
        }
    }
}


// ───────────────────────────────────────────────────────────────
export async function bulkcreateService(formData) {
    try {
        const headers = await getAuthHeaders()

        console.debug("Bulk createService file upload")
        const res = await axios.post(`${BASE_URL}/bulkimportservice/bulk-import`, formData, {
            headers: {
                ...headers,
                "Content-Type": "multipart/form-data",
            },
        })
        console.log("bulkcreateService response", res.data)
        revalidatePath("/admin/customers")
        revalidatePath("/admin/create/payments")
        return { success: true, data: res.data }
    } catch (error) {
        console.error("bulkcreateService error", error.response?.data)
        return {
            success: false,
            error: error.response?.data?.message || "bulkcreateService failed",
            errors: error.response?.data?.errors || [],
        }
    }
}



// ───────────────────────────────────────────────────────────────
export async function GetbulkProductTemplate() {
    try {
        const headers = await getAuthHeaders()

        const res = await axios.get(`${BASE_URL}/bulkimportproduct/bulk-import/template`, {
            headers,
            responseType: "arraybuffer",
        })

        const base64 = Buffer.from(res.data).toString("base64")
        const contentType = res.headers["content-type"] || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        const filename = "product-template.xlsx"

        return { success: true, data: base64, contentType, filename }
    } catch (error) {
        console.error("GetbulkProductTemplate error", error.response?.data)
        return {
            success: false,
            error: error.response?.data?.message || "Failed to download template",
        }
    }
}
// ───────────────────────────────────────────────────────────────
export async function GetbulkServiceTemplate() {
    try {
        const headers = await getAuthHeaders()
        // http://localhost:8080/api//bulk-import/template
        const res = await axios.get(`${BASE_URL}/bulkimportservice/bulk-import/template`, {
            headers,
            responseType: "arraybuffer",
        })

        const base64 = Buffer.from(res.data).toString("base64")
        const contentType = res.headers["content-type"] || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        const filename = "service-template.xlsx"

        return { success: true, data: base64, contentType, filename }
    } catch (error) {
        console.error("GetbulkServiceTemplate error", error.response?.data)
        return {
            success: false,
            error: error.response?.data?.message || "Failed to download template",
        }
    }
}
// ───────────────────────────────────────────────────────────────
export async function GetbulkPaymentTemplate() {
    try {
        const headers = await getAuthHeaders()
        const res = await axios.get(`${BASE_URL}/bulkimportpayment/bulk-import/template`, {
            headers,
            responseType: "arraybuffer",
        })

        const base64 = Buffer.from(res.data).toString("base64")
        const contentType = res.headers["content-type"] || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        const filename = "payment-template.xlsx"

        return { success: true, data: base64, contentType, filename }
    } catch (error) {
        console.error("GetbulkPaymentTemplate error", error.response?.data)
        return {
            success: false,
            error: error.response?.data?.message || "Failed to download template",
        }
    }
}
// ───────────────────────────────────────────────────────────────
export async function GetbulkCustomeremplate() {
    try {
        const headers = await getAuthHeaders()
        const res = await axios.get(`${BASE_URL}/bulkimport/bulk-import/template`, {
            headers,
            responseType: "arraybuffer",
        })

        const base64 = Buffer.from(res.data).toString("base64")
        const contentType = res.headers["content-type"] || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        const filename = "customer-template.xlsx"

        return { success: true, data: base64, contentType, filename }
    } catch (error) {
        console.error("GetbulkCustomeremplate error", error.response?.data)
        return {
            success: false,
            error: error.response?.data?.message || "Failed to download template",
        }
    }
}