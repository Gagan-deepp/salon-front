"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { getCustomersDropdown } from "@/lib/actions/customer_action"
import { Separator } from "@/components/ui/separator"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"

export function BookAppointmentDialog({ children, onAppointmentBooked }) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [franchises, setFranchises] = useState([])
    const [services, setServices] = useState([])
    const [customers, setCustomers] = useState([])
    const [loadingFranchises, setLoadingFranchises] = useState(false)
    const [loadingServices, setLoadingServices] = useState(false)
    const [selectedFranchise, setSelectedFranchise] = useState("")
    const [selectedCustomer, setSelectedCustomer] = useState({ name: "", phone: "", email: "" })
    const router = useRouter()
    const { data: session } = useSession()

    useEffect(() => {
        if (open) {
            fetchFranchises()
            // Auto-select franchise for non-super-admin users
            if (session?.user?.role !== "SUPER_ADMIN" && session?.franchiseId) {
                setSelectedFranchise(session.franchiseId)
            }
        }
    }, [open, session])

    useEffect(() => {
        if (selectedFranchise) {
            fetchServices(selectedFranchise)
        } else {
            setServices([])
        }
    }, [selectedFranchise])

    const fetchFranchises = async () => {
        try {
            setLoadingFranchises(true)
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
            const response = await fetch(
                `${BASE_URL}/services/getAllServices?franchiseId=${franchiseId}&isActive=true&limit=100`
            )
            const result = await response.json()

            const customersRes = await getCustomersDropdown({ limit: 100 })
            if (customersRes.success) setCustomers(customersRes.data.data || [])
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

    const getMinDate = () => {
        const today = new Date()
        return today.toISOString().split("T")[0]
    }

    const handleSubmit = async (formData) => {
        startTransition(async () => {
            const payload = {
                franchiseId: formData.get("franchiseId"),
                serviceId: formData.get("serviceId"),
                customerName: selectedCustomer.name ? selectedCustomer.name : formData.get("customerName"),
                customerPhone: selectedCustomer.phone ? selectedCustomer.phone : formData.get("customerPhone"),
                customerEmail: selectedCustomer.email ? selectedCustomer.email : formData.get("customerEmail"),
                appointmentDate: formData.get("appointmentDate"),
                appointmentTime: formData.get("appointmentTime"),
                notes: formData.get("notes"),
            }

            // Validation
            if (!payload.franchiseId) {
                toast.error("Please select a franchise")
                return
            }
            if (!payload.serviceId) {
                toast.error("Please select a service")
                return
            }

            console.log("Booking appointment payload ==> ", payload)

            try {
                const response = await fetch(`${BASE_URL}/appointments/appointments/book`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                })

                const result = await response.json()

                if (result.success) {
                    toast.success(result.message || "Appointment booked successfully")
                    toast.info(`Appointment Code: ${result.data.appointmentCode}`)
                    setOpen(false)
                    router.refresh()
                    onAppointmentBooked?.()
                } else {
                    toast.error(result.message || "Failed to book appointment")
                }
            } catch (error) {
                console.error("Error booking appointment:", error)
                toast.error("Failed to book appointment. Please try again.")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto overflow-x-hidden">
                <DialogHeader>
                    <DialogTitle>Book New Appointment</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4">
                    {/* Franchise and Service Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="franchiseId">Salon / Franchise *</Label>
                            {session?.user?.role !== "SUPER_ADMIN" && (
                                <Input type="hidden" name="franchiseId" value={session?.franchiseId || ""} />
                            )}
                            {loadingFranchises ? (
                                <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                    <span className="text-sm text-muted-foreground">Loading salons...</span>
                                </div>
                            ) : (
                                <Select
                                    name={session?.user?.role === "SUPER_ADMIN" ? "franchiseId" : undefined}
                                    value={selectedFranchise}
                                    onValueChange={setSelectedFranchise}
                                    required
                                    disabled={session?.user?.role !== "SUPER_ADMIN"}
                                    className="w-full"
                                >
                                    <SelectTrigger className="w-full" >
                                        <SelectValue placeholder="Select salon" className="w-full" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {franchises.length === 0 ? (
                                            <div className="p-4 text-center text-sm text-muted-foreground">
                                                No salons available
                                            </div>
                                        ) : (
                                            franchises.map((franchise) => (
                                                <SelectItem key={franchise._id} value={franchise._id}>
                                                    {franchise.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="serviceId">Service *</Label>
                            {loadingServices ? (
                                <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                    <span className="text-sm text-muted-foreground">Loading services...</span>
                                </div>
                            ) : (
                                <Select
                                    name="serviceId"
                                    disabled={!selectedFranchise || services.length === 0}
                                    required
                                    className="w-full"
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue
                                            placeholder={
                                                !selectedFranchise
                                                    ? "Select salon first"
                                                    : services.length === 0
                                                        ? "No services available"
                                                        : "Select service"
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {services.map((service) => (
                                            <SelectItem key={service._id} value={service._id}>
                                                {service.name} - ₹{service.price} ({service.duration} mins)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="customerEmail">Select an Existing Customer</Label>

                        <Select
                            name="customerName"
                            value={selectedCustomer.name ? customers.find((c) => c.name === selectedCustomer.name)?._id : ""}
                            onValueChange={(value) => {
                                const customer = customers.find((c) => c._id === value)
                                if (customer) {
                                    setSelectedCustomer({
                                        name: customer.name,
                                        phone: customer.phone,
                                        email: customer.email || "",
                                    })
                                } else {
                                    setSelectedCustomer({ name: "", phone: "", email: "" })
                                }
                            }}
                            required>
                            <SelectTrigger className="h-11 w-full">
                                <SelectValue placeholder="Select customer" />
                            </SelectTrigger>
                            <SelectContent>
                                {customers.map((customer) => (
                                    <SelectItem key={customer._id} value={customer._id}>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{customer.name}</span>
                                            <span className="text-sm "> - {customer.phone}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-center" >
                        <Separator />
                        <div className="px-4" > OR </div>
                        <Separator />

                    </div>

                    {/* Customer Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="customerName">Full Name *</Label>
                            <Input
                                id="customerName"
                                name="customerName"
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="customerPhone">Phone Number *</Label>
                            <Input
                                id="customerPhone"
                                name="customerPhone"
                                placeholder="9876543210"
                                pattern="[0-9]{10}"
                                maxLength="10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="customerEmail">Email Address</Label>
                        <Input
                            id="customerEmail"
                            name="customerEmail"
                            type="email"
                            placeholder="john.doe@example.com"
                        />
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="appointmentDate">Appointment Date *</Label>
                            <Input
                                id="appointmentDate"
                                name="appointmentDate"
                                type="date"
                                min={getMinDate()}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="appointmentTime">Appointment Time *</Label>
                            <Input
                                id="appointmentTime"
                                name="appointmentTime"
                                type="time"
                                required
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Special Requests (Optional)</Label>
                        <Textarea
                            id="notes"
                            name="notes"
                            placeholder="Any special preferences or requirements..."
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Book Appointment
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
