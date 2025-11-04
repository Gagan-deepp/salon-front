"use client"

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, LabelList, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ScrollArea, ScrollBar } from "../ui/scroll-area";


const CrossFranchiseChart = ({ data }) => {

    return (
        <ScrollArea className="w-full rounded-md border whitespace-nowrap" >
            <ChartContainer
                config={{
                    new: {
                        label: "New Customers",
                        color: "var(--chart-1)",
                    },
                    returning: {
                        label: "Returning Customers",
                        color: "var(--chart-4)",
                    },
                }}
                className="h-[250px] w-full flex">
                <ResponsiveContainer width="100%" height="100%">

                    <BarChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            top: 20,
                        }}
                        barSize={100}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="franchiseName"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="totalRevenue" fill="var(--color-returning)" radius={8}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                                formatter={(val) => Math.round(val)}
                            />
                        </Bar>
                    </BarChart>


                </ResponsiveContainer>
            </ChartContainer>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    )
}

export default CrossFranchiseChart