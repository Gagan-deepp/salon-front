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
      PENDING: { color: "bg-secondary/10 text-secondary border-secondary/20", icon: AlertCircle },
      CONFIRMED: { color: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle },
      COMPLETED: { color: "bg-accent/10 text-accent border-accent/20", icon: CheckCircle },
      CANCELLED: { color: "bg-muted/30 text-muted-foreground border-muted-foreground/20", icon: XCircle },
      NO_SHOW: { color: "bg-muted/30 text-muted-foreground border-muted-foreground/20", icon: XCircle }
    }

    const { color, icon: Icon } = config[status] || config.PENDING

    return (
      <Badge className={`${color} border flex items-center gap-2 px-3 py-1 rounded-xl font-medium backdrop-blur-sm`}>
        <Icon className="w-4 h-4" />
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      const BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "http://localhost:8080/api"

      const response = await fetch(
        `${BASE_URL}/appointments/updateappointments/${appointment._id}/status`,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col items-start space-y-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="hover:bg-primary/5">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Appointment Details</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <span>Code:</span>
              <Badge variant="outline" className="font-mono">{appointment.appointmentCode}</Badge>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {getStatusBadge(appointment.status)}
          {!editing && (
            <Button onClick={() => setEditing(true)} className="hover:scale-105 transition-transform">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Customer Information */}
      <Card className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl hover:shadow-lg hover:shadow-primary/5 transition-all duration-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="p-2 rounded-xl bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground font-medium">Name</Label>
            <p className="font-bold text-lg text-foreground">{appointment.customerName}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground font-medium">Phone</Label>
            <p className="font-bold text-lg text-foreground">{appointment.customerPhone}</p>
          </div>
          {appointment.customerEmail && (
            <div className="md:col-span-2 space-y-2">
              <Label className="text-sm text-muted-foreground font-medium">Email</Label>
              <p className="font-bold text-lg text-foreground">{appointment.customerEmail}</p>
            </div>
          )}
        </CardContent>

      </Card>

      {/* Appointment Details */}
      <Card className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl hover:shadow-lg hover:shadow-primary/5 transition-all duration-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="p-2 rounded-xl bg-secondary/10">
              <Calendar className="w-5 h-5 text-secondary" />
            </div>
            Appointment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground font-medium">Date</Label>
              <p className="font-bold text-lg text-foreground">
                {new Date(appointment.appointmentDate).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground font-medium">Time</Label>
              <p className="font-bold text-2xl text-primary">{appointment.appointmentTime}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground font-medium">Duration</Label>
              <p className="font-bold text-lg text-foreground">{appointment.duration} minutes</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground font-medium">Created On</Label>
              <p className="font-bold text-lg text-foreground">
                {new Date(appointment.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service & Franchise */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl hover:shadow-lg hover:shadow-accent/5 transition-all duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <div className="p-2 rounded-xl bg-accent/10">
                <Scissors className="w-5 h-5 text-accent" />
              </div>
              Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="font-medium text-base text-foreground">
                {appointment.serviceId?.name || 'N/A'}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{appointment.serviceId?.duration || 0} mins</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="font-bold text-lg text-accent">
                  ₹{appointment.serviceId?.price || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl hover:shadow-lg hover:shadow-secondary/5 transition-all duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <div className="p-2 rounded-xl bg-secondary/10">
                <MapPin className="w-5 h-5 text-secondary" />
              </div>
              Franchise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="font-medium text-base text-foreground">
                {appointment.franchiseId?.name || 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {appointment.franchiseId?.location || 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status & Notes */}
      <Card className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl hover:shadow-lg hover:shadow-primary/5 transition-all duration-500">
        <CardHeader>
          <CardTitle className="text-foreground">Status & Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {editing ? (
            <>
              <div className="space-y-3">
                <Label htmlFor="status" className="text-sm font-medium text-muted-foreground">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="rounded-2xl border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="NO_SHOW">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="notes" className="text-sm font-medium text-muted-foreground">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="rounded-2xl border-border/50 resize-none"
                  placeholder="Add any notes about this appointment..."
                />
              </div>

              {formData.status === 'CANCELLED' && (
                <div className="space-y-3">
                  <Label htmlFor="cancellationReason" className="text-sm font-medium text-muted-foreground">Cancellation Reason</Label>
                  <Textarea
                    id="cancellationReason"
                    value={formData.cancellationReason}
                    onChange={(e) => setFormData({ ...formData, cancellationReason: e.target.value })}
                    rows={2}
                    className="rounded-2xl border-border/50 resize-none"
                    placeholder="Why was this appointment cancelled?"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} disabled={saving} className="hover:scale-105 transition-transform">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={handleCancel} className="border-border/50">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              {appointment.notes && (
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground font-medium">Notes</Label>
                    <div className="p-4 bg-muted/20 rounded-2xl border border-border/30">
                      <p className="text-foreground whitespace-pre-wrap">{appointment.notes}</p>
                    </div>
                </div>
              )}
              {appointment.cancellationReason && (
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground font-medium">Cancellation Reason</Label>
                    <div className="p-4 bg-muted/20 rounded-2xl border border-border/30">
                      <p className="text-foreground whitespace-pre-wrap">{appointment.cancellationReason}</p>
                    </div>
                </div>
              )}
              {!appointment.notes && !appointment.cancellationReason && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm">No additional notes available for this appointment</p>
                  </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
