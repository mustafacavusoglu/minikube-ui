"use client"

import { Card } from "@/components/ui/card"
import {
  Activity,
  CheckCircle,
  AlertTriangle,
  Server,
  Cpu,
  MemoryStick,
  HardDrive,
  Box,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useNodes, useEvents } from "@/hooks/use-resource"
import { useNamespace } from "@/contexts/namespace-context"

interface MetricBarProps {
  label: string
  value: number
  max: number
  unit: string
  icon: React.ReactNode
}

function MetricBar({ label, value, max, unit, icon }: MetricBarProps) {
  if (!max || isNaN(value) || isNaN(max)) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">{icon}<span className="text-muted-foreground">{label}</span></div>
          <span className="font-mono text-xs text-muted-foreground">-</span>
        </div>
        <div className="h-2 bg-secondary rounded-full" />
      </div>
    )
  }
  const percentage = Math.min((value / max) * 100, 100)
  const isHigh = percentage > 80
  const isMedium = percentage > 60

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-muted-foreground">{label}</span>
        </div>
        <span className={cn(
          "font-mono text-xs",
          isHigh ? "text-destructive" : isMedium ? "text-warning" : "text-foreground"
        )}>
          {value}{unit} / {max}{unit} ({percentage.toFixed(0)}%)
        </span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isHigh ? "bg-destructive" : isMedium ? "bg-warning" : "bg-success"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export function ClusterHealth() {
  const { namespace } = useNamespace()
  const { data: nodes = [], isLoading: nodesLoading } = useNodes()
  const { data: events = [], isLoading: eventsLoading } = useEvents(
    namespace === 'All Namespaces' ? undefined : namespace
  )

  const node = nodes[0]
  const recentEvents = events.slice(0, 6)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Node Status */}
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" />
            Node Status
          </h3>
          {node && (
            <span className={cn(
              "flex items-center gap-1.5 text-xs",
              node.status === "Ready" ? "text-success" : "text-destructive"
            )}>
              <CheckCircle className="h-3.5 w-3.5" />
              {node.status}
            </span>
          )}
        </div>
        {nodesLoading ? (
          <div className="flex items-center justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : node ? (
          <div className="space-y-4">
            <div className="p-3 bg-secondary/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-foreground">{node.name}</p>
                  <p className="text-xs text-muted-foreground">{node.roles?.join(", ")}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-success/20 text-success border border-success/30">
                  {node.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Version</p>
                  <p className="font-mono text-foreground">{node.version}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">OS</p>
                  <p className="text-foreground">{node.os}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Runtime</p>
                  <p className="text-foreground">{node.containerRuntime}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Age</p>
                  <p className="text-foreground">{node.age}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Conditions</p>
              <div className="grid grid-cols-2 gap-2">
                {(node.conditions || []).map((condition: any) => (
                  <div
                    key={condition.type}
                    className={cn(
                      "p-2 rounded text-xs flex items-center gap-2",
                      (condition.status === "True" && condition.type === "Ready") ||
                        (condition.status === "False" && condition.type !== "Ready")
                        ? "bg-success/10"
                        : "bg-destructive/10"
                    )}
                  >
                    {(condition.status === "True" && condition.type === "Ready") ||
                      (condition.status === "False" && condition.type !== "Ready") ? (
                      <CheckCircle className="h-3 w-3 text-success" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                    )}
                    <span className="text-foreground">{condition.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No nodes found</p>
        )}
      </Card>

      {/* Resource Usage */}
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Resource Usage
          </h3>
          <span className="text-xs text-muted-foreground">Node capacity</span>
        </div>
        {node ? (
          <div className="space-y-5">
            <MetricBar
              label="CPU"
              value={parseFloat(node.cpu?.used) || 0}
              max={parseFloat(node.cpu?.capacity) || 0}
              unit=" cores"
              icon={<Cpu className="h-4 w-4 text-info" />}
            />
            <MetricBar
              label="Pods"
              value={node.pods?.used || 0}
              max={node.pods?.capacity || 110}
              unit=""
              icon={<Box className="h-4 w-4 text-primary" />}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </Card>

      {/* Recent Events */}
      <Card className="p-4 bg-card border-border lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Recent Events
          </h3>
          <span className="text-xs text-primary cursor-pointer hover:underline">View All Events</span>
        </div>
        {eventsLoading ? (
          <div className="flex items-center justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : recentEvents.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">No recent events</p>
        ) : (
          <div className="space-y-2">
            {recentEvents.map((event: any, index: number) => (
              <EventRow key={index} event={event} />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function EventRow({ event }: { event: any }) {
  const isWarning = event.type === "Warning"

  return (
    <div className={cn(
      "p-3 rounded-lg flex items-start gap-3",
      isWarning ? "bg-destructive/10 border border-destructive/20" : "bg-secondary/50"
    )}>
      {isWarning ? (
        <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
      ) : (
        <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={cn(
            "text-xs font-medium px-1.5 py-0.5 rounded",
            isWarning ? "bg-destructive/20 text-destructive" : "bg-success/20 text-success"
          )}>
            {event.type}
          </span>
          <span className="text-xs font-medium text-foreground">{event.reason}</span>
          <span className="text-xs text-muted-foreground">{event.object}</span>
          {event.count > 1 && (
            <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
              x{event.count}
            </span>
          )}
          <span className="text-xs text-muted-foreground ml-auto">{event.lastSeen}</span>
        </div>
        <p className="text-sm text-foreground/90 truncate">{event.message}</p>
      </div>
    </div>
  )
}
