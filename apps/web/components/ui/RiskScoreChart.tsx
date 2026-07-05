"use client"

import React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartConfig,
} from "@/components/ui/chart"

const defaultData = [
  { label: "Scan 1", score: 68 },
  { label: "Scan 2", score: 74 },
  { label: "Scan 3", score: 81 },
  { label: "Scan 4", score: 77 },
  { label: "Scan 5", score: 84 },
  { label: "Scan 6", score: 92 },
  { label: "Scan 7", score: 98 },
]

export type RiskScoreChartProps = {
  data?: {
    label: string
    score: number
  }[]
  currentScore?: number
  status?: "Low Risk" | "Medium Risk" | "High Risk"
  /** Omit the card background/shadow when already nested inside another card. */
  bare?: boolean
}

function getRiskLevel(score: number): "Low Risk" | "Medium Risk" | "High Risk" {
  if (score >= 80) return "Low Risk"
  if (score >= 50) return "Medium Risk"
  return "High Risk"
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const score = data.score
    const label = data.label

    let riskLevel = "Low Risk"
    let riskColor = "text-primary"
    if (score < 50) {
      riskLevel = "High Risk"
      riskColor = "text-error"
    } else if (score < 80) {
      riskLevel = "Medium Risk"
      riskColor = "text-tertiary"
    }

    return (
      <div className="bg-card p-2.5 rounded-xl shadow-md text-[10px] font-semibold text-muted-foreground space-y-1 text-left animate-in fade-in duration-200">
        <p className="text-muted-foreground/60 font-bold">{label}</p>
        <div className="flex items-center gap-1">
          <span>Trust Score:</span>
          <span className="font-bold text-foreground">{score}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Risk Level:</span>
          <span className={`font-bold ${riskColor}`}>{riskLevel}</span>
        </div>
      </div>
    )
  }
  return null
}

const chartConfig = {
  score: {
    label: "Trust Score",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function RiskScoreChart({
  data = defaultData,
  currentScore,
  status,
  bare = false,
}: RiskScoreChartProps) {
  const chartData = data && data.length > 0 ? data : defaultData

  // Resolve current score
  const resolvedScore = currentScore !== undefined 
    ? currentScore 
    : (chartData[chartData.length - 1]?.score ?? 98)

  // Resolve status
  const resolvedStatus = status !== undefined
    ? status
    : getRiskLevel(resolvedScore)

  // Badge styling
  let badgeClass = "bg-primary/10 text-primary"
  if (resolvedStatus === "High Risk") {
    badgeClass = "bg-error-container text-on-error-container"
  } else if (resolvedStatus === "Medium Risk") {
    badgeClass = "bg-tertiary-container text-on-tertiary-container"
  }

  return (
    <div className={bare ? "w-full flex flex-col" : "w-full flex flex-col bg-card rounded-2xl p-4.5 shadow-sm"}>
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4 w-full">
        <div className="text-left">
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider select-none">
            Trust Score Trend
          </p>
          <p className="text-base font-black text-foreground leading-none mt-1">
            {resolvedScore}
            <span className="text-[10px] text-muted-foreground/60 font-medium">/100</span>
          </p>
        </div>
        <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-full ${badgeClass} select-none`}>
          {resolvedStatus}
        </span>
      </div>

      {/* Chart Visualization */}
      <div className="h-[150px] w-full md:h-[170px] relative">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="score-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.14} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="var(--muted)"
              opacity={0.6}
            />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
              dy={8}
            />

            <YAxis hide domain={[0, 100]} />

            <ReferenceLine
              y={80}
              stroke="var(--primary)"
              strokeDasharray="4 4"
              strokeOpacity={0.4}
              label={{
                value: "Safe Zone",
                position: "insideBottomLeft",
                fill: "var(--primary)",
                fontSize: 8,
                fontWeight: "bold",
                opacity: 0.6,
                offset: 5,
              }}
            />

            <ChartTooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="score"
              stroke="var(--primary)"
              strokeWidth={3}
              fill="url(#score-gradient)"
              activeDot={{
                r: 4.5,
                strokeWidth: 0,
                fill: "var(--primary)",
              }}
              dot={({ cx, cy, index }) => {
                if (index === chartData.length - 1) {
                  return (
                    <g key={`last-dot-${index}`}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={8}
                        fill="var(--primary)"
                        fillOpacity={0.15}
                        className="animate-pulse"
                      />
                      <circle cx={cx} cy={cy} r={3.5} fill="var(--primary)" />
                    </g>
                  )
                }
                return null
              }}
            />
          </AreaChart>
        </ChartContainer>
      </div>

      {/* Legend mini */}
      <div className="flex justify-center items-center gap-3 mt-3 text-[9px] text-muted-foreground/55 font-semibold select-none">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          0–49
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          50–79
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          80–100
        </span>
      </div>
    </div>
  )
}
