"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { auth } from "../auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

// Resolve Bearer token from next-auth session or cookies
async function getAuthHeaders() {
    const jar = cookies();
    const session = await auth().catch(() => null);
    const token =
        session?.accessToken ||
        jar.get("accessToken")?.value ||
        jar.get("token")?.value;
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Normalize subscription payload (example with some numeric coercion)
function normalizeSubscriptionPayload(payload = {}) {
    const toNum = (v) => (v === undefined || v === null || v === "" ? v : Number(v));
    return {
        ...payload,
        pricing: {
            basePrice: toNum(payload.pricing?.basePrice),
            perStorePrice: toNum(payload.pricing?.perStorePrice),
            setupFee: toNum(payload.pricing?.setupFee),
        },
        limits: {
            maxStores: toNum(payload.limits?.maxStores),
            maxUsers: toNum(payload.limits?.maxUsers),
        },
        features: payload.features || {},
        addOns: Array.isArray(payload.addOns) ? payload.addOns : [],
        // add other fields as needed
    };
}

// Create subscription (POST /subscriptions)
export async function createSubscription(payload) {
    try {
        const headers = await getAuthHeaders();
        const body = normalizeSubscriptionPayload(payload);
        const res = await axios.post(`${BASE_URL}/subscriptions`, body, { headers });
        revalidatePath("/admin/subscriptions");
        return { success: true, data: res.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || "createSubscription failed",
        };
    }
}

// Get all subscriptions (GET /subscriptions)
export async function getSubscriptions(params) {
    try {
        const headers = await getAuthHeaders();
        const res = await axios.get(`${BASE_URL}/subscriptions`, { params, headers });
        return { success: true, data: res.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || "getSubscriptions failed",
        };
    }
}

// Get subscription by ID (GET /subscriptions/:id)
export async function getSubscriptionById(id) {
    try {
        const headers = await getAuthHeaders();
        const res = await axios.get(`${BASE_URL}/subscriptions/${id}`, { headers });
        return { success: true, data: res.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || "getSubscriptionById failed",
        };
    }
}

// Update subscription (PUT /subscriptions/:id)
export async function updateSubscription(id, payload) {
    try {
        const headers = await getAuthHeaders();
        const body = normalizeSubscriptionPayload(payload);
        const res = await axios.put(`${BASE_URL}/subscriptions/${id}`, body, { headers });
        revalidatePath("/admin/subscriptions");
        revalidatePath(`/admin/subscriptions/${id}`);
        return { success: true, data: res.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || "updateSubscription failed",
        };
    }
}

// Delete subscription (DELETE /subscriptions/:id)
export async function deleteSubscription(id) {
    try {
        const headers = await getAuthHeaders();
        const res = await axios.delete(`${BASE_URL}/subscriptions/${id}`, { headers });
        revalidatePath("/admin/subscriptions");
        return { success: true, data: res.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || "deleteSubscription failed",
        };
    }
}

// Calculate subscription price (POST /subscriptions/calculate-price)
export async function calculateSubscriptionPrice(payload) {
    try {
        const headers = await getAuthHeaders();
        const res = await axios.post(`${BASE_URL}/subscriptions/calculate-price`, payload, { headers });
        return { success: true, data: res.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || "calculateSubscriptionPrice failed",
        };
    }
}

// Seed default subscriptions (POST /subscriptions/seed)
export async function seedSubscriptions() {
    try {
        const headers = await getAuthHeaders();
        const res = await axios.post(`${BASE_URL}/subscriptions/seed`, {}, { headers });
        return { success: true, data: res.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || "seedSubscriptions failed",
        };
    }
}
