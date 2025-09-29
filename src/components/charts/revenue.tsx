"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "Jan", segment1: 1000, segment2: 800, segment3: 600 },
  { month: "Feb", segment1: 1000, segment2: 700, segment3: 500 },
  { month: "Mar", segment1: 1000, segment2: 1800, segment3: 700 },
  { month: "Apr", segment1: 1000, segment2: 800, segment3: 600 },
  { month: "May", segment1: 1000, segment2: 800, segment3: 600 },
  { month: "Jun", segment1: 1000, segment2: 800, segment3: 600 },
]

const chartConfig = {
  segment1: {
    label: "Base",
    color: "#93C5FD",
  },
  segment2: {
    label: "Growth", 
    color: "#60A5FA",
  },
  segment3: {
    label: "Peak",
    color: "#3B82F6",
  },
} satisfies ChartConfig

export function Revenue() {
  return (
    <div className="bg-white px-6 py-6 rounded-lg shadow-sm flex flex-col gap-6 min-w-[500px]">
      <div className="font-bold text-2xl text-gray-800">
        Recent Revenue
      </div>
      <div className="w-full h-px bg-gray-200"></div>
      
      <div className="h-80">
        <ChartContainer config={chartConfig}>
          <BarChart 
            accessibilityLayer 
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={15}
              axisLine={false}
              className="text-gray-600 text-sm"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              domain={[0, 3500]}
              ticks={[0, 1000, 2000, 3000]}
              tickFormatter={(value) => value === 0 ? '0' : `${value/1000}k`}
              className="text-gray-600 text-sm"
            />
            <ChartTooltip 
              content={<ChartTooltipContent hideLabel />}
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            />
            <Bar 
              dataKey="segment1"
              stackId="a"
              fill="#E0F2FE"
              radius={[0, 0, 8, 8]}
            />
            <Bar
              dataKey="segment2"
              stackId="a"
              fill="#7DD3FC"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="segment3"
              stackId="a"
              fill="#3B82F6"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
