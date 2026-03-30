"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ResourceList } from "@/components/dashboard/resource-list"
import { Badge } from "@/components/ui/badge"
import { useIngresses } from "@/hooks/use-resource"
import { useNamespace } from "@/contexts/namespace-context"
import { deleteIngress } from "@/lib/api-client"

export default function IngressesPage() {
  const { namespace } = useNamespace()
  const { data: ingresses = [], isLoading, mutate } = useIngresses(namespace)
  const effectiveNs = namespace === 'All Namespaces' ? 'default' : namespace

  const columns = [
    { key: "name", label: "Name", render: (i: any) => <span className="font-medium text-foreground">{i.name}</span> },
    { key: "namespace", label: "Namespace", render: (i: any) => <Badge variant="outline" className="bg-secondary/50">{i.namespace}</Badge> },
    { key: "hosts", label: "Hosts", render: (i: any) => (
      <div className="flex flex-wrap gap-1">
        {(i.hosts || []).map((h: string) => <span key={h} className="text-xs text-info bg-info/10 px-2 py-0.5 rounded">{h}</span>)}
      </div>
    )},
    { key: "address", label: "Address", render: (i: any) => <span className="font-mono text-xs text-muted-foreground">{i.address}</span> },
    { key: "ports", label: "Ports", render: (i: any) => <span className="text-muted-foreground">{i.ports}</span> },
    { key: "age", label: "Age", render: (i: any) => <span className="text-muted-foreground">{i.age}</span> },
  ]

  return (
    <DashboardLayout title="Ingresses" description="Ingresses expose HTTP and HTTPS routes from outside the cluster.">
      <ResourceList
        data={ingresses}
        columns={columns}
        resourceName="Ingresses"
        resourceKind="ingresses"
        createResourceKind="ingresses"
        defaultNamespace={effectiveNs}
        filterByNamespace={true}
        getNamespace={(i: any) => i.namespace}
        getName={(i: any) => i.name}
        getDetailHref={(i: any) => `/networking/ingresses/${i.namespace}/${i.name}`}
        loading={isLoading}
        onRefresh={() => mutate()}
        onDelete={async (i: any) => {
          if (confirm(`Delete ingress ${i.name}?`)) { await deleteIngress(i.namespace, i.name); mutate() }
        }}
      />
    </DashboardLayout>
  )
}
