"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ResourceList, TypeBadge } from "@/components/dashboard/resource-list"
import { Badge } from "@/components/ui/badge"
import { useServices } from "@/hooks/use-resource"
import { useNamespace } from "@/contexts/namespace-context"
import { deleteService } from "@/lib/api-client"

export default function ServicesPage() {
  const { namespace } = useNamespace()
  const { data: services = [], isLoading, mutate } = useServices(namespace)
  const effectiveNs = namespace === 'All Namespaces' ? 'default' : namespace

  const columns = [
    { key: "name", label: "Name", render: (s: any) => <span className="font-medium text-foreground">{s.name}</span> },
    { key: "namespace", label: "Namespace", render: (s: any) => <Badge variant="outline" className="bg-secondary/50">{s.namespace}</Badge> },
    { key: "type", label: "Type", render: (s: any) => <TypeBadge type={s.type} /> },
    { key: "clusterIP", label: "Cluster IP", render: (s: any) => <span className="font-mono text-xs text-muted-foreground">{s.clusterIP}</span> },
    { key: "externalIP", label: "External IP", render: (s: any) => <span className="font-mono text-xs text-muted-foreground">{s.externalIP || "-"}</span> },
    { key: "ports", label: "Ports", render: (s: any) => <span className="font-mono text-xs text-muted-foreground">{s.ports}</span> },
    { key: "age", label: "Age", render: (s: any) => <span className="text-muted-foreground">{s.age}</span> },
  ]

  return (
    <DashboardLayout title="Services" description="Services expose pods as a network service.">
      <ResourceList
        data={services}
        columns={columns}
        resourceName="Services"
        resourceKind="services"
        createResourceKind="services"
        defaultNamespace={effectiveNs}
        filterByNamespace={true}
        getNamespace={(s: any) => s.namespace}
        getName={(s: any) => s.name}
        loading={isLoading}
        getDetailHref={(s: any) => `/networking/services/${s.namespace}/${s.name}`}
        onRefresh={() => mutate()}
        onDelete={async (s: any) => {
          if (confirm(`Delete service ${s.name}?`)) { await deleteService(s.namespace, s.name); mutate() }
        }}
      />
    </DashboardLayout>
  )
}
