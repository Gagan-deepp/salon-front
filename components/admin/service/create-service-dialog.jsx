"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { createService } from "@/lib/actions/service_action"
import { getFranchises } from "@/lib/actions/franchise_action"
import { getProducts } from "@/lib/actions/product_action" // Use existing action
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { Plus, Trash2, Calculator, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProductCombobox } from "@/components/admin/payment/product-combobox"

const CATEGORIES = [
  { value: "Hair", label: "Hair" },
  { value: "Skin", label: "Skin" },
  { value: "Nails", label: "Nails" },
  { value: "Makeup", label: "Makeup" },
  { value: "Spa", label: "Spa" },
  { value: "Body_Care", label: "Body Care" },
  { value: "Others", label: "Others" },
]

const ROLES = [
  { value: "STYLIST", label: "Stylist" },
  { value: "THERAPIST", label: "Therapist" },
  { value: "MANAGER", label: "Manager" },
]

const UNITS = [
  { value: "ML", label: "ML" },
  { value: "Gram", label: "Gram" },
  { value: "Units", label: "Units" },
]

async function fetchFranchises() {
  const result = await getFranchises({ limit: 100 })
  return result.success ? result.data.data : []
}

export function CreateServiceDialog({ children }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState([])
  const [franchises, setFranchises] = useState([])
  const [inclusiveGST, setInclusiveGST] = useState(false)
  const [price, setPrice] = useState(0)
  
  // Consumables state
  const [consumables, setConsumables] = useState([])
  
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    const loadInitialData = async () => {
      // Load franchises
      const franchiseList = await fetchFranchises()
      setFranchises(franchiseList)
    }
    
    if (open) {
      loadInitialData()
    }
  }, [open])

  const handleRoleChange = (roleValue, checked) => {
    if (checked) {
      setSelectedRoles([...selectedRoles, roleValue])
    } else {
      setSelectedRoles(selectedRoles.filter((role) => role !== roleValue))
    }
  }

  // Add new consumable row
  const addConsumable = () => {
    setConsumables([...consumables, {
      productId: "",
      itemName: "",
      quantityUsed: 0,
      unit: "ML",
      totalProductCost: 0,
      totalProductQuantity: 0,
      costPerUnit: 0,
      costOfProductUsed: 0
    }])
  }

  // Remove consumable row
  const removeConsumable = (index) => {
    setConsumables(consumables.filter((_, i) => i !== index))
  }

  // Update consumable field
  const updateConsumable = (index, field, value, productObj = null) => {
    const updated = [...consumables]
    updated[index][field] = value

    // If product is selected from Combobox, auto-fill details from the object
    if (field === "productId") {
      if (value && productObj) {
        updated[index].itemName = productObj.name
        updated[index].totalProductCost = productObj.price?.cost || productObj.price?.selling || 0
        updated[index].unit = "ML" // Default
      } else if (!value) {
        // Clear details if selection is removed
        updated[index].itemName = ""
        updated[index].totalProductCost = 0
      }
    }

    // Auto-calculate costs
    const qty = parseFloat(updated[index].totalProductQuantity) || 0
    const cost = parseFloat(updated[index].totalProductCost) || 0
    const used = parseFloat(updated[index].quantityUsed) || 0

    if (qty > 0) {
      updated[index].costPerUnit = cost / qty
      updated[index].costOfProductUsed = (cost / qty) * used
    } else {
      updated[index].costPerUnit = 0
      updated[index].costOfProductUsed = 0
    }

    setConsumables(updated)
  }

  // Calculate totals
  const totalConsumableCost = consumables.reduce((sum, c) => sum + (parseFloat(c.costOfProductUsed) || 0), 0)
  const profitMargin = (parseFloat(price) || 0) - totalConsumableCost
  const profitMarginPercent = price > 0 ? (profitMargin / price) * 100 : 0

  const handleSubmit = async (formData) => {
    setLoading(true)

    // Validate consumables
    const hasInvalidConsumables = consumables.some(c => 
      !c.productId || c.quantityUsed <= 0 || c.totalProductQuantity <= 0
    )

    if (consumables.length > 0 && hasInvalidConsumables) {
      toast.error("Please fill all consumable fields correctly")
      setLoading(false)
      return
    }

    const payload = {
      name: formData.get("name"),
      category: formData.get("category"),
      type: formData.get("type"),
      description: formData.get("description"),
      duration: Number.parseInt(formData.get("duration")),
      price: Number.parseFloat(formData.get("price")),
      gstRate: Number.parseFloat(formData.get("gstRate")),
      inclusiveGST: inclusiveGST,
      franchiseId: formData.get("franchiseId"),
      allowedRoles: selectedRoles,
      commissionRate: Number.parseFloat(formData.get("commissionRate")),
      
      // Add consumables
      consumables: consumables.map(c => ({
        productId: c.productId,
        itemName: c.itemName,
        quantityUsed: parseFloat(c.quantityUsed),
        unit: c.unit,
        totalProductCost: parseFloat(c.totalProductCost),
        totalProductQuantity: parseFloat(c.totalProductQuantity)
      }))
    }

    const result = await createService(payload)

    if (result.success) {
      toast.success("Service created successfully")
      setOpen(false)
      setSelectedRoles([])
      setInclusiveGST(false)
      setConsumables([])
      setPrice(0)
      router.refresh()
    } else {
      toast.error(result.error || "Failed to create service")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Service</DialogTitle>
          <DialogDescription>Add a new service to your offerings with consumable tracking.</DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2">Basic Information</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name *</Label>
                <Input id="name" name="name" required placeholder="Enter service name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Service Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="non-technical">Non Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={2} placeholder="Enter service description" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="franchiseId">Franchise *</Label>
              <Select name="franchiseId" required defaultValue={session?.franchiseId || ""}>
                <SelectTrigger className="w-full" disabled={session?.user?.role === "FRANCHISE_OWNER"}>
                  <SelectValue placeholder="Select franchise" />
                </SelectTrigger>
                <SelectContent>
                  {franchises.map((franchise) => (
                    <SelectItem key={franchise._id} value={franchise._id}>
                      {franchise.name} ({franchise.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input id="duration" name="duration" type="number" min="1" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  required 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            {/* GST Section */}
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm text-gray-500">
                    {inclusiveGST
                      ? "Price already includes GST (no additional GST will be charged)"
                      : "GST will be added on top of the price"}
                  </p>
                </div>
                <Switch
                  id="inclusiveGST"
                  checked={inclusiveGST}
                  onCheckedChange={setInclusiveGST}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gstRate">GST Rate (%) *</Label>
                <Input
                  id="gstRate"
                  name="gstRate"
                  type="number"
                  min="0"
                  max="28"
                  step="0.01"
                  defaultValue="18"
                  required={!inclusiveGST}
                  className="bg-white"
                />
              </div>

              {inclusiveGST && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                  <strong>Note:</strong> The entered price already includes GST. No additional GST will be calculated at billing.
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <Input
                id="commissionRate"
                name="commissionRate"
                type="number"
                min="0"
                max="50"
                step="0.01"
                defaultValue="10"
              />
            </div>

            <div className="space-y-2">
              <Label>Allowed Roles *</Label>
              <div className="grid grid-cols-3 gap-4">
                {ROLES.map((role) => (
                  <div key={role.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={role.value}
                      checked={selectedRoles.includes(role.value)}
                      onCheckedChange={(checked) => handleRoleChange(role.value, checked)}
                    />
                    <Label htmlFor={role.value} className="text-sm">
                      {role.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Consumables Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-semibold">Consumables (Optional)</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addConsumable}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Consumable
              </Button>
            </div>

            {consumables.length === 0 && (
              <p className="text-sm text-gray-500 italic">
                No consumables added. Click "Add Consumable" to track product usage for this service.
              </p>
            )}

            {consumables.length > 0 && (
              <div className="space-y-3">
                {consumables.map((consumable, index) => (
                  <Card key={index} className="bg-gray-50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-sm font-medium">Consumable #{index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeConsumable(index)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                        {/* Product Selection */}
                        <div className="md:col-span-6 space-y-2">
                          <Label className="text-xs">Product *</Label>
                          <ProductCombobox
                            value={consumable.productId}
                            params={{ type: "consumables" }}
                            onValueChange={(id, product) => updateConsumable(index, "productId", id, product)}
                          />
                        </div>

                        {/* Quantity Used */}
                        <div className="space-y-2">
                          <Label className="text-xs">Qty Used *</Label>
                          <Input
                            type="number"
                            value={consumable.quantityUsed}
                            onChange={(e) => updateConsumable(index, "quantityUsed", e.target.value)}
                            className="h-9 bg-white"
                            min="0"
                            step="0.01"
                            placeholder="e.g., 2"
                          />
                        </div>

                        {/* Unit */}
                        <div className="space-y-2">
                          <Label className="text-xs">Unit</Label>
                          <Select
                            value={consumable.unit}
                            onValueChange={(value) => updateConsumable(index, "unit", value)}
                          >
                            <SelectTrigger className="h-9 bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {UNITS.map(unit => (
                                <SelectItem key={unit.value} value={unit.value}>
                                  {unit.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Product Cost */}
                        <div className="space-y-2">
                          <Label className="text-xs">Product Cost (₹)</Label>
                          <Input
                            type="number"
                            value={consumable.totalProductCost}
                            onChange={(e) => updateConsumable(index, "totalProductCost", e.target.value)}
                            className="h-9 bg-white"
                            min="0"
                            step="0.01"
                            placeholder="Bottle cost"
                          />
                        </div>

                        {/* Product Quantity */}
                        <div className="space-y-2">
                          <Label className="text-xs">Product Qty</Label>
                          <Input
                            type="number"
                            value={consumable.totalProductQuantity}
                            onChange={(e) => updateConsumable(index, "totalProductQuantity", e.target.value)}
                            className="h-9 bg-white"
                            min="0"
                            step="0.01"
                            placeholder="Total in bottle"
                          />
                        </div>

                        {/* Cost Per Unit */}
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Cost/Unit</Label>
                          <div className="h-9 px-3 py-2 bg-gray-100 border rounded-md text-sm text-gray-700">
                            ₹{consumable.costPerUnit.toFixed(2)}
                          </div>
                        </div>

                        {/* Cost Used */}
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Cost Used</Label>
                          <div className="h-9 px-3 py-2 bg-gray-100 border rounded-md text-sm font-semibold text-gray-900">
                            ₹{consumable.costOfProductUsed.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Cost Summary */}
          {consumables.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Cost Analysis</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Service Price</p>
                    <p className="text-lg font-bold">₹{parseFloat(price || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Consumable Cost</p>
                    <p className="text-lg font-bold text-red-600">₹{totalConsumableCost.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Profit Margin</p>
                    <p className="text-lg font-bold text-green-600">₹{profitMargin.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Margin %</p>
                    <p className="text-lg font-bold text-green-600">{profitMarginPercent.toFixed(2)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Service"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}