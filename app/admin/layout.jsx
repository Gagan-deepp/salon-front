import { Sidebar } from "@/components/admin/sidebar"
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>

      {/* <SessionProvider> */}
      <AppSidebar />
      {/* </SessionProvider> */}

      <SidebarInset>
        <header
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 justify-between w-full">
            <SidebarTrigger className="-ml-1" />

            <div className="flex gap-2" >
              {/* <ModeToggle /> */}
            </div>
          </div>
        </header>
        <main >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
