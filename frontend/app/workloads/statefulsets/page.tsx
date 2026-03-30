"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ResourceList } from "@/components/dashboard/resource-list"
import { Badge } from "@/components/ui/badge"
import { useStatefulSets } from "@/hooks/use-resource"
import { useNamespace } from "@/contexts/namespace-context"
import { deleteStatefulSet } from "@/lib/api-client"

export default function StatefulSetsPage() {
  const { namespace } = useNamespace()
  const { data: statefulSets = [], isLoading, mutate } = useStatefulSets(namespace)

  const columns = [
    { key: "name", label: "Name", render: (s: any) => <span className="font-medium text-foreground">{s.name}</span> },
    { key: "namespace", label: "Namespace", render: (s: any) => <Badge variant="outline" className="bg-secondary/50">{s.namespace}</Badge> },
    { key: "ready", label: "Ready", render: (s: any) => <span className="text-success font-medium">{s.ready}</span> },
    { key: "image", label: "Image", render: (s: any) => <span className="text-muted-foreground font-mono text-xs">{s.image}</span> },
    { key: "age", label: "Age", render: (s: any) => <span className="text-muted-foreground">{s.age}</span> },
  ]

  return (
    <DashboardLayout title="StatefulSets" description="StatefulSets manage stateful applications with stable identities.">
      <ResourceList
        data={statefulSets}
        columns={columns}
        resourceName="StatefulSets"
        resourceKind="statefulsets"
        filterByNamespace={true}
        getNamespace={(s: any) => s.namespace}
        getName={(s: any) => s.name}
        loading={isLoading}
        getDetailHref={(s: any) => `/workloads/statefulsets/${s.namespace}/${s.name}`}
        onRefresh={() => mutate()}
        onDelete={async (s: any) => {
          if (confirm(`Delete statefulset ${s.name}?`)) { await deleteStatefulSet(s.namespace, s.name); mutate() }
        }}
      />
    </DashboardLayout>
  )
}
