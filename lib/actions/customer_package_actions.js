import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export async function purchasePackage(data) {
  const response = await axios.post(`${API_BASE}/customer-packages/purchase`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  return response.data
}

export async function getCustomerPackages(customerId) {
  const response = await axios.get(`${API_BASE}/customer-packages/${customerId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  return response.data
}

export async function checkBalance(customerId, serviceId, quantity = 1) {
  const response = await axios.get(
    `${API_BASE}/customer-packages/${customerId}/balance?serviceId=${serviceId}&quantity=${quantity}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }
  )
  return response.data
}

export async function redeemFromPackage(data) {
  const response = await axios.post(`${API_BASE}/customer-packages/redeem`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  return response.data
}
