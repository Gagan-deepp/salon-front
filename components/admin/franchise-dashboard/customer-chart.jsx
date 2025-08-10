"use client"

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const customerData = [
  { month: "Jan", new: 45, returning: 120 },
  { month: "Feb", new: 52, returning: 135 },
  { month: "Mar", new: 48, returning: 128 },
  { month: "Apr", new: 61, returning: 145 },
  { month: "May", new: 55, returning: 142 },
  { month: "Jun", new: 67, returning: 158 },
]

export function CustomerChart() {
  return (
    <ChartContainer
      config={{
        new: {
          label: "New Customers",
          color: "var(--chart-1)",
        },
        returning: {
          label: "Returning Customers",
          color: "var(--chart-2)",
        },
      }}
      className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={customerData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}  >
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="new" fill="var(--color-new)" radius={5} />
          <Bar dataKey="returning" fill="var(--color-returning)" radius={7} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
