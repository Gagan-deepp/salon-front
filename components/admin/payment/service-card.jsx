"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Minus, Plus } from "lucide-react"

export function ServiceCard({ services, setFormData, formData }) {

  const getServiceQuantity = (serviceId) => {
    const service = formData.services.find((s) => s.serviceId === serviceId)
    return service ? service.quantity : 0
  }

  const addServiceFromCard = (service) => {
    const existingServiceIndex = formData.services.findIndex((s) => s.serviceId === service._id)

    if (existingServiceIndex >= 0) {
      // If service already exists, increase quantity
      updateService(existingServiceIndex, "quantity", formData.services[existingServiceIndex].quantity + 1)
    } else {
      // Add new service
      setFormData((prev) => ({
        ...prev,
        services: [
          ...prev.services,
          {
            serviceId: service._id,
            serviceName: service.name,
            price: service.price,
            gstRate: 18,
            providerId: "",
            providerName: "",
            duration: service.duration,
            quantity: 1,
          },
        ],
      }))
    }
  }

  const updateService = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service, i) => (i === index ? { ...service, [field]: value } : service)),
    }))
  }

  const decreaseServiceQuantity = (serviceId) => {
    const serviceIndex = formData.services.findIndex((s) => s.serviceId === serviceId)
    if (serviceIndex >= 0) {
      const currentQuantity = formData.services[serviceIndex].quantity
      if (currentQuantity > 1) {
        updateService(serviceIndex, "quantity", currentQuantity - 1)
      } else {
        removeService(serviceIndex)
      }
    }
  }

  const removeService = (index) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => {
        const quantity = getServiceQuantity(service._id)
        return (
          <Card
            key={service._id}
            className={`cursor-pointer transition-all hover:shadow-md ${quantity > 0 ? "ring-2 ring-border bg-blue-50" : "hover:bg-blue-50"
              }`}
            onClick={() => addServiceFromCard(service)}
          >
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{service.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {service.category}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-green-600">₹{service.price}</span>
                  <span className="text-xs text-gray-500">{service.duration} min</span>
                </div>
                {quantity > 0 && (
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        decreaseServiceQuantity(service._id)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-medium">{quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        addServiceFromCard(service)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
