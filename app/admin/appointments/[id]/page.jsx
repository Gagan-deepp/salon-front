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
      


      console.log("params.id",params.id)

      const response = await fetch(
        `${BASE_URL}/appointments/getAppointment/${params.id}`,

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
      <div className="space-y-6 p-8">
        <AppointmentDetailsSkeleton />
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4 max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl" />
              <div className="relative p-8 bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl">
                <h2 className="text-3xl font-bold text-foreground mb-3">Appointment Not Found</h2>
                <p className="text-muted-foreground text-lg mb-6">The appointment you're looking for doesn't exist or has been removed.</p>
                <button
                  onClick={() => router.push('/admin/appointments')}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-colors font-medium"
                >
                  Back to Appointments
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-8">
      <AppointmentDetails appointment={appointment} onUpdate={setAppointment} />
    </div>
  )
}
