"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ResourceList, StatusBadge } from "@/components/dashboard/resource-list"
import { Badge } from "@/components/ui/badge"
import { usePVCs } from "@/hooks/use-resource"
import { useNamespace } from "@/contexts/namespace-context"
import { deletePVC } from "@/lib/api-client"

export default function PVCsPage() {
  const { namespace } = useNamespace()
  const { data: pvcs = [], isLoading, mutate } = usePVCs(namespace)
  const effectiveNs = namespace === 'All Namespaces' ? 'default' : namespace

  const columns = [
    { key: "name", label: "Name", render: (p: any) => <span className="font-medium text-foreground">{p.name}</span> },
    { key: "namespace", label: "Namespace", render: (p: any) => <Badge variant="outline" className="bg-secondary/50">{p.namespace}</Badge> },
    { key: "status", label: "Status", render: (p: any) => <StatusBadge status={p.status} /> },
    { key: "volume", label: "Volume", render: (p: any) => <span className="text-muted-foreground font-mono text-xs">{p.volume}</span> },
    { key: "capacity", label: "Capacity", render: (p: any) => <span className="text-muted-foreground">{p.capacity}</span> },
    { key: "accessModes", label: "Access Modes", render: (p: any) => <span className="text-muted-foreground text-xs">{(p.accessModes || []).join(", ")}</span> },
    { key: "storageClass", label: "Storage Class", render: (p: any) => <span className="text-muted-foreground">{p.storageClass}</span> },
    { key: "age", label: "Age", render: (p: any) => <span className="text-muted-foreground">{p.age}</span> },
  ]

  return (
    <DashboardLayout title="PersistentVolumeClaims" description="PVCs request storage resources.">
      <ResourceList
        data={pvcs}
        columns={columns}
        resourceName="PVCs"
        resourceKind="pvcs"
        createResourceKind="pvcs"
        defaultNamespace={effectiveNs}
        filterByNamespace={true}
        getNamespace={(p: any) => p.namespace}
        getName={(p: any) => p.name}
        loading={isLoading}
        getDetailHref={(p: any) => `/storage/pvcs/${p.namespace}/${p.name}`}
        onRefresh={() => mutate()}
        onDelete={async (p: any) => {
          if (confirm(`Delete PVC ${p.name}?`)) { await deletePVC(p.namespace, p.name); mutate() }
        }}
      />
    </DashboardLayout>
  )
}
