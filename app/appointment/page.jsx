"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Calendar, Clock, User, Phone, Mail, MapPin, Scissors, CheckCircle2, Loader2, Sparkles, ArrowRight } from "lucide-react"


const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080/api"   


export default function BookAppointmentPage() {
  const [franchises, setFranchises] = useState([])
  const [services, setServices] = useState([])
  const [loadingFranchises, setLoadingFranchises] = useState(true)
  const [loadingServices, setLoadingServices] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [appointmentCode, setAppointmentCode] = useState(null)
  const [appointmentDetails, setAppointmentDetails] = useState(null)

  const [formData, setFormData] = useState({
    franchiseId: "",
    serviceId: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: ""
  })

  // Fetch franchises on mount
  useEffect(() => {
    fetchFranchises()
  }, [])

  // Fetch services when franchise is selected
  useEffect(() => {
    if (formData.franchiseId) {
      fetchServices(formData.franchiseId)
    }
  }, [formData.franchiseId])

  const fetchFranchises = async () => {
    try {
      setLoadingFranchises(true)
      console.log("==================",BASE_URL)
      const response = await fetch(`${BASE_URL}/franchises/getAllFranchises`)
      const result = await response.json()
      
      if (result.success) {
        setFranchises(result.data || [])
      } else {
        toast.error("Failed to load franchises")
      }
    } catch (error) {
      console.error("Error fetching franchises:", error)
      toast.error("Failed to load franchises")
    } finally {
      setLoadingFranchises(false)
    }
  }

  const fetchServices = async (franchiseId) => {
    try {
      setLoadingServices(true)
      const response = await fetch(`${BASE_URL}/services/getAllServices?franchiseId=${franchiseId}&isActive=true&limit=100`)
      const result = await response.json()
      
      if (result.success) {
        setServices(result.data || [])
      } else {
        toast.error("Failed to load services")
      }
    } catch (error) {
      console.error("Error fetching services:", error)
      toast.error("Failed to load services")
    } finally {
      setLoadingServices(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.franchiseId) {
      toast.error("Please select a franchise")
      return
    }
    if (!formData.serviceId) {
      toast.error("Please select a service")
      return
    }

    setSubmitting(true)

    try {

      const response = await fetch(`${BASE_URL}/appointments/appointments/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setAppointmentCode(result.data.appointmentCode)
        setAppointmentDetails(result.data)
        toast.success(result.message)
      } else {
        toast.error(result.message || "Failed to book appointment")
      }
    } catch (error) {
      console.error("Error booking appointment:", error)
      toast.error("Failed to book appointment. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setAppointmentCode(null)
    setAppointmentDetails(null)
    setFormData({
      franchiseId: "",
      serviceId: "",
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      appointmentDate: "",
      appointmentTime: "",
      notes: ""
    })
    setServices([])
  }

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const selectedFranchise = franchises.find(f => f._id === formData.franchiseId)
  const selectedService = services.find(s => s._id === formData.serviceId)

  // Success screen after booking
  if (appointmentCode && appointmentDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-100 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-500">
        <Card className="w-full max-w-2xl shadow-2xl border-0 overflow-hidden animate-in slide-in-from-bottom-4 duration-700">
          <CardHeader className="text-center pb-4 sm:pb-6 bg-gradient-to-br from-emerald-50 to-blue-50 relative overflow-hidden p-4 sm:p-6">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/5 to-blue-500/5" />
            <div className="relative z-10">
              <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-lg animate-in zoom-in duration-500 delay-200">
                <CheckCircle2 className="w-10 h-10 sm:w-14 sm:h-14 text-white animate-pulse" />
              </div>
              <CardTitle className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2 sm:mb-3 animate-in slide-in-from-top duration-500 delay-300">
                Booking Confirmed!
              </CardTitle>
              <CardDescription className="text-base sm:text-lg text-gray-700 animate-in slide-in-from-top duration-500 delay-400 px-2">
                Your appointment has been successfully scheduled
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6 pt-4 sm:pt-8 pb-4 sm:pb-8 px-4 sm:px-6">
            {/* Appointment Code */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4 sm:p-8 text-white shadow-xl animate-in zoom-in duration-500 delay-500">
              <div className="absolute inset-0 bg-grid-white/10" />
              <div className="relative z-10 text-center">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 animate-pulse" />
                <p className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 uppercase tracking-wider opacity-90">Your Appointment Code</p>
                <p className="text-3xl sm:text-5xl font-black tracking-widest mb-2 sm:mb-3 drop-shadow-lg break-all">{appointmentCode}</p>
                <p className="text-xs opacity-80 bg-white/10 inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                  Save this code for future reference
                </p>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-3 sm:space-y-4 bg-gradient-to-br from-gray-50 to-blue-50/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200/50 shadow-sm animate-in slide-in-from-bottom duration-500 delay-700">
              <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-6 text-gray-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Appointment Details
              </h3>
              
              <div className="grid grid-cols-1 gap-3 sm:gap-5">
                {/* Franchise */}
                <div className="flex items-start gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Salon</p>
                    <p className="font-bold text-sm sm:text-base text-gray-900 truncate">{appointmentDetails.franchiseId?.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5 line-clamp-2">{appointmentDetails.franchiseId?.location}</p>
                  </div>
                </div>

                {/* Service */}
                <div className="flex items-start gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Service</p>
                    <p className="font-bold text-sm sm:text-base text-gray-900 truncate">{appointmentDetails.serviceId?.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                      {appointmentDetails.serviceId?.duration} mins • <span className="font-semibold text-emerald-600">₹{appointmentDetails.serviceId?.price}</span>
                    </p>
                  </div>
                </div>

                {/* Date & Time - Grid on larger screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                  <div className="flex items-start gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Date</p>
                      <p className="font-bold text-sm sm:text-base text-gray-900">
                        {new Date(appointmentDetails.appointmentDate).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Time</p>
                      <p className="font-bold text-lg sm:text-xl text-gray-900">{appointmentDetails.appointmentTime}</p>
                    </div>
                  </div>
                </div>

                {/* Customer */}
                <div className="flex items-start gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Customer</p>
                    <p className="font-bold text-sm sm:text-base text-gray-900 truncate">{appointmentDetails.customerName}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5">{appointmentDetails.customerPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 animate-in slide-in-from-bottom duration-500 delay-900">
              <Button 
                variant="outline" 
                className="flex-1 h-10 sm:h-12 border-2 hover:bg-gray-50 font-semibold group text-sm sm:text-base"
                onClick={handleReset}
              >
                Book Another
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                className="flex-1 h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg text-sm sm:text-base"
                onClick={() => window.print()}
              >
                Print Details
              </Button>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-lg p-3 sm:p-5 text-xs sm:text-sm animate-in slide-in-from-bottom duration-500 delay-1000">
              <p className="text-amber-900 font-bold mb-1.5 sm:mb-2 flex items-center gap-2">
                <span className="text-lg sm:text-xl">📞</span> Important Reminder
              </p>
              <p className="text-amber-800 leading-relaxed">
                You will receive a confirmation call/SMS from the salon shortly. Please arrive <strong>5-10 minutes before</strong> your scheduled time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Booking form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-6 sm:py-12 px-3 sm:px-4 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-8 animate-in fade-in slide-in-from-top duration-700 px-2">
          <div className="inline-block mb-3 sm:mb-4">
            {/* <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-purple-600 animate-pulse" /> */}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-br from-blue-800 to-gray-400 bg-clip-text text-transparent mb-2 sm:mb-3">
            Book Your Appointment
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg px-4">Choose your salon, service, and perfect time slot</p>
        </div>

        <Card className="shadow-2xl border-0 overflow-hidden animate-in zoom-in duration-700 delay-200">
          <CardHeader className="text-center space-y-2 sm:space-y-3 bg-gradient-to-br from-blue-800 to-gray-400 text-white p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="relative z-10">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold">Reserve Your Spot</CardTitle>
              <CardDescription className="text-blue-100 text-sm sm:text-base px-2">
                Experience premium beauty services at your convenience
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6 lg:pb-8 px-3 sm:px-4 lg:px-6">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 lg:space-y-8">
              {/* Franchise Selection */}
              <div className="space-y-2 sm:space-y-3 animate-in slide-in-from-left duration-500 delay-300">
                <Label htmlFor="franchise" className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-800">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                  <span className="break-words">Select Your Preferred Salon *</span>
                </Label>
                {loadingFranchises ? (
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl bg-gray-50">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-blue-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600 font-medium">Loading salons...</span>
                  </div>
                ) : (
                  <Select
                    value={formData.franchiseId}
                    onValueChange={(value) => {
                      setFormData({ ...formData, franchiseId: value, serviceId: "" })
                      setServices([])
                    }}
                    required
                  >
                    <SelectTrigger className="h-12 sm:h-14 text-sm sm:text-base border-2 hover:border-blue-400 transition-colors">
                      <SelectValue placeholder="Choose a salon near you" />
                    </SelectTrigger>
                    <SelectContent>
                      {franchises.length === 0 ? (
                        <div className="p-4 sm:p-6 text-center text-xs sm:text-sm text-gray-500">
                          No salons available at the moment
                        </div>
                      ) : (
                        franchises.map((franchise) => (
                          <SelectItem key={franchise._id} value={franchise._id} className="py-2 sm:py-3">
                            <div className="flex flex-col gap-0.5 sm:gap-1">
                              <span className="font-semibold text-gray-900 text-sm sm:text-base">{franchise.name}</span>
                              <span className="text-xs text-gray-500 line-clamp-1"> {franchise.location}</span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
                {selectedFranchise && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 animate-in slide-in-from-top duration-300">
                    <p className="font-bold text-blue-900 text-sm sm:text-base lg:text-lg truncate">{selectedFranchise.name}</p>
                    <p className="text-blue-700 text-xs sm:text-sm mt-1 line-clamp-2"> {selectedFranchise.location}</p>
                    {selectedFranchise.phone && (
                      <p className="text-blue-600 font-medium mt-1.5 sm:mt-2 text-xs sm:text-sm">📞 {selectedFranchise.phone}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Service Selection */}
              <div className="space-y-2 sm:space-y-3 animate-in slide-in-from-right duration-500 delay-400">
                <Label htmlFor="service" className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-800">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Scissors className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                  </div>
                  <span className="break-words">Choose Your Service *</span>
                </Label>
                {loadingServices ? (
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl bg-gray-50">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-purple-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600 font-medium">Loading services...</span>
                  </div>
                ) : (
                  <Select
                    value={formData.serviceId}
                    onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
                    disabled={!formData.franchiseId || services.length === 0}
                    required
                  >
                    <SelectTrigger className="h-12 sm:h-14 text-sm sm:text-base border-2 hover:border-purple-400 transition-colors disabled:opacity-50">
                      <SelectValue placeholder={
                        !formData.franchiseId 
                          ? "✨ Please select a salon first" 
                          : services.length === 0 
                          ? " No services available" 
                          : " Choose your desired service"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service._id} value={service._id} className="py-2 sm:py-3">
                          <div className="flex flex-col gap-0.5 sm:gap-1">
                            <span className="font-semibold text-gray-900 text-sm sm:text-base">{service.name}</span>
                            <span className="text-xs text-gray-500">
                               {service.duration} mins • <span className="font-semibold text-emerald-600">₹{service.price}</span>
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {selectedService && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg sm:rounded-xl p-3 sm:p-4 animate-in slide-in-from-top duration-300">
                    <p className="font-bold text-purple-900 text-sm sm:text-base lg:text-lg truncate">{selectedService.name}</p>
                    <div className="flex items-center gap-3 sm:gap-4 mt-1.5 sm:mt-2 text-xs sm:text-sm flex-wrap">
                      <span className="text-purple-700">⏱️ {selectedService.duration} minutes</span>
                      <span className="font-bold text-emerald-600 text-sm sm:text-base">₹{selectedService.price}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Details */}
              <div className="border-t-2 border-dashed pt-5 sm:pt-6 lg:pt-8 space-y-4 sm:space-y-5 animate-in slide-in-from-bottom duration-500 delay-500">
                <h3 className="font-bold text-lg sm:text-xl text-gray-800 flex items-center gap-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" />
                  <span className="break-words">Your Personal Details</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 font-medium text-xs sm:text-sm">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      required
                      className="h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-indigo-400"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2 font-medium text-xs sm:text-sm">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      placeholder="9876543210"
                      pattern="[0-9]{10}"
                      maxLength="10"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value.replace(/\D/g, '') })}
                      required
                      className="h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-indigo-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 font-medium text-xs sm:text-sm">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-indigo-400"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="border-t-2 border-dashed pt-5 sm:pt-6 lg:pt-8 space-y-4 sm:space-y-5 animate-in slide-in-from-bottom duration-500 delay-600">
                <h3 className="font-bold text-lg sm:text-xl text-gray-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
                  <span className="break-words">Select Date & Time</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="date" className="flex items-center gap-2 font-medium text-xs sm:text-sm">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                      Appointment Date *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      min={getMinDate()}
                      value={formData.appointmentDate}
                      onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                      required
                      className="h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="time" className="flex items-center gap-2 font-medium text-xs sm:text-sm">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                      Appointment Time *
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.appointmentTime}
                      onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                      required
                      className="h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5 sm:space-y-2 animate-in slide-in-from-bottom duration-500 delay-700">
                <Label htmlFor="notes" className="font-medium text-xs sm:text-sm">Special Requests (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special preferences or requirements..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="text-sm sm:text-base border-2 focus:border-purple-400 resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full  cursor-pointer h-12 sm:h-14 lg:h-16 text-base sm:text-lg font-bold bg-gradient-to-br from-blue-800 to-gray-400 hover:from-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 animate-in zoom-in duration-500 delay-800 group"
                disabled={submitting || loadingFranchises || loadingServices}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin mr-2 sm:mr-3" />
                    <span className="truncate">Booking Your Appointment...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="truncate">Confirm Appointment</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        
      </div>
    </div>
  )
}
