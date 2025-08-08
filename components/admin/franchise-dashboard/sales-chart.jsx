"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const salesData = [
  { month: "Jan", sales: 45000, target: 50000 },
  { month: "Feb", sales: 52000, target: 55000 },
  { month: "Mar", sales: 48000, target: 52000 },
  { month: "Apr", sales: 61000, target: 58000 },
  { month: "May", sales: 55000, target: 60000 },
  { month: "Jun", sales: 67000, target: 65000 },
  { month: "Jul", sales: 72000, target: 70000 },
  { month: "Aug", sales: 69000, target: 72000 },
  { month: "Sep", sales: 78000, target: 75000 },
  { month: "Oct", sales: 82000, target: 80000 },
  { month: "Nov", sales: 85000, target: 85000 },
  { month: "Dec", sales: 88000, target: 90000 },
]

export function SalesChart() {
  return (
    <ChartContainer
      config={{
        sales: {
          label: "Sales",
          color: "hsl(var(--chart-1))",
        },
        target: {
          label: "Target",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="var(--color-sales)"
            strokeWidth={2} />
          <Line
            type="monotone"
            dataKey="target"
            stroke="var(--color-target)"
            strokeWidth={2}
            strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
