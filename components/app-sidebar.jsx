"use client"

import {
  BadgeIndianRupee,
  Building2,
  LayoutDashboard,
  ShoppingBasket,
  ShoppingCart,
  Telescope,
  UserCheck,
  UserCircle
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"



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
    ],

    cashier: [
      {
        title: "Create Payment",
        url: "/admin/create/payment",
        icon: ShoppingCart
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
    ],
  }

  const sideMenus = session?.user?.role === "FRANCHISE_OWNER" ? adminData.franchise_owner : session?.user?.role === "CASHIER" ? adminData.cashier : adminData.navMain


  
  return (
    <Sidebar collapsible="icon" {...props}>


      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" asChild >
              <div>
                <div className="flex aspect-square size-8 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground">
                  <LayoutDashboard className="size-4" />
                </div>
                <div>
                  <span className="truncate font-semibold">Admin Panel</span>
                </div>

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
                  <SidebarMenuItem key={item.title}  >
                    <SidebarMenuButton asChild className={`!my-2 !py-4 ${isActive && "rounded-md bg-sidebar-accent/80 text-sidebar-accent-foreground"}`} >
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
