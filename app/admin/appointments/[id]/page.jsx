"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppointmentDetails } from "@/components/admin/appointment/appointment-details"
import { AppointmentDetailsSkeleton } from "@/components/admin/appointment/appointment-details-skeleton"
import { toast } from "sonner"

export default function AppointmentPage() {
  const params = useParams()
  const router = useRouter()
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointment()
  }, [params.id])

  const fetchAppointment = async () => {
    try {
      setLoading(true)
      const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080/api"    
      
      console.log("🔍 Loading appointment:", params.id)
      
      // ✅ Now localStorage works (client-side)
      const token = localStorage.getItem('token')
      
      if (!token) {
        toast.error("Authentication required")
        router.push('/login')
        return
      }
      
      console.log("localstorage", token)

      console.log("params.id",params.id)

      const response = await fetch(
        `${BASE_URL}/appointments/getAppointment/${params.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      console.log("📡 Response status:", response.status)

      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Appointment not found")
        } else if (response.status === 403) {
          toast.error("Access denied")
        } else {
          toast.error("Failed to load appointment")
        }
        router.push('/admin/appointments')
        return
      }

      const result = await response.json()

      if (!result.success || !result.data) {
        toast.error("Appointment not found")
        router.push('/admin/appointments')
        return
      }

      console.log("✅ Appointment loaded:", result.data.appointmentCode)
      setAppointment(result.data)
    } catch (error) {
      console.error("❌ Error fetching appointment:", error)
      toast.error("Failed to load appointment")
      router.push('/admin/appointments')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <AppointmentDetailsSkeleton />
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Not Found</h2>
          <p className="text-gray-600 mb-4">The appointment you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <AppointmentDetails appointment={appointment} onUpdate={setAppointment} />
    </div>
  )
}
