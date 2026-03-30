"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ResourceList, StatusBadge } from "@/components/dashboard/resource-list"
import { useNamespaces } from "@/hooks/use-resource"

export default function NamespacesPage() {
  const { data: namespaces = [], isLoading, mutate } = useNamespaces()

  const columns = [
    { key: "name", label: "Name", render: (n: any) => <span className="font-medium text-foreground">{n.name}</span> },
    { key: "status", label: "Status", render: (n: any) => <StatusBadge status={n.status} /> },
    { key: "podCount", label: "Pods", render: (n: any) => <span className="text-muted-foreground">{n.podCount}</span> },
    { key: "createdAt", label: "Age", render: (n: any) => <span className="text-muted-foreground">{n.createdAt}</span> },
  ]

  return (
    <DashboardLayout title="Namespaces" description="Namespaces provide a mechanism for isolating groups of resources.">
      <ResourceList
        data={namespaces}
        columns={columns}
        resourceName="Namespaces"
        createResourceKind="namespaces"
        filterByNamespace={false}
        loading={isLoading}
        onRefresh={() => mutate()}
      />
    </DashboardLayout>
  )
}
