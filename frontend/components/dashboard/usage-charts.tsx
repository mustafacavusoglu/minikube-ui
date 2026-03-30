"use client"

import { Card } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { useCpuHistory, useMemoryHistory, usePods, useNamespaces } from "@/hooks/use-resource"
import { useNamespace } from "@/contexts/namespace-context"

const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-md px-3 py-2 shadow-lg">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{payload[0].value}%</p>
      </div>
    )
  }
  return null
}

export function UsageCharts() {
  const { data: cpuResult } = useCpuHistory()
  const { data: memoryResult } = useMemoryHistory()
  const { data: allPods = [] } = usePods()
  const { data: namespaceList = [] } = useNamespaces()

  const cpuData = (cpuResult?.data || []).filter((d: any) => d.value !== null)
  const memoryData = (memoryResult?.data || []).filter((d: any) => d.value !== null)
  const metricsAvailable = cpuResult?.available

  // Compute namespace distribution from live pod data
  const nsCounts: Record<string, number> = {}
  for (const pod of allPods as any[]) {
    if (pod.namespace) {
      nsCounts[pod.namespace] = (nsCounts[pod.namespace] || 0) + 1
    }
  }
  const namespaceDistribution = Object.entries(nsCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* CPU Usage Chart */}
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">CPU Usage (24h)</h3>
          <span className="text-xs text-muted-foreground font-mono">
            {metricsAvailable ? (cpuData.length ? `${cpuData[cpuData.length - 1].value}%` : '-') : 'metrics-server required'}
          </span>
        </div>
        <div className="h-48">
          {metricsAvailable && cpuData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpuData}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="time" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={{ stroke: 'var(--border)' }} tickLine={{ stroke: 'var(--border)' }} />
                <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={{ stroke: 'var(--border)' }} tickLine={{ stroke: 'var(--border)' }} unit="%" domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="var(--chart-2)" strokeWidth={2} fill="url(#cpuGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm">
              <p>Enable metrics-server:</p>
              <code className="text-xs font-mono mt-1 bg-secondary px-2 py-1 rounded">
                minikube addons enable metrics-server
              </code>
            </div>
          )}
        </div>
      </Card>

      {/* Memory Usage Chart */}
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Memory Usage (24h)</h3>
          <span className="text-xs text-muted-foreground font-mono">
            {metricsAvailable ? (memoryData.length ? `${memoryData[memoryData.length - 1].value}%` : '-') : 'metrics-server required'}
          </span>
        </div>
        <div className="h-48">
          {metricsAvailable && memoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={memoryData}>
                <defs>
                  <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="time" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={{ stroke: 'var(--border)' }} tickLine={{ stroke: 'var(--border)' }} />
                <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={{ stroke: 'var(--border)' }} tickLine={{ stroke: 'var(--border)' }} unit="%" domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="var(--chart-1)" strokeWidth={2} fill="url(#memoryGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm">
              <p>Enable metrics-server:</p>
              <code className="text-xs font-mono mt-1 bg-secondary px-2 py-1 rounded">
                minikube addons enable metrics-server
              </code>
            </div>
          )}
        </div>
      </Card>

      {/* Namespace Distribution */}
      <Card className="p-4 bg-card border-border">
        <h3 className="font-semibold text-foreground mb-4">Pods by Namespace</h3>
        <div className="h-48 flex items-center">
          {namespaceDistribution.length > 0 ? (
            <>
              <ResponsiveContainer width="55%" height="100%">
                <PieChart>
                  <Pie data={namespaceDistribution} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value">
                    {namespaceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload
                      return (
                        <div className="bg-popover border border-border rounded-md px-3 py-2 shadow-lg">
                          <p className="text-xs text-muted-foreground">{d.name}</p>
                          <p className="text-sm font-medium text-foreground">{d.value} pods</p>
                        </div>
                      )
                    }
                    return null
                  }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {namespaceDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground truncate flex-1">{item.name}</span>
                    <span className="font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center w-full text-muted-foreground text-sm">No pod data</div>
          )}
        </div>
      </Card>
    </div>
  )
}
