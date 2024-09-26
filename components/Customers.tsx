"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Dot, Line, LineChart } from "recharts"

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

export const description = "A line chart with dots and colors"

const chartData = [
  { browser: "chrome", visitors: 2, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 4, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 3, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 6, fill: "var(--color-edge)" },
  { browser: "other", visitors: 10, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: {
    label: "Customers",
    color: "yellow",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "yellow",
  },
  firefox: {
    label: "Firefox",
    color: "pink",
  },
  edge: {
    label: "Edge",
    color: "lime",
  },
  other: {
    label: "Other",
    color: "purple",
  },
} satisfies ChartConfig

export default function Customers() {
  return (
    <Card  className="bg-slate-800 border border-yellow-500 w-[30%] shadow-lg shadow-slate-900 ml-5 transition duration-500 hover:bg-slate-900 cursor-pointer">
      <CardHeader>
        <CardTitle className="text-white opacity-65">Customers per month</CardTitle>
        <CardDescription>April - September 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 24,
              left: 24,
              right: 24,
            }}
          >
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  nameKey="visitors"
                  hideLabel
                />
              }
            />
            <Line
              dataKey="visitors"
              type="natural"
              stroke="var(--color-visitors)"
              strokeWidth={2}
              dot={({ payload, ...props }) => {
                return (
                  <Dot
                    key={payload.browser}
                    r={5}
                    cx={props.cx}
                    cy={props.cy}
                    fill={payload.fill}
                    stroke={payload.fill}
                  />
                )
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-yellow-500">
          Trending up by 3.0% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total Customers for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
