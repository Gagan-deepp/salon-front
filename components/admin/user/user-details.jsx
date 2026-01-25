"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { EditUserDialog } from "./edit-user-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Building2,
  Shield,
} from "lucide-react";

export function UserDetails({ user, performance, referrals }) {
  const router = useRouter();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Get current month kitty from user.kittyMonthly Map
  const getCurrentMonthKitty = (user) => {
    if (!user?.kittyMonthly) return 0;

    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const monthKey = `${year}-${month}`;
    console.log("user.kittyMonthly", user.kittyMonthly);

    // ✅ SAFE ACCESS - works with plain object OR Map
    return (user.kittyMonthly && user.kittyMonthly[monthKey]) || 0;
  };

  // Get current month name
  const currentMonthName = () => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[new Date().getMonth()];
  };

  return (
    <div className="space-y-6 ">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <DeleteUserDialog user={user}>
            <Button variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DeleteUserDialog>
          <EditUserDialog user={user}>
            <Button size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </EditUserDialog>
        </div>
      </div>

      <div className="flex items-start gap-6">
        <Avatar className="h-20 w-20 border-2">
          <AvatarFallback className="text-2xl font-semibold">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
          <p className="text-muted-foreground mt-1">{user.email}</p>
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" className="font-normal">
              {user.role?.replace("_", " ")}
            </Badge>
            <Badge
              variant={user.isActive ? "default" : "secondary"}
              className="font-normal"
            >
              {user.isActive ? "Active" : "Inactive"}
            </Badge>
            {user.emailVerified && (
              <Badge variant="outline" className="font-normal">
                Verified
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">

        <Card>
          <CardContent>
            <CardHeader className="pb-3 px-0!">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total earnings
              </CardTitle>
            </CardHeader>
            <div className="text-2xl font-bold">
              {formatCurrency(user.totalKitty || 0)}
            </div>
            {/* <p className="text-xs text-muted-foreground mt-1">
              {currentMonthName()} earnings
            </p> */}
            {/* <div className="text-sm text-muted-foreground mt-1">
              Total: {formatCurrency(user.totalKitty || 0)}
            </div> */}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <CardHeader className="pb-3 px-0!">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly earnings
              </CardTitle>
            </CardHeader>
            <div className="text-2xl font-bold">
              {formatCurrency(getCurrentMonthKitty(user))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentMonthName()} earnings
            </p>
            {/* <div className="text-sm text-muted-foreground mt-1">
              Total: {formatCurrency(user.totalKitty || 0)}
            </div> */}
          </CardContent>
        </Card>


        <Card>
          <CardContent>
            <CardHeader className="pb-3 px-0!">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Comission per month
              </CardTitle>
            </CardHeader>
            <div className="text-2xl font-bold">
              {formatCurrency((getCurrentMonthKitty(user) * user.commissionStructure.defaultServiceRate) / 100)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Comission earned in {currentMonthName()}
            </p>
            {/* <div className="text-sm text-muted-foreground mt-1">
              Total: {formatCurrency(user.totalKitty || 0)}
            </div> */}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Email Address</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Phone Number</p>
                <p className="text-sm text-muted-foreground">
                  {user.phone || "Not provided"}
                </p>
              </div>
            </div>
            {user.franchiseId && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Franchise</p>
                    <p className="text-sm text-muted-foreground">
                      {user.franchiseId.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.franchiseId.address}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Joined</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(user.updatedAt)}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Last Login</p>
                <p className="text-sm text-muted-foreground">
                  {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
