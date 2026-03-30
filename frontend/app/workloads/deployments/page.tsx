"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ResourceList } from "@/components/dashboard/resource-list"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useDeployments } from "@/hooks/use-resource"
import { useNamespace } from "@/contexts/namespace-context"
import { deleteDeployment } from "@/lib/api-client"

export default function DeploymentsPage() {
  const { namespace } = useNamespace()
  const { data: deployments = [], isLoading, mutate } = useDeployments(namespace)

  const columns = [
    { key: "name", label: "Name", render: (d: any) => <span className="font-medium text-foreground">{d.name}</span> },
    { key: "namespace", label: "Namespace", render: (d: any) => <Badge variant="outline" className="bg-secondary/50">{d.namespace}</Badge> },
    { key: "replicas", label: "Replicas", render: (d: any) => (
      <span className={cn("font-medium", d.availableReplicas === d.desiredReplicas ? "text-success" : d.availableReplicas > 0 ? "text-warning" : "text-destructive")}>{d.replicas}</span>
    )},
    { key: "strategy", label: "Strategy", render: (d: any) => <Badge variant="outline" className="bg-info/20 text-info border-info/30">{d.strategy}</Badge> },
    { key: "image", label: "Image", render: (d: any) => <span className="text-muted-foreground font-mono text-xs truncate max-w-[200px] block">{d.image}</span> },
    { key: "age", label: "Age", render: (d: any) => <span className="text-muted-foreground">{d.age}</span> },
  ]

  return (
    <DashboardLayout title="Deployments" description="Deployments manage stateless application replicas.">
      <ResourceList
        data={deployments}
        columns={columns}
        resourceName="Deployments"
        resourceKind="deployments"
        filterByNamespace={true}
        getNamespace={(d: any) => d.namespace}
        getName={(d: any) => d.name}
        loading={isLoading}
        getDetailHref={(d: any) => `/workloads/deployments/${d.namespace}/${d.name}`}
        onRefresh={() => mutate()}
        onDelete={async (d: any) => {
          if (confirm(`Delete deployment ${d.name}?`)) { await deleteDeployment(d.namespace, d.name); mutate() }
        }}
      />
    </DashboardLayout>
  )
}
