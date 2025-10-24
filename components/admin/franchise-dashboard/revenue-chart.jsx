"use client"

import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"


export function RevenueChart({ data }) {
  return (
    <ChartContainer
      config={{
        services: {
          label: "Services Revenue",
          color: "var(--chart-1)",
        },
        products: {
          label: "Products Revenue",
          color: "var(--chart-2)",
        },
      }}
      className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="amount"
            stackId="1"
            stroke="var(--color-products)"
            fill="var(--color-products)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
