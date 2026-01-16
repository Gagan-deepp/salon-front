"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Calendar, Clock, Search, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { BookAppointmentDialog } from "@/components/admin/appointment/book-appointment-dialog"

export default function AppointmentsPage() {
  const router = useRouter()
  const { data: session } = useSession()

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"
  
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [calendarView, setCalendarView] = useState("week")
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date(2026, 0, 12))
  const [pagination, setPagination] = useState({ page: 1, limit: 200, total: 0, pages: 0 })

  const weekDays = useMemo(() => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStart)
      day.setDate(currentWeekStart.getDate() + i)
      days.push(day)
    }
    return days
  }, [currentWeekStart])

  // 🎯 FIXED: 30-MINUTE INTERVALS with CORRECT INDEXING
  const timeSlots = useMemo(() => {
    const slots = []
    // 9:00 to 18:00 = 10 slots × 2 = 20 total slots (0-19)
    for (let i = 0; i < 20; i++) {
      const hour = 9 + Math.floor(i / 2)
      const minute = (i % 2) * 30
      slots.push({ 
        hour, 
        minute,
        slotIndex: i,
        time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      })
    }
    return slots
  }, [])

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

      if (session?.user?.role !== 'SUPER_ADMIN' && session?.user?.role !== 'SAAS_OWNER') {
        params.append('franchiseId', session.user.franchiseId)
      }

      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      if (dateFilter) {
        params.append('date', dateFilter)
      }

      const token = session?.accessToken

      const response = await fetch(`${BASE_URL}/appointments/getAllappointments?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

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

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-400/25 border-yellow-400/50 ring-2 ring-yellow-400/40 shadow-lg',
      CONFIRMED: 'bg-blue-500/25 border-blue-500/50 ring-2 ring-blue-500/40 shadow-lg', 
      COMPLETED: 'bg-green-500/25 border-green-500/50 ring-2 ring-green-500/40 shadow-lg',
      CANCELLED: 'bg-red-500/25 border-red-500/50 ring-2 ring-red-500/40 shadow-lg',
      NO_SHOW: 'bg-gray-500/25 border-gray-500/50 ring-2 ring-gray-500/40 shadow-lg'
    }
    return colors[status] || colors.PENDING
  }

  const getStatusBadge = (status) => {
    const config = {
      PENDING: { color: "bg-yellow-100 text-yellow-800 border border-yellow-300", label: "Pending" },
      CONFIRMED: { color: "bg-blue-100 text-blue-800 border border-blue-300", label: "Confirmed" },
      COMPLETED: { color: "bg-green-100 text-green-800 border border-green-300", label: "Completed" },
      CANCELLED: { color: "bg-red-100 text-red-800 border border-red-300", label: "Cancelled" },
      NO_SHOW: { color: "bg-gray-100 text-gray-800 border border-gray-300", label: "No Show" }
    }
    const { color, label } = config[status] || config.PENDING
    return <Badge className={`${color} text-xs border`}>{label}</Badge>
  }

  const navigateWeek = useCallback((direction) => {
    const newWeekStart = new Date(currentWeekStart)
    newWeekStart.setDate(currentWeekStart.getDate() + (direction * 7))
    setCurrentWeekStart(newWeekStart)
  }, [currentWeekStart])

  // 🎯 PERFECT ALIGNMENT: Direct slotIndex mapping
  const getSlotAppointments = (dayAppointments) => {
    const slots = {}
    
    dayAppointments.forEach(appointment => {
      const [aptHourStr, aptMinuteStr] = appointment.appointmentTime.split(':')
      const aptHour = parseInt(aptHourStr)
      const aptMinute = parseInt(aptMinuteStr)
      
      // PERFECT MAPPING: 11:00 → slot 4, 16:20 → slot 14
      const slotIndex = ((aptHour - 9) * 2) + Math.floor(aptMinute / 30)
      // Clamp to valid range (0-19)
      const clampedIndex = Math.max(0, Math.min(19, slotIndex))
      
      if (!slots[clampedIndex]) {
        slots[clampedIndex] = []
      }
      slots[clampedIndex].push(appointment)
    })
    
    Object.keys(slots).forEach(slotIndex => {
      slots[slotIndex].sort((a, b) => a.customerName.localeCompare(b.customerName))
    })
    
    return slots
  }

  const AppointmentBox = ({ appointment, positionIndex, totalInSlot, onClick }) => {
    const statusColor = getStatusColor(appointment.status)
    
    const [aptHourStr, aptMinuteStr] = appointment.appointmentTime.split(':')
    const aptHour = parseInt(aptHourStr)
    const aptMinute = parseInt(aptMinuteStr)
    
    // EXACT SAME CALCULATION as getSlotAppointments
    const slotIndex = Math.max(0, Math.min(19, ((aptHour - 9) * 2) + Math.floor(aptMinute / 30)))
    
    const widthFraction = 1 / Math.max(1, totalInSlot)
    const leftOffset = positionIndex * widthFraction
    
    return (
      <div
        className={`
          absolute p-2.5 rounded-xl border-2 shadow-xl cursor-pointer hover:shadow-2xl hover:scale-[1.02] 
          transition-all duration-300 backdrop-blur-sm hover:-translate-y-1 z-40
          ${statusColor}
        `}
        style={{
          top: `${slotIndex * 32}px`, // 🎯 EXACT ALIGNMENT: slotIndex * 32px + NO HEADER OFFSET
          left: `${leftOffset * 92}%`,
          width: `${Math.min(92, 92 * widthFraction)}%`,
          height: '28px',
          minWidth: '140px'
        }}
        onClick={onClick}
        title={`${appointment.customerName} - ${appointment.appointmentTime}`}
      >
        <div className="h-full flex flex-col justify-center text-xs px-1">
          <div className="font-bold line-clamp-1 text-gray-900 text-[11px] mb-0.5">
            {appointment.customerName}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-700">
            <Clock className="w-2.5 h-2.5 flex-shrink-0" />
            <span className="truncate">{appointment.appointmentTime}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Appointments Calendar</h2>
          {/* <p className="text-muted-foreground mt-1">PERFECT 30-MINUTE alignment (11:00 → slot 4)</p> */}
        </div>
        <BookAppointmentDialog onAppointmentBooked={fetchAppointments}>
          <Button className="w-full lg:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Book Appointment
          </Button>
        </BookAppointmentDialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search by name, phone, code..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10" 
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="NO_SHOW">No Show</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
            <Select value={calendarView} onValueChange={setCalendarView}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week View</SelectItem>
                <SelectItem value="list">List View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Week Navigation */}
      {calendarView === 'week' && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => navigateWeek(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="font-semibold text-lg min-w-[220px] text-center">
                {weekDays[0].toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - 
                {weekDays[6].toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <Button variant="outline" size="sm" onClick={() => navigateWeek(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PERFECTLY ALIGNED CALENDAR */}
      <Card className="overflow-hidden shadow-2xl border-0">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">Appointments Calendar</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20 h-[680px]">
              <Loader2 className="w-8 h-8 animate-spin mr-3 text-primary" />
              <span className="text-lg">Loading appointments...</span>
            </div>
          ) : (
            <div className="relative">
              {calendarView === 'week' ? (
                <div className="relative h-[800px]">
                  
                  {/* Day Headers - SAME HEIGHT */}
                  <div className="grid grid-cols-[90px_repeat(7,1fr)] h-[72px] bg-gradient-to-b from-background/95 to-muted/20 border-b border-muted/40 z-50">
                    <div className="border-r bg-gradient-to-r from-muted/50 to-transparent flex items-center justify-center">
                      <div className="text-lg font-bold text-muted-foreground rotate-90">TIME</div>
                    </div>
                    
                    {weekDays.map((day, dayIndex) => (
                      <div key={dayIndex} className="group relative border-r border-muted/30 hover:bg-primary/5 transition-all p-3 flex flex-col justify-center shadow-md">
                        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-white/50 backdrop-blur-sm -z-10 rounded-t-lg" />
                        <div className="text-md font-black text-primary/90 z-10 ">
                          {day.toLocaleDateString('en-IN', { weekday: 'short' })}
                        </div>
                        <div className="text-md font-bold text-foreground z-10 drop-shadow-lg">
                          {day.getDate()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 30-MINUTE CONTENT GRID - STARTS AT Y=72px */}
                  <div className="grid grid-cols-[90px_repeat(7,1fr)] h-[608px] mt-0 relative bg-gradient-to-b from-background to-muted/10">
                    
                    {/* GRID LINES - PERFECTLY ALIGNED */}
                    <div className="col-span-8 absolute inset-0 z-0 pointer-events-none">
                      {timeSlots.map((slot, index) => (
                        <div
                          key={`h-line-${index}`}
                          className="absolute left-0 right-0 top-[72px] h-px bg-border/70"
                          style={{ top: `${72 + index * 32}px` }}
                        />
                      ))}
                      {[1,2,3,4,5,6,7].map(day => (
                        <div
                          key={`v-line-${day}`}
                          className="absolute top-0 bottom-0 w-px bg-border/80"
                          style={{ left: `${90 + (day-1) * (100/7)}%` }}
                        />
                      ))}
                    </div>

                    {/* Time Column - 30-MINUTE LABELS */}
                    <div className="relative z-20 border-r bg-gradient-to-b from-muted/40 to-transparent pt-[72px]">
                      {timeSlots.map(slot => (
                        <div 
                          key={slot.slotIndex}
                          className="h-8 border-b border-muted/30 flex items-center px-2 text-sm font-mono 
                                   bg-background/95 backdrop-blur-sm shadow-sm relative z-20"
                          style={{ lineHeight: '1.2' }}
                        >
                          {slot.time}
                        </div>
                      ))}
                    </div>

                    {/* Day Columns - APPOINTMENTS */}
                    {weekDays.map((day, dayIndex) => {
                      const dayAppointments = appointments.filter(apt => {
                        if (!apt.appointmentDate || !apt.appointmentTime) return false
                        const aptDate = new Date(apt.appointmentDate)
                        return day.toDateString() === aptDate.toDateString()
                      })
                      
                      const slotAppointments = getSlotAppointments(dayAppointments)

                      return (
                        <div key={dayIndex} className="relative group hover:bg-muted/20 transition-colors border-r border-muted/30 overflow-visible pt-[72px]">
                          <div className="h-[608px] relative px-2 z-40 overflow-visible">
                            {Object.entries(slotAppointments).map(([slotIndex, appointmentsInSlot]) => (
                              <div key={slotIndex} className="relative h-8 mb-0.5">
                                {appointmentsInSlot.map((appointment, positionIndex) => (
                                  <AppointmentBox
                                    key={appointment._id}
                                    appointment={appointment}
                                    positionIndex={positionIndex}
                                    totalInSlot={appointmentsInSlot.length}
                                    onClick={() => router.push(`/admin/appointments/${appointment._id}`)}
                                  />
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-8 space-y-4 max-h-[520px] overflow-auto">
                  {appointments.slice(0, 20).map(appointment => (
                    <div key={appointment._id} 
                         className="p-6 border rounded-2xl hover:shadow-xl cursor-pointer transition-all bg-gradient-to-r from-muted/50 hover:from-primary/5" 
                         onClick={() => router.push(`/admin/appointments/${appointment._id}`)}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{appointment.customerName}</h3>
                          <div className="text-sm text-muted-foreground space-y-1 mt-2">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{appointment.appointmentTime} • {appointment.serviceId?.name}</span>
                            </div>
                            <div>{new Date(appointment.appointmentDate).toLocaleDateString('en-IN')}</div>
                          </div>
                        </div>
                        <div>{getStatusBadge(appointment.status)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="pt-6 pb-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">Status Legend</h4>
          <div className="flex flex-wrap gap-8 text-sm">
            {[
              { status: 'CONFIRMED', color: 'bg-blue-500/25 border-blue-500/50', label: 'Confirmed' },
              { status: 'PENDING', color: 'bg-yellow-400/25 border-yellow-400/50', label: 'Pending' },
              { status: 'COMPLETED', color: 'bg-green-500/25 border-green-500/50', label: 'Completed' },
              { status: 'CANCELLED', color: 'bg-red-500/25 border-red-500/50', label: 'Cancelled' }
            ].map(({ status, color, label }) => (
              <div key={status} className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-lg border-2 shadow-md ${color}`}></div>
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
