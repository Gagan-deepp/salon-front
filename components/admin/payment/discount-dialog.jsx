"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tag, Check, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { validateOffer } from "@/lib/actions/offer_action"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function DiscountDialog({ 
  discount, 
  subtotal, 
  customerId, 
  franchiseId,
  services = [],
  products = [],
  onApply, 
  children 
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validatingPromo, setValidatingPromo] = useState(false)
  const [promoValidated, setPromoValidated] = useState(false)
  const [validationError, setValidationError] = useState(null)
  
  const [formData, setFormData] = useState({
    percentage: discount?.percentage || 0,
    promoCode: discount?.promoCode || "",
    offerId: discount?.offerId || null,
    offerName: discount?.offerName || "",
  })

  const [discountDetails, setDiscountDetails] = useState(null)

  // Reset validation state when promo code changes
  const handlePromoCodeChange = (value) => {
    setFormData((prev) => ({ 
      ...prev, 
      promoCode: value.toUpperCase(),
      percentage: 0,
      offerId: null,
      offerName: ""
    }))
    setPromoValidated(false)
    setValidationError(null)
    setDiscountDetails(null)
  }

  // Validate promo code against API
  const handlePromoValidation = async () => {
    if (!formData.promoCode || subtotal === 0) {
      toast.error("Please enter a promo code")
      return
    }

    // if (!franchiseId) {
    //   toast.error("Franchise information is required")
    //   return
    // }

    setValidatingPromo(true)
    setValidationError(null)

    try {
      console.log("🔍 Validating promo code:", formData.promoCode)
      
      const validationData = {
        offerCode: formData.promoCode,
        amount: subtotal,
        customerId,
        // franchiseId,
        services: services.map(s => ({
          serviceId: s.serviceId || s._id,
          price: s.price
        })),
        products: products.map(p => ({
          productId: p.productId || p._id,
          price: p.price
        }))
      }

      const result = await validateOffer(validationData)
      
      console.log("📊 Validation result:", result)

      if (result.success && result.data.data.valid) {
        const { offer, discount: discountInfo } = result.data.data
        
        setPromoValidated(true)
        setDiscountDetails(discountInfo)
        setFormData((prev) => ({
          ...prev,
          percentage: discountInfo.discountValue,
          offerId: offer.id,
          offerName: offer.name
        }))
        
        toast.success(`Promo code applied! ${discountInfo.discountValue}% discount`, {
          description: offer.name
        })
      } else {
        const errorMessage = result.data?.message || result.error || "Invalid promo code"
        setValidationError(errorMessage)
        setPromoValidated(false)
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error("❌ Validation error:", error)
      setValidationError("Failed to validate promo code")
      setPromoValidated(false)
      toast.error("Failed to validate promo code")
    } finally {
      setValidatingPromo(false)
    }
  }

  const handleApply = () => {
    if (!promoValidated && formData.promoCode) {
      toast.error("Please validate the promo code first")
      return
    }

    if (formData.percentage === 0 && !formData.promoCode) {
      toast.error("No discount to apply")
      return
    }

    onApply({
      percentage: formData.percentage,
      promoCode: formData.promoCode,
      offerId: formData.offerId,
      offerName: formData.offerName,
      discountAmount: discountDetails?.discountAmount || (subtotal * formData.percentage) / 100
    })
    
    setOpen(false)
    toast.success("Discount applied successfully")
  }

  const handleRemovePromo = () => {
    setFormData({
      percentage: 0,
      promoCode: "",
      offerId: null,
      offerName: ""
    })
    setPromoValidated(false)
    setValidationError(null)
    setDiscountDetails(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply Discount</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Promo Code Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Promo Code</Label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Enter promo code"
                  value={formData.promoCode}
                  onChange={(e) => handlePromoCodeChange(e.target.value)}
                  disabled={promoValidated}
                  className={`uppercase ${
                    promoValidated 
                      ? 'border-green-500 bg-green-50' 
                      : validationError 
                      ? 'border-red-500' 
                      : ''
                  }`}
                />
                {promoValidated && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                )}
                {validationError && (
                  <X className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                )}
              </div>
              
              {!promoValidated ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePromoValidation}
                  disabled={!formData.promoCode || subtotal === 0 || validatingPromo}
                >
                  {validatingPromo ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Tag className="w-4 h-4" />
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemovePromo}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Validation Messages */}
            {promoValidated && discountDetails && (
              <Alert className="border-green-200 bg-green-50">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <div className="space-y-1">
                    <p className="font-semibold">{formData.offerName}</p>
                    <p className="text-sm">
                      {discountDetails.discountType === 'PERCENTAGE' 
                        ? `${discountDetails.discountValue}% discount` 
                        : `₹${discountDetails.discountValue} off`}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {validationError && (
              <Alert className="border-red-200 bg-red-50">
                <X className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 text-sm">
                  {validationError}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Discount Preview */}
          {promoValidated && discountDetails && (
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Subtotal:</span>
                    <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Discount:</span>
                    <div className="text-right">
                      <Badge className="bg-green-600">
                        {discountDetails.discountType === 'PERCENTAGE' 
                          ? `${discountDetails.discountValue}%` 
                          : `₹${discountDetails.discountValue}`}
                      </Badge>
                      <p className="text-red-600 font-semibold mt-1">
                        -₹{discountDetails.discountAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-green-300">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-800">Amount after discount:</span>
                      <span className="text-lg font-bold text-green-700">
                        ₹{discountDetails.finalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                GST will be calculated on the discounted amount
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setOpen(false)
                handleRemovePromo()
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApply}
              disabled={loading || (!promoValidated && formData.promoCode)}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Applying...
                </>
              ) : (
                "Apply Discount"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
