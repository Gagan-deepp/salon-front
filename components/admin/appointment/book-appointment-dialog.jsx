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
import { Separator } from "@/components/ui/separator"
import { ServiceCombobox } from "@/components/admin/service/service-combobox"
import { CustomerCombobox } from "@/components/admin/customer/customer-combobox"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"

export function BookAppointmentDialog({ children, onAppointmentBooked }) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [franchises, setFranchises] = useState([])
    const [loadingFranchises, setLoadingFranchises] = useState(false)
    const [selectedFranchise, setSelectedFranchise] = useState("")
    const [selectedServiceId, setSelectedServiceId] = useState("")
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
        if (!selectedFranchise) {
            setSelectedServiceId("")
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

    const getMinDate = () => {
        const today = new Date()
        return today.toISOString().split("T")[0]
    }

    const handleSubmit = async (formData) => {
        startTransition(async () => {
            const payload = {
                franchiseId: selectedFranchise || formData.get("franchiseId"),
                serviceId: selectedServiceId || formData.get("serviceId"),
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
                            <ServiceCombobox
                                value={selectedServiceId}
                                franchiseId={selectedFranchise}
                                onValueChange={setSelectedServiceId}
                                disabled={!selectedFranchise}
                            />
                            <input type="hidden" name="serviceId" value={selectedServiceId} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="customerEmail">Select an Existing Customer</Label>

                        <CustomerCombobox
                            value={selectedCustomer.id}
                            onValueChange={(id, customer) => {
                                if (customer) {
                                    setSelectedCustomer({
                                        id: customer._id || customer.id,
                                        name: customer.name,
                                        phone: customer.phone,
                                        email: customer.email || "",
                                    })
                                } else {
                                    setSelectedCustomer({ name: "", phone: "", email: "" })
                                }
                            }}
                        />
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
