"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditServiceDialog } from "./edit-service-dialog"
import { DeleteServiceDialog } from "./delete-service-dialog"
import { ArrowLeft, Edit, Clock, DollarSign, Users, Percent, Calendar, Scissors, Trash2 } from "lucide-react"
import { useSession } from "next-auth/react"

const CATEGORY_LABELS = {
  HAIR_CUT: "Hair Cut",
  HAIR_COLOR: "Hair Color",
  FACIAL: "Facial",
  MASSAGE: "Massage",
  MANICURE: "Manicure",
  PEDICURE: "Pedicure",
  THREADING: "Threading",
  WAXING: "Waxing",
  BRIDAL: "Bridal",
  OTHER: "Other",
}

const ROLE_LABELS = {
  STYLIST: "Stylist",
  THERAPIST: "Therapist",
  MANAGER: "Manager",
}

export function ServiceDetails({ service }) {
  const router = useRouter()
  const { data: session } = useSession()

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

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ""}`
    }
    return `${mins}m`
  }

  const commissionAmount = (service.price * service.commissionRate) / 100

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
            <h1 className="text-3xl font-bold ">{service.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline">{CATEGORY_LABELS[service.category]}</Badge>
              <Badge variant={service.isActive ? "default" : "destructive"}>
                {service.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
        { session.user.role === "SUPER_ADMIN" && <div className="flex space-x-2">
          <DeleteServiceDialog service={service}>
            <Button variant="outline">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DeleteServiceDialog>
          <EditServiceDialog service={service}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </EditServiceDialog>
        </div>}
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Service Price</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(service.price)}</div>
                <p className="text-xs text-muted-foreground">GST: {service.gstRate}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Duration</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatDuration(service.duration)}</div>
                <p className="text-xs text-muted-foreground">{service.duration} minutes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commission</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{service.commissionRate}%</div>
                <p className="text-xs text-muted-foreground">{formatCurrency(commissionAmount)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Staff Roles</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{service.allowedRoles.length}</div>
                <p className="text-xs text-muted-foreground">Authorized roles</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Service Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scissors className="w-5 h-5 mr-2" />
                  Service Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Category</p>
                  <p className="text-sm text-muted-foreground">{CATEGORY_LABELS[service.category]}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Description</p>
                  <p className="text-sm text-muted-foreground">{service.description || "No description available"}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">{formatDuration(service.duration)}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Allowed Roles</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {service.allowedRoles.map((role) => (
                      <Badge key={role} variant="secondary">
                        {ROLE_LABELS[role]}
                      </Badge>
                    ))}
                  </div>
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
                  <p className="text-sm text-muted-foreground">{formatDate(service.createdAt)}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">{formatDate(service.updatedAt)}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Status</p>
                  <Badge variant={service.isActive ? "default" : "destructive"}>
                    {service.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Base Price</span>
                  <span className="font-medium">{formatCurrency(service.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Rate</span>
                  <span className="font-medium">{service.gstRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Amount</span>
                  <span className="font-medium">{formatCurrency((service.price * service.gstRate) / 100)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">Total Price</span>
                  <span className="font-bold">
                    {formatCurrency(service.price + (service.price * service.gstRate) / 100)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Commission Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Commission Rate</span>
                  <span className="font-medium">{service.commissionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Commission Amount</span>
                  <span className="font-medium">{formatCurrency(commissionAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Net Revenue</span>
                  <span className="font-medium text-green-600">{formatCurrency(service.price - commissionAmount)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
