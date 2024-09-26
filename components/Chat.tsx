"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A stacked area chart with expand stacking"

const chartData = [
  { month: "April", desktop: 186, mobile: 80, other: 45 },
  { month: "May", desktop: 305, mobile: 200, other: 100 },
  { month: "June", desktop: 237, mobile: 120, other: 150 },
  { month: "July", desktop: 73, mobile: 190, other: 50 },
  { month: "August", desktop: 209, mobile: 130, other: 100 },
  { month: "September", desktop: 214, mobile: 140, other: 160 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "gold"
  },
  mobile: {
    label: "Mobile",
    color: "lime",
  },
  other: {
    label: "other",
    color: "blue",
  },
} satisfies ChartConfig

export default function Chart() {
  return (
    <Card className="bg-slate-800 border border-yellow-500 w-[30%] ml-5 transition duration-500 hover:bg-slate-900 cursor-pointer shadow-lg shadow-slate-900">
      <CardHeader>
        <CardTitle className="text-white opacity-65">Sales track per month</CardTitle>
        <CardDescription>
          Showing total sales for the last 6months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
            }}
            stackOffset="expand"
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="other"
              type="natural"
              fill="var(--color-other)"
              fillOpacity={0.1}
              stroke="var(--color-other)"
              stackId="a"
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex text-yellow-500 items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              April - September 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
