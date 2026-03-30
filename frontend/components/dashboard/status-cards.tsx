"use client"

import { Card } from "@/components/ui/card"
import {
  Box,
  Server,
  Network,
  HardDrive,
  CheckCircle,
  XCircle,
  Clock,
  Layers,
  Loader2,
} from "lucide-react"
import { useClusterStats } from "@/hooks/use-resource"

interface StatusCardProps {
  title: string
  icon: React.ReactNode
  total: number
  running: number
  pending?: number
  failed?: number
}

function StatusCard({ title, icon, total, running, pending = 0, failed = 0 }: StatusCardProps) {
  return (
    <Card className="p-4 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-secondary">
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            <p className="text-2xl font-bold text-foreground">{total}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <CheckCircle className="h-3.5 w-3.5 text-success" />
          <span className="text-muted-foreground">{running} Running</span>
        </div>
        {pending > 0 && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-warning" />
            <span className="text-muted-foreground">{pending} Pending</span>
          </div>
        )}
        {failed > 0 && (
          <div className="flex items-center gap-1.5">
            <XCircle className="h-3.5 w-3.5 text-destructive" />
            <span className="text-muted-foreground">{failed} Failed</span>
          </div>
        )}
      </div>
    </Card>
  )
}

export function StatusCards() {
  const { data: stats, isLoading } = useClusterStats()

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4 bg-card border-border flex items-center justify-center min-h-[100px]">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatusCard
        title="Pods"
        icon={<Box className="h-5 w-5 text-primary" />}
        total={stats.pods?.total || 0}
        running={stats.pods?.running || 0}
        pending={stats.pods?.pending || 0}
        failed={stats.pods?.failed || 0}
      />
      <StatusCard
        title="Deployments"
        icon={<Server className="h-5 w-5 text-info" />}
        total={stats.deployments || 0}
        running={stats.deployments || 0}
      />
      <StatusCard
        title="Services"
        icon={<Network className="h-5 w-5 text-success" />}
        total={stats.services || 0}
        running={stats.services || 0}
      />
      <StatusCard
        title="PVCs"
        icon={<HardDrive className="h-5 w-5 text-warning" />}
        total={stats.pvcs || 0}
        running={stats.pvcs || 0}
      />
      <StatusCard
        title="Namespaces"
        icon={<Layers className="h-5 w-5 text-chart-5" />}
        total={stats.namespaces || 0}
        running={stats.namespaces || 0}
      />
    </div>
  )
}
