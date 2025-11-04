"use client"

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, LabelList, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"


export function CustomerChart({ data }) {

  return (
    <ChartContainer
      config={{
        new: {
          label: "New Customers",
          color: "var(--chart-4)",
        },
        returning: {
          label: "Returning Customers",
          color: "var(--chart-2)",
        },
      }}
      className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">

        <BarChart
          accessibilityLayer
          data={data}
          margin={{
            top: 20,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey="count" fill="var(--color-returning)" radius={8}>
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
        </BarChart>


      </ResponsiveContainer>
    </ChartContainer>
  );
}
