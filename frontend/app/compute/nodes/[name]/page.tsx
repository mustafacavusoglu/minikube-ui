"use client"

import { useParams } from "next/navigation"
import { ResourceDetailLayout } from "@/components/detail/resource-detail-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNode } from "@/hooks/use-resource"
import { CheckCircle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function NodeDetailPage() {
  const { name } = useParams<{ name: string }>()
  const { data: node, isLoading, mutate } = useNode(name)

  return (
    <ResourceDetailLayout
      resource={node}
      isLoading={isLoading}
      backHref="/compute/nodes"
      backLabel="Nodes"
      statusBadge={node && (
        <Badge variant="outline" className={cn(
          node.status === 'Ready' ? "text-success border-success/30"
          : node.status === 'SchedulingDisabled' ? "text-warning border-warning/30"
          : "text-destructive border-destructive/30"
        )}>
          {node.status}
        </Badge>
      )}
      extraFields={[
        { label: "Roles", value: (node?.roles || []).join(", ") || "worker" },
        { label: "Version", value: <span className="font-mono">{node?.version}</span> },
        { label: "OS", value: node?.os },
        { label: "Kernel", value: <span className="font-mono text-xs">{node?.kernel}</span> },
        { label: "Runtime", value: <span className="font-mono text-xs">{node?.containerRuntime}</span> },
        { label: "CPU (allocatable)", value: node?.cpu?.allocatable },
        { label: "Memory (allocatable)", value: node?.memory?.allocatable },
        { label: "Pods (capacity)", value: node?.pods?.capacity },
      ]}
      detailsExtra={node?.conditions?.length > 0 && (
        <Card className="p-5 bg-card border-border">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Conditions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(node.conditions || []).map((cond: any) => {
              const good = (cond.type === 'Ready' && cond.status === 'True')
                || (cond.type !== 'Ready' && cond.status === 'False')
              return (
                <div key={cond.type} className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border",
                  good ? "bg-success/5 border-success/20" : "bg-destructive/5 border-destructive/20"
                )}>
                  {good
                    ? <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    : <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  }
                  <div>
                    <p className="text-sm font-medium text-foreground">{cond.type}</p>
                    {cond.message && (
                      <p className="text-xs text-muted-foreground mt-0.5">{cond.message}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
      onRefresh={() => mutate()}
    />
  )
}
