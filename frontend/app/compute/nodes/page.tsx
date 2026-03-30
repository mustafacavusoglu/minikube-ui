"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ResourceList, StatusBadge } from "@/components/dashboard/resource-list"
import { Badge } from "@/components/ui/badge"
import { useNodes } from "@/hooks/use-resource"

export default function NodesPage() {
  const { data: nodes = [], isLoading, mutate } = useNodes()

  const columns = [
    { key: "name", label: "Name", render: (n: any) => <span className="font-medium text-foreground">{n.name}</span> },
    { key: "status", label: "Status", render: (n: any) => <StatusBadge status={n.status} /> },
    { key: "roles", label: "Roles", render: (n: any) => (
      <div className="flex gap-1">
        {(n.roles || []).map((r: string) => <Badge key={r} variant="outline" className="bg-secondary/50 text-xs">{r}</Badge>)}
      </div>
    )},
    { key: "version", label: "Version", render: (n: any) => <span className="font-mono text-xs text-muted-foreground">{n.version}</span> },
    { key: "os", label: "OS", render: (n: any) => <span className="text-muted-foreground text-xs">{n.os}</span> },
    { key: "containerRuntime", label: "Runtime", render: (n: any) => <span className="font-mono text-xs text-muted-foreground">{n.containerRuntime}</span> },
    { key: "cpu", label: "CPU", render: (n: any) => <span className="text-muted-foreground">{n.cpu?.allocatable || "-"}</span> },
    { key: "age", label: "Age", render: (n: any) => <span className="text-muted-foreground">{n.age}</span> },
  ]

  return (
    <DashboardLayout title="Nodes" description="Nodes are the worker machines in the cluster.">
      <ResourceList
        data={nodes}
        columns={columns}
        resourceName="Nodes"
        filterByNamespace={false}
        loading={isLoading}
        getDetailHref={(n: any) => `/compute/nodes/${n.name}`}
        onRefresh={() => mutate()}
      />
    </DashboardLayout>
  )
}
