"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BulkPaymentUpload from "@/components/bulk/bulk-payment"
import { CreditCard, FileUp } from "lucide-react"

export function PaymentTabs({ children }) {
    return (
        <Tabs defaultValue="payments" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14 p-1.5 bg-muted/60 backdrop-blur-sm rounded-xl border border-border/40 shadow-sm">
                <TabsTrigger
                    value="payments"
                    className="group relative rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:shadow-md after:absolute after:bottom-0 after:left-1/4 after:w-1/2 after:h-0.5 after:bg-primary-foreground after:rounded-full after:scale-x-0 after:transition-transform after:duration-300 after:origin-center data-[state=active]:after:scale-x-100"
                >
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded-md transition-colors duration-200 group-data-[state=active]:bg-primary-foreground/20">
                            <CreditCard className="w-4 h-4" />
                        </div>
                        <span>Payments</span>
                    </div>
                </TabsTrigger>
                <TabsTrigger
                    value="bulk-upload"
                    className="group relative rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:shadow-md after:absolute after:bottom-0 after:left-1/4 after:w-1/2 after:h-0.5 after:bg-primary-foreground after:rounded-full after:scale-x-0 after:transition-transform after:duration-300 after:origin-center data-[state=active]:after:scale-x-100"
                >
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded-md transition-colors duration-200 group-data-[state=active]:bg-primary-foreground/20">
                            <FileUp className="w-4 h-4" />
                        </div>
                        <span>Bulk Upload</span>
                    </div>
                </TabsTrigger>
            </TabsList>

            <TabsContent value="payments" className="mt-6 animate-in fade-in-50 duration-200">
                {children}
            </TabsContent>
            <TabsContent value="bulk-upload" className="mt-6 animate-in fade-in-50 duration-200">
                <BulkPaymentUpload />
            </TabsContent>
        </Tabs>
    )
}
