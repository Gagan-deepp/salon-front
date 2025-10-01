"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tag } from "lucide-react"
import { toast } from "sonner"

export function DiscountDialog({ discount, subtotal, customerId, onApply, onValidatePromo, children }) {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        percentage: discount.percentage || 0,
        promoCode: discount.promoCode || "",
    })

    const handleApply = () => {
        onApply(formData)
        setOpen(false)
        toast.success("Discount applied successfully")
    }

    const handlePromoValidation = () => {
        if (!formData.promoCode || subtotal === 0) return
        onValidatePromo()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Apply Discount</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Promo Code</Label>
                        <div className="flex space-x-2">
                            <Input
                                placeholder="Enter promo code"
                                value={formData.promoCode}
                                onChange={(e) => setFormData((prev) => ({ ...prev, promoCode: e.target.value }))}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePromoValidation}
                                disabled={!formData.promoCode || subtotal === 0}
                            >
                                <Tag className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Discount %</Label>
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.percentage}
                            onChange={(e) => setFormData((prev) => ({ ...prev, percentage: Number.parseFloat(e.target.value) || 0 }))}
                        />
                    </div>

                    {formData.percentage > 0 && (
                        <div className="p-3 bg-green-50 rounded-lg">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Discount Amount:</span>
                                <span className="text-green-600 font-semibold">
                                    ₹{((subtotal * formData.percentage) / 100).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleApply}>Apply Discount</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
