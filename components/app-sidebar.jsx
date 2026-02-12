"use client"

import {
  BadgeIndianRupee,
  Briefcase,
  BriefcaseBusiness,
  Package,
  UserCircle2,
  Building2,
  ChevronRight,
  DollarSign,
  Gift,
  LayoutDashboard,
  Package2Icon,
  ShoppingBasket,
  ShoppingCart,
  SquareTerminal,
  Telescope,
  UserCheck,
  UserCircle,
  CreditCard
} from "lucide-react"
import { useEffect, useState } from "react"

import rynoxLogo from "@/assets/new-logo-png.png"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarRail } from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import Image from "next/image"

export function AppSidebar({ ...props }) {
  const pathName = usePathname()
  const { data: session, status } = useSession()

  // Loading state until session loads
  const [isLoading, setIsLoading] = useState(true)
  const [sideMenus, setSideMenus] = useState([])

  // Role-based menu data
  const adminData = {
    user: {
      name: session?.user?.name || "Admin",
      email: session?.user?.email || "m@example.com",
      avatar: session?.user?.avatar || "/avatars/shadcn.jpg",
    },
    franchise_owner: [
      {
        title: "Franchise",
        url: `/admin/franchise`,
        icon: ShoppingCart
      },
      {
        title: "Customers",
        url: "/admin/customers",
        icon: UserCircle
      },
      {
        title: "Payments",
        url: "/admin/payments",
        icon: BadgeIndianRupee
      },
      {
        title: "Membership - Payments",
        url: "/admin/membership-payments",
        icon: CreditCard
      },
      {
        title: "Products",
        url: "/admin/products",
        icon: ShoppingBasket
      },
      {
        title: "Services",
        url: "/admin/services",
        icon: Telescope
      },
      {
        title: "Operators",
        url: "/admin/users",
        icon: UserCheck,
      },
      {
        title: "Offers",
        url: "/admin/offers",
        icon: Gift
      },
      {
        title: "Packages",
        url: "/admin/packages",
        icon: Package2Icon
      },
      {
        title: "Appointments",
        url: "/admin/appointments",
        icon: BriefcaseBusiness,
      },
      {
        title: "Reports",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Customer Metrics",
            url: "/admin/reports/customer-metrics",
            icon: UserCircle
          },
          {
            title: "Customer Purchase",
            url: "/admin/reports/customer-purchase",
            icon: UserCircle
          },
          {
            title: "Customer Service Bucket",
            url: "/admin/reports/customer-service-bucket",
            icon: UserCircle
          },
          {
            title: "Gain Loss",
            url: "/admin/reports/gain-loss",
            icon: UserCircle
          },
          {
            title: "Service Performance",
            url: "/admin/reports/service",
            icon: Briefcase
          },
          {
            title: "Repeat Customer",
            url: "/admin/reports/repeat-customer",
            icon: UserCircle
          },
          {
            title: "Churn Rate",
            url: "/admin/reports/churn-rate",
            icon: UserCircle
          },
          {
            title: "Kitty Report",
            url: "/admin/reports/kitty-report",
            icon: UserCircle
          },
        ],
      },
    ],
    cashier: [
      {
        title: "Create Payment",
        url: "/admin/create/payment",
        icon: ShoppingCart
      },
      {
        title: "All Payments",
        url: "/admin/payments",
        icon: BadgeIndianRupee
      },
      {
        title: "Appointments",
        url: "/admin/appointments",
        icon: BriefcaseBusiness,
      },
      {
        title: "Buy Package",
        url: "/admin/buy/package",
        icon: Package,
      },
      {
        title: "Buy Membership",
        url: "/admin/purchase/membership",
        icon: UserCircle2,
      }
    ],
    saas_owner: [
      {
        title: "Companies",
        url: "/admin/companies",
        icon: Telescope
      },
      {
        title: "Subscription",
        url: "/admin/subscription",
        icon: DollarSign
      }
    ],
    navMain: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard
      },
      {
        title: "Branches",
        url: "/admin/branches",
        icon: Building2
      },
      {
        title: "Operators",
        url: "/admin/users",
        icon: UserCheck,
      },
      {
        title: "Customers",
        url: "/admin/customers",
        icon: UserCircle
      },
      {
        title: "Payments",
        url: "/admin/payments",
        icon: BadgeIndianRupee
      },
      {
        title: "Membership - Payments",
        url: "/admin/membership-payments",
        icon: CreditCard
      },
      {
        title: "Products",
        url: "/admin/products",
        icon: ShoppingBasket
      },
      {
        title: "Services",
        url: "/admin/services",
        icon: Telescope
      },
      {
        title: "Offers",
        url: "/admin/offers",
        icon: DollarSign
      },
      {
        title: "Packages",
        url: "/admin/packages",
        icon: Package2Icon
      },
      {
        title: "Reports",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Customer Metrics",
            url: "/admin/reports/customer-metrics",
            icon: UserCircle
          },
          {
            title: "Customer Purchase",
            url: "/admin/reports/customer-purchase",
            icon: UserCircle
          },
          {
            title: "Customer Service Bucket",
            url: "/admin/reports/customer-service-bucket",
            icon: UserCircle
          },
          {
            title: "Gain Loss",
            url: "/admin/reports/gain-loss",
            icon: UserCircle
          },
          {
            title: "Service Performance",
            url: "/admin/reports/service",
            icon: Briefcase
          },
          {
            title: "Repeat Customer",
            url: "/admin/reports/repeat-customer",
            icon: UserCircle
          },
          {
            title: "Churn Rate",
            url: "/admin/reports/churn-rate",
            icon: UserCircle
          },

        ],
      },
    ],
  }

  // Set menus based on role once session loads
  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true)
      return
    }

    if (status === 'authenticated' && session?.user?.role) {
      console.log("✅ Role loaded:", session.user.role)

      const roleMenus = {
        "FRANCHISE_OWNER": adminData.franchise_owner,
        "CASHIER": adminData.cashier,
        "SAAS_OWNER": adminData.saas_owner,
      }[session.user.role] || adminData.navMain

      setSideMenus(roleMenus)
      setIsLoading(false)
      console.log("✅ Menu set for role:", session.user.role, roleMenus.length, "items")
    } else {
      // No session or unknown role - show minimal menu or loading
      setSideMenus([])
      setIsLoading(false)
    }
  }, [status, session?.user?.role])

  // Show loading skeleton while role-based menus load
  if (isLoading || status === 'loading') {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <div className="flex items-center space-x-2 p-4">
            <div className="animate-pulse rounded-full h-8 w-8 bg-muted" />
            <div className="animate-pulse h-6 w-24 bg-muted rounded" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {[1, 2, 3].map((i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton className="animate-pulse">
                      <div className="h-4 w-4 bg-muted rounded" />
                      <div className="h-5 w-20 bg-muted rounded ml-2" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="p-4 space-y-2">
            <div className="animate-pulse h-4 w-32 bg-muted rounded" />
            <div className="animate-pulse h-3 w-24 bg-muted rounded" />
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    )
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="xl"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border-b-1 border-accent/60 rounded-none"
              asChild
            >
              <div>
                <Link href="/" className="flex items-center space-x-2 group justify-start">
                  <Image
                    src={rynoxLogo.src}
                    alt="Rynox"
                    width={80}
                    height={80}
                    className="h-16 w-auto"
                  />
                </Link>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-y-scroll no-scrollbar" >
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu >
              {sideMenus.map((item) => {
                const isActive = pathName === item.url
                return (
                  item.items ? (
                    <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuSubButton
                            tooltip={item.title}
                            className={`!my-2 !py-4 ${isActive && "rounded-md bg-sidebar-primary/90 text-sidebar-primary-foreground"}`}
                          >
                            {item.icon && <item.icon className="size-2" />}
                            <span className="text-base">{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuSubButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild className="!py-4">
                                  <Link href={subItem.url}>
                                    <span className="text-sm">{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                          className={`my-2! py-6! ${isActive && "rounded-md bg-sidebar-primary/90 text-sidebar-primary-foreground"}`}
                      >
                        <Link href={item.url}>
                          {item.icon && <item.icon className="size-2" />}
                            <span className="text-base font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={adminData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
