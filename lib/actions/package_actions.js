import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/packages'

export async function getPackages(params) {
  const response = await axios.get(`${API_BASE}/packages`, { 
    params,
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  return response.data
}

export async function getPackageById(id) {
  const response = await axios.get(`${API_BASE}/packages/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  return response.data
}

export async function createPackage(data) {
  const response = await axios.post(`${API_BASE}/packages`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  return response.data
}

export async function deletePackage(id) {
  const response = await axios.delete(`${API_BASE}/packages/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  return response.data
}
