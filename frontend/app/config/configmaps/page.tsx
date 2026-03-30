"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ResourceList } from "@/components/dashboard/resource-list"
import { Badge } from "@/components/ui/badge"
import { useConfigMaps } from "@/hooks/use-resource"
import { useNamespace } from "@/contexts/namespace-context"
import { deleteConfigMap } from "@/lib/api-client"

export default function ConfigMapsPage() {
  const { namespace } = useNamespace()
  const { data: configMaps = [], isLoading, mutate } = useConfigMaps(namespace)

  const columns = [
    { key: "name", label: "Name", render: (c: any) => <span className="font-medium text-foreground">{c.name}</span> },
    { key: "namespace", label: "Namespace", render: (c: any) => <Badge variant="outline" className="bg-secondary/50">{c.namespace}</Badge> },
    { key: "data", label: "Keys", render: (c: any) => <span className="text-muted-foreground">{Object.keys(c.data || {}).length} keys</span> },
    { key: "age", label: "Age", render: (c: any) => <span className="text-muted-foreground">{c.age}</span> },
  ]

  return (
    <DashboardLayout title="ConfigMaps" description="ConfigMaps store non-sensitive configuration data.">
      <ResourceList
        data={configMaps}
        columns={columns}
        resourceName="ConfigMaps"
        resourceKind="configmaps"
        filterByNamespace={true}
        getNamespace={(c: any) => c.namespace}
        getName={(c: any) => c.name}
        loading={isLoading}
        getDetailHref={(c: any) => `/config/configmaps/${c.namespace}/${c.name}`}
        onRefresh={() => mutate()}
        onDelete={async (c: any) => {
          if (confirm(`Delete configmap ${c.name}?`)) { await deleteConfigMap(c.namespace, c.name); mutate() }
        }}
      />
    </DashboardLayout>
  )
}
