"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChartData {
  date: string;
  [key: string]: number | string;
}

interface ChartComponentProps {
  data: ChartData[]; 
  title: string; 
  description: string;
  dataKeys: string[]; 
  colors: string[];
}

export function ChartComponent({ data, title, description, dataKeys, colors }: ChartComponentProps) {
  const [timeRange, setTimeRange] = React.useState("7d");
  const [selectedMetric, setSelectedMetric] = React.useState(dataKeys[0]); 

  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date(data[data.length - 1].date); 
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  const chartConfig = {
    [selectedMetric]: {
      label: selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1),
      color: colors[dataKeys.indexOf(selectedMetric)],
    },
  };

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex gap-2">
          {/* Time Range Dropdown */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px] rounded-lg" aria-label="Select a time range">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Metric Dropdown */}
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[160px] rounded-lg" aria-label="Select a metric">
              <SelectValue placeholder="Select a metric" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {dataKeys.map((key) => {
                const formattedKey = key
                  .replace("total", "")
                  .replace(/([A-Z])/g, " $1")
                  .trim();
                return (
                  <SelectItem key={key} value={key} className="rounded-lg">
                    {formattedKey}
                  </SelectItem>
                );
              })}

            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id={`fill-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[dataKeys.indexOf(selectedMetric)]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors[dataKeys.indexOf(selectedMetric)]} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey={selectedMetric}
              type="natural"
              fill={`url(#fill-${selectedMetric})`}
              stroke={colors[dataKeys.indexOf(selectedMetric)]}
              stackId="a"
              name={
                selectedMetric.includes("Amount")
                  ? "Amount" 
                  : selectedMetric.replace("total", "").trim() 
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}