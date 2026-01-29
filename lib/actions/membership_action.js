"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { auth } from "../auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

async function getAuthHeaders() {
  const jar = cookies();
  const session = await auth().catch(() => null);
  const token =
    session?.accessToken ||
    jar.get("accessToken")?.value ||
    jar.get("token")?.value;

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function purchaseMembership(data) {
  try {
    const headers = await getAuthHeaders();
    console.log("purchaseMembership payload:", data);
    
    const response = await fetch(`${API_BASE}/membership/purchase`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });


    const result = await response.json();

    console.log("resposne after buy membership", JSON.stringify(result, null, 2));
    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to purchase membership",
      };
    }

    revalidatePath("/admin/customers");
    revalidatePath("/admin/memberships");

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Purchase membership error:", error);
    return {
      success: false,
      error: error.message || "Failed to purchase membership",
    };
  }
}

export async function getOffers(params) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_BASE}/offers`, {
      params,
      headers,
    });
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch offers",
    };
  }
}
