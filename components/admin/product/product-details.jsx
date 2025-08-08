"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditProductDialog } from "./edit-product-dialog"
import { StockUpdateDialog } from "./stock-update-dialog"
import { DeleteProductDialog } from "./delete-product-dialog"
import {
  ArrowLeft,
  Edit,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Tag,
  Percent,
  Calendar,
  Trash2,
} from "lucide-react"

const CATEGORY_LABELS = {
  HAIR_CARE: "Hair Care",
  SKIN_CARE: "Skin Care",
  MAKEUP: "Makeup",
  TOOLS: "Tools",
  ACCESSORIES: "Accessories",
  OTHER: "Other",
}

export function ProductDetails({ product }) {
  const router = useRouter()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  }

  const isLowStock = product.stock.current <= product.stock.minimum
  const profitMargin = (((product.price.selling - product.price.cost) / product.price.selling) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="my-4" >
            <h1 className="text-3xl font-bold ">{product.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline">{product.sku}</Badge>
              <Badge variant={product.isActive ? "default" : "destructive"}>
                {product.isActive ? "Active" : "Inactive"}
              </Badge>
              {isLowStock && (
                <Badge variant="destructive" className="flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Low Stock</span>
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <StockUpdateDialog product={product}>
            <Button variant="outline">
              <Package className="w-4 h-4 mr-2" />
              Update Stock
            </Button>
          </StockUpdateDialog>
          <DeleteProductDialog product={product}>
            <Button variant="outline">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DeleteProductDialog>
          <EditProductDialog product={product}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </EditProductDialog>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Stock</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Selling Price</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(product.price.selling)}</div>
                <p className="text-xs text-muted-foreground line-through">MRP: {formatCurrency(product.price.mrp)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Stock</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${isLowStock ? "text-red-600" : ""}`}>{product.stock.current}</div>
                <p className="text-xs text-muted-foreground">
                  Min: {product.stock.minimum} | Max: {product.stock.maximum}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profitMargin}%</div>
                <p className="text-xs text-muted-foreground">Cost: {formatCurrency(product.price.cost)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{product.commissionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency((product.price.selling * product.commissionRate) / 100)}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Category</p>
                  <p className="text-sm text-muted-foreground">{CATEGORY_LABELS[product.category]}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Brand</p>
                  <p className="text-sm text-muted-foreground">{product.brand || "Not specified"}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Description</p>
                  <p className="text-sm text-muted-foreground">{product.description || "No description available"}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">GST Rate</p>
                  <p className="text-sm text-muted-foreground">{product.gstRate}%</p>
                </div>
              </CardContent>
            </Card>

            {/* System Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">{formatDate(product.createdAt)}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">{formatDate(product.updatedAt)}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Status</p>
                  <Badge variant={product.isActive ? "default" : "destructive"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>MRP</span>
                  <span className="font-medium">{formatCurrency(product.price.mrp)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Selling Price</span>
                  <span className="font-medium">{formatCurrency(product.price.selling)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cost Price</span>
                  <span className="font-medium">{formatCurrency(product.price.cost)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="font-medium text-green-600">
                    {(((product.price.mrp - product.price.selling) / product.price.mrp) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Profit Margin</span>
                  <span className="font-medium text-blue-600">{profitMargin}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stock Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Current Stock</span>
                  <span className={`font-medium ${isLowStock ? "text-red-600" : ""}`}>
                    {product.stock.current} units
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Minimum Stock</span>
                  <span className="font-medium">{product.stock.minimum} units</span>
                </div>
                <div className="flex justify-between">
                  <span>Maximum Stock</span>
                  <span className="font-medium">{product.stock.maximum} units</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Stock Status</span>
                  <Badge variant={isLowStock ? "destructive" : "default"}>
                    {isLowStock ? "Low Stock" : "In Stock"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
