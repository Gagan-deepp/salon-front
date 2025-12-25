"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, Clock, User, Phone, Mail, MapPin, Scissors, Edit, Save, X, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export function AppointmentDetails({ appointment: initialAppointment }) {
  const router = useRouter()
  const [appointment, setAppointment] = useState(initialAppointment)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    status: appointment.status,
    notes: appointment.notes || "",
    cancellationReason: appointment.cancellationReason || ""
  })

  const getStatusBadge = (status) => {
    const config = {
      PENDING: { color: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: AlertCircle },
      CONFIRMED: { color: "bg-blue-100 text-blue-800 border-blue-300", icon: CheckCircle },
      COMPLETED: { color: "bg-green-100 text-green-800 border-green-300", icon: CheckCircle },
      CANCELLED: { color: "bg-red-100 text-red-800 border-red-300", icon: XCircle },
      NO_SHOW: { color: "bg-gray-100 text-gray-800 border-gray-300", icon: XCircle }
    }

    const { color, icon: Icon } = config[status] || config.PENDING

    return (
      <Badge className={`${color} border flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      const response = await fetch(
        `http://localhost:8080/api/appointments/updateappointments/${appointment._id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(formData)
        }
      )

      const result = await response.json()

      if (result.success) {
        setAppointment(result.data)
        setEditing(false)
        toast.success("Appointment updated successfully")
      } else {
        toast.error(result.message || "Failed to update appointment")
      }
    } catch (error) {
      console.error("Error updating appointment:", error)
      toast.error("Failed to update appointment")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      status: appointment.status,
      notes: appointment.notes || "",
      cancellationReason: appointment.cancellationReason || ""
    })
    setEditing(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointment Details</h1>
            <p className="text-gray-600 mt-1">Code: {appointment.appointmentCode}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(appointment.status)}
          {!editing && (
            <Button onClick={() => setEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-gray-500">Name</Label>
            <p className="font-semibold text-gray-900">{appointment.customerName}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-500">Phone</Label>
            <p className="font-semibold text-gray-900">{appointment.customerPhone}</p>
          </div>
          {appointment.customerEmail && (
            <div className="md:col-span-2">
              <Label className="text-sm text-gray-500">Email</Label>
              <p className="font-semibold text-gray-900">{appointment.customerEmail}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Appointment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-500">Date</Label>
              <p className="font-semibold text-gray-900">
                {new Date(appointment.appointmentDate).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">Time</Label>
              <p className="font-semibold text-gray-900 text-xl">{appointment.appointmentTime}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">Duration</Label>
              <p className="font-semibold text-gray-900">{appointment.duration} minutes</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">Created On</Label>
              <p className="font-semibold text-gray-900">
                {new Date(appointment.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service & Franchise */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-primary" />
              Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-bold text-lg text-gray-900">
                {appointment.serviceId?.name || 'N/A'}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{appointment.serviceId?.duration || 0} mins</span>
                <span>•</span>
                <span className="font-semibold text-emerald-600">
                  ₹{appointment.serviceId?.price || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Franchise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-bold text-lg text-gray-900">
                {appointment.franchiseId?.name || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                {appointment.franchiseId?.location || 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status & Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Status & Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {editing ? (
            <>
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="NO_SHOW">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              {formData.status === 'CANCELLED' && (
                <div>
                  <Label htmlFor="cancellationReason">Cancellation Reason</Label>
                  <Textarea
                    id="cancellationReason"
                    value={formData.cancellationReason}
                    onChange={(e) => setFormData({ ...formData, cancellationReason: e.target.value })}
                    rows={2}
                  />
                </div>
              )}

              <div className="flex gap-3">
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              {appointment.notes && (
                <div>
                  <Label className="text-sm text-gray-500">Notes</Label>
                  <p className="text-gray-900 whitespace-pre-wrap">{appointment.notes}</p>
                </div>
              )}
              {appointment.cancellationReason && (
                <div>
                  <Label className="text-sm text-gray-500">Cancellation Reason</Label>
                  <p className="text-gray-900 whitespace-pre-wrap">{appointment.cancellationReason}</p>
                </div>
              )}
              {!appointment.notes && !appointment.cancellationReason && (
                <p className="text-gray-500 text-sm">No notes available</p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
