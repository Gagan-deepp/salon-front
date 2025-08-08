"use client"

import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const revenueData = [
  { month: "Jan", services: 35000, products: 10000 },
  { month: "Feb", services: 42000, products: 10000 },
  { month: "Mar", services: 38000, products: 10000 },
  { month: "Apr", services: 51000, products: 10000 },
  { month: "May", services: 45000, products: 10000 },
  { month: "Jun", services: 57000, products: 10000 },
  { month: "Jul", services: 62000, products: 10000 },
  { month: "Aug", services: 59000, products: 10000 },
  { month: "Sep", services: 68000, products: 10000 },
  { month: "Oct", services: 72000, products: 10000 },
  { month: "Nov", services: 75000, products: 10000 },
  { month: "Dec", services: 78000, products: 10000 },
]

export function RevenueChart() {
  return (
    <ChartContainer
      config={{
        services: {
          label: "Services Revenue",
          color: "hsl(var(--chart-1))",
        },
        products: {
          label: "Products Revenue",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="services"
            stackId="1"
            stroke="var(--color-services)"
            fill="var(--color-services)" />
          <Area
            type="monotone"
            dataKey="products"
            stackId="1"
            stroke="var(--color-products)"
            fill="var(--color-products)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
