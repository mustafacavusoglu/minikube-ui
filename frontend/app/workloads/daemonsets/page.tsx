"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ResourceList } from "@/components/dashboard/resource-list"
import { Badge } from "@/components/ui/badge"
import { useDaemonSets } from "@/hooks/use-resource"
import { useNamespace } from "@/contexts/namespace-context"
import { deleteDaemonSet } from "@/lib/api-client"

export default function DaemonSetsPage() {
  const { namespace } = useNamespace()
  const { data: daemonSets = [], isLoading, mutate } = useDaemonSets(namespace)

  const columns = [
    { key: "name", label: "Name", render: (d: any) => <span className="font-medium text-foreground">{d.name}</span> },
    { key: "namespace", label: "Namespace", render: (d: any) => <Badge variant="outline" className="bg-secondary/50">{d.namespace}</Badge> },
    { key: "desired", label: "Desired", render: (d: any) => <span className="text-muted-foreground">{d.desired}</span> },
    { key: "current", label: "Current", render: (d: any) => <span className="text-muted-foreground">{d.current}</span> },
    { key: "ready", label: "Ready", render: (d: any) => <span className="text-success font-medium">{d.ready}</span> },
    { key: "available", label: "Available", render: (d: any) => <span className="text-muted-foreground">{d.available}</span> },
    { key: "age", label: "Age", render: (d: any) => <span className="text-muted-foreground">{d.age}</span> },
  ]

  return (
    <DashboardLayout title="DaemonSets" description="DaemonSets ensure a pod runs on every node.">
      <ResourceList
        data={daemonSets}
        columns={columns}
        resourceName="DaemonSets"
        resourceKind="daemonsets"
        filterByNamespace={true}
        getNamespace={(d: any) => d.namespace}
        getName={(d: any) => d.name}
        loading={isLoading}
        getDetailHref={(d: any) => `/workloads/daemonsets/${d.namespace}/${d.name}`}
        onRefresh={() => mutate()}
        onDelete={async (d: any) => {
          if (confirm(`Delete daemonset ${d.name}?`)) { await deleteDaemonSet(d.namespace, d.name); mutate() }
        }}
      />
    </DashboardLayout>
  )
}
