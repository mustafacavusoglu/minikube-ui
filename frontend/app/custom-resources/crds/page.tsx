"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ResourceList } from "@/components/dashboard/resource-list"
import { Badge } from "@/components/ui/badge"
import { useCRDs } from "@/hooks/use-resource"

export default function CRDsPage() {
  const { data: crds = [], isLoading, mutate } = useCRDs()

  const columns = [
    { key: "name", label: "Name", render: (c: any) => <span className="font-medium text-foreground">{c.name}</span> },
    { key: "group", label: "Group", render: (c: any) => <span className="font-mono text-xs text-muted-foreground">{c.group}</span> },
    { key: "version", label: "Version", render: (c: any) => <span className="text-muted-foreground">{c.version}</span> },
    { key: "scope", label: "Scope", render: (c: any) => <Badge variant="outline" className="bg-secondary/50">{c.scope}</Badge> },
    { key: "kind", label: "Kind", render: (c: any) => <span className="text-foreground">{c.kind}</span> },
    { key: "established", label: "Status", render: (c: any) => <Badge variant="outline" className={c.established ? "text-success border-success/30" : "text-warning border-warning/30"}>{c.established ? "Established" : "Not Ready"}</Badge> },
    { key: "age", label: "Age", render: (c: any) => <span className="text-muted-foreground">{c.age}</span> },
  ]

  return (
    <DashboardLayout title="Custom Resource Definitions" description="CRDs extend Kubernetes with custom resource types.">
      <ResourceList
        data={crds}
        columns={columns}
        resourceName="CRDs"
        filterByNamespace={false}
        loading={isLoading}
        onRefresh={() => mutate()}
      />
    </DashboardLayout>
  )
}
