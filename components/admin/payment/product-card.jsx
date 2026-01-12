"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Minus, Plus } from "lucide-react"

export function ProductCard({ products, setFormData, formData }) {

  const getProductQuantity = (productId) => {
    const product = formData.products.find((p) => p.productId === productId)
    return product ? product.quantity : 0
  }

  const addProductFromCard = (product) => {
    const existingProductIndex = formData.products.findIndex((p) => p.productId === product._id)

    if (existingProductIndex >= 0) {
      // If product already exists, increase quantity
      updateProduct(existingProductIndex, "quantity", formData.products[existingProductIndex].quantity + 1)
    } else {
      // Add new product
      setFormData((prev) => ({
        ...prev,
        products: [
          ...prev.products,
          {
            productId: product._id,
            productName: product.name,
            productCode: product.code || "",
            price: product.price.mrp,
            gstRate: 18,
            quantity: 1,
            unit: "piece",
          },
        ],
      }))
    }
  }

  const decreaseProductQuantity = (productId) => {
    const productIndex = formData.products.findIndex((p) => p.productId === productId)
    if (productIndex >= 0) {
      const currentQuantity = formData.products[productIndex].quantity
      if (currentQuantity > 1) {
        updateProduct(productIndex, "quantity", currentQuantity - 1)
      } else {
        removeProduct(productIndex)
      }
    }
  }


  const removeProduct = (index) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }))
  }

  const updateProduct = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((product, i) => (i === index ? { ...product, [field]: value } : product)),
    }))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => {
        const quantity = getProductQuantity(product._id)
        return (
          <Card
            key={product._id}
            className={`cursor-pointer transition-all hover:shadow-md ${quantity > 0 ? "ring-2 ring-border bg-blue-50" : "hover:bg-gray-50"
              }`}
            onClick={() => addProductFromCard(product)}
          >
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{product.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-green-600">₹{product.price.mrp}</span>
                  <span className="text-xs text-gray-500">{product.brand}</span>
                </div>
                {quantity > 0 && (
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        decreaseProductQuantity(product._id)
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
                        addProductFromCard(product)
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
