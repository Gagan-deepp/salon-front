"use client"

import {
  BadgeIndianRupee,
  Briefcase,
  Building2,
  ChevronRight,
  LayoutDashboard,
  ShoppingBasket,
  ShoppingCart,
  SquareTerminal,
  Telescope,
  UserCheck,
  UserCircle
} from "lucide-react"

import rynoxLogo from "@/assets/rynox-logo.png"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarRail, } from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"



export function AppSidebar({
  ...props
}) {
  const pathName = usePathname()
  const { data: session } = useSession()
  console.debug("Full session object:", JSON.stringify(session, null, 2))

  console.debug("AppSidebar session ==> ", session)

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
        title: "Users",
        url: "/admin/users",
        icon: UserCheck,
      },
      {
        title: "Reports",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
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
    ],

    saas_owner: [
      {
        title: "Companies",
        url: "/admin/companies",
        icon: Telescope
      },
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
        title: "Users",
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
        title: "Reports",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
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

  const sideMenus = session?.user?.role === "FRANCHISE_OWNER" ? adminData.franchise_owner : session?.user?.role === "CASHIER" ? adminData.cashier : session?.user?.role === "SAAS_OWNER" ? adminData.saas_owner : adminData.navMain



  return (
    <Sidebar collapsible="icon" {...props}>


      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" asChild >
              <div>
                <Link href="/" className="flex items-center space-x-2 group w-full justify-start" >
                  <img
                    src={rynoxLogo.src}
                    alt="Rynox"
                    className="h-8  w-auto"
                  />
                </Link>

              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>


      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>

            <SidebarMenu>
              {sideMenus.map((item) => {

                let isActive = pathName === item.url
                return (
                  item.items ?
                    <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
                      <SidebarMenuItem key={item.title} >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuSubButton tooltip={item.title} className={`!my-2 !py-4 ${isActive && "rounded-md bg-sidebar-primary/90 text-sidebar-primary-foreground"}`}>
                            {item.icon && <item.icon className="size-2" />}
                            <span className="text-base" >{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuSubButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild className="!py-4">
                                  <Link href={subItem.url} >
                                    <span className="text-sm" >{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                    : <SidebarMenuItem key={item.title}  >
                      <SidebarMenuButton asChild className={`!my-2 !py-4 ${isActive && "rounded-md bg-sidebar-primary/90 text-sidebar-primary-foreground"}`} >
                        <Link href={item.url} >
                          <item.icon className="size-2" />
                          <span className="text-base" >{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
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
  );
}
