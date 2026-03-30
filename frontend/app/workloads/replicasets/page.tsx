"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ResourceList } from "@/components/dashboard/resource-list"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useReplicaSets } from "@/hooks/use-resource"
import { useNamespace } from "@/contexts/namespace-context"
import { deleteReplicaSet } from "@/lib/api-client"

export default function ReplicaSetsPage() {
  const { namespace } = useNamespace()
  const { data: replicasets = [], isLoading, mutate } = useReplicaSets(namespace)

  const columns = [
    { key: "name", label: "Name", render: (rs: any) => <span className="font-medium text-foreground">{rs.name}</span> },
    { key: "namespace", label: "Namespace", render: (rs: any) => <Badge variant="outline" className="bg-secondary/50">{rs.namespace}</Badge> },
    { key: "replicas", label: "Replicas", render: (rs: any) => (
      <span className={cn("font-medium", rs.ready === rs.desired ? "text-success" : rs.ready > 0 ? "text-warning" : "text-destructive")}>{rs.replicas}</span>
    )},
    { key: "image", label: "Image", render: (rs: any) => <span className="text-muted-foreground font-mono text-xs truncate max-w-[200px] block">{rs.image}</span> },
    { key: "age", label: "Age", render: (rs: any) => <span className="text-muted-foreground">{rs.age}</span> },
  ]

  return (
    <DashboardLayout title="ReplicaSets" description="ReplicaSets ensure a specified number of pod replicas are running.">
      <ResourceList
        data={replicasets}
        columns={columns}
        resourceName="ReplicaSets"
        resourceKind="replicasets"
        filterByNamespace={true}
        getNamespace={(rs: any) => rs.namespace}
        getName={(rs: any) => rs.name}
        loading={isLoading}
        getDetailHref={(rs: any) => `/workloads/replicasets/${rs.namespace}/${rs.name}`}
        onRefresh={() => mutate()}
        onDelete={async (rs: any) => {
          if (confirm(`Delete replicaset ${rs.name}?`)) { await deleteReplicaSet(rs.namespace, rs.name); mutate() }
        }}
      />
    </DashboardLayout>
  )
}
