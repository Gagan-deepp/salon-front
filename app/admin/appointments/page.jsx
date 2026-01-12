"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Calendar, Clock, User, Phone, Search, Filter, Eye, CheckCircle, XCircle, AlertCircle, Plus } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { BookAppointmentDialog } from "@/components/admin/appointment/book-appointment-dialog"

export default function AppointmentsPage() {
  const router = useRouter()
  const { data: session } = useSession()

  const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080/api"    
  
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    if (session?.user) {
      fetchAppointments()
    }
  }, [session, pagination.page, statusFilter, dateFilter])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit
      })

      console.log(session.user)
      // Add franchise filter if not super admin
      if (session?.user?.role !== 'SUPER_ADMIN' && session?.user?.role !== 'SAAS_OWNER') {
        params.append('franchiseId', session.user.franchiseId)
      }

      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      if (dateFilter) {
        params.append('date', dateFilter)
      }

        const token =
    session?.accessToken ||
    jar.get("accessToken")?.value ||
    jar.get("token")?.value
      

      const response = await fetch(
        `${BASE_URL}/appointments/getAllappointments?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      const result = await response.json()

      if (result.success) {
        setAppointments(result.data || [])
        if (result.pagination) {
          setPagination(result.pagination)
        }
      } else {
        toast.error("Failed to load appointments")
      }
    } catch (error) {
      console.error("Error fetching appointments:", error)
      toast.error("Failed to load appointments")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const config = {
      PENDING: { color: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: AlertCircle, label: "Pending" },
      CONFIRMED: { color: "bg-blue-100 text-blue-800 border-blue-300", icon: CheckCircle, label: "Confirmed" },
      COMPLETED: { color: "bg-green-100 text-green-800 border-green-300", icon: CheckCircle, label: "Completed" },
      CANCELLED: { color: "bg-red-100 text-red-800 border-red-300", icon: XCircle, label: "Cancelled" },
      NO_SHOW: { color: "bg-gray-100 text-gray-800 border-gray-300", icon: XCircle, label: "No Show" }
    }

    const { color, icon: Icon, label } = config[status] || config.PENDING

    return (
      <Badge className={`${color} border flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    )
  }

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = 
      apt.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.customerPhone?.includes(searchTerm) ||
      apt.appointmentCode?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
          <p className="text-muted-foreground">Manage customer appointments</p>
        </div>
        <div className="flex items-center space-x-2">
          <BookAppointmentDialog onAppointmentBooked={fetchAppointments}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
          </BookAppointmentDialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, phone, or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="NO_SHOW">No Show</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Total Card */}
        <Card className="relative border-primary/50 group hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 border rounded-3xl bg-card/50 backdrop-blur-sm hover:border-primary/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-primary mb-2">Total Appointments</p>
                <p className="text-3xl font-bold text-foreground">{pagination.total}</p>
              </div>
              <div className="p-4 rounded-2xl bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Cards */}
        {[
          { status: 'PENDING', color: 'secondary', icon: AlertCircle, label: 'Pending' },
          { status: 'CONFIRMED', color: 'primary', icon: CheckCircle, label: 'Confirmed' },
          { status: 'COMPLETED', color: 'accent', icon: CheckCircle, label: 'Completed' },
          { status: 'CANCELLED', color: 'muted', icon: XCircle, label: 'Cancelled' }
        ].map(({ status, color, icon: Icon, label }) => {
          const count = appointments.filter(a => a.status === status).length
          const colorClasses = {
            secondary: {
              border: 'border-secondary/50',
              text: 'text-secondary',
              bg: 'bg-secondary/10',
              iconColor: 'text-secondary',
              gradient: 'from-secondary/5',
              shadow: 'hover:shadow-secondary/10'
            },
            primary: {
              border: 'border-primary/50',
              text: 'text-primary',
              bg: 'bg-primary/10',
              iconColor: 'text-primary',
              gradient: 'from-primary/5',
              shadow: 'hover:shadow-primary/10'
            },
            accent: {
              border: 'border-accent/50',
              text: 'text-accent',
              bg: 'bg-accent/10',
              iconColor: 'text-accent',
              gradient: 'from-accent/5',
              shadow: 'hover:shadow-accent/10'
            },
            muted: {
              border: 'border-muted-foreground/50',
              text: 'text-muted-foreground',
              bg: 'bg-muted/30',
              iconColor: 'text-muted-foreground',
              gradient: 'from-muted/5',
              shadow: 'hover:shadow-muted/10'
            }
          }

          const classes = colorClasses[color]

          return (
            <Card key={status} className={`relative group hover:shadow-xl ${classes.shadow} transition-all duration-500 border ${classes.border} rounded-3xl bg-card/50 backdrop-blur-sm hover:border-${color} overflow-hidden hover:scale-105`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${classes.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-bold ${classes.text} mb-2`}>{label}</p>
                    <p className="text-3xl font-bold text-foreground">{count}</p>
                  </div>
                  <div className={`p-4 rounded-2xl ${classes.bg} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${classes.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>Appointments List ({filteredAppointments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No appointments found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/admin/appointments/${appointment._id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      {/* Header */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-bold text-lg text-gray-900">
                          {appointment.customerName}
                        </h3>
                        {getStatusBadge(appointment.status)}
                        <Badge variant="outline" className="text-xs">
                          {appointment.appointmentCode}
                        </Badge>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          {appointment.customerPhone}
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(appointment.appointmentDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          {appointment.appointmentTime}
                        </div>
                      </div>

                      {/* Service & Franchise */}
                      <div className="flex items-center gap-4 flex-wrap text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Service:</span>
                          <span className="font-medium text-gray-900">
                            {appointment.serviceId?.name || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Franchise:</span>
                          <span className="font-medium text-gray-900">
                            {appointment.franchiseId?.name || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-4"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/admin/appointments/${appointment._id}`)
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
