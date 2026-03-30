"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ResourceList, StatusBadge } from "@/components/dashboard/resource-list"
import { Badge } from "@/components/ui/badge"
import { usePods } from "@/hooks/use-resource"
import { useNamespace } from "@/contexts/namespace-context"
import { deletePod } from "@/lib/api-client"

export default function PodsPage() {
  const { namespace } = useNamespace()
  const { data: pods = [], isLoading, mutate } = usePods(namespace)
  const effectiveNs = namespace === 'All Namespaces' ? 'default' : namespace

  const columns = [
    {
      key: "name", label: "Name",
      render: (pod: any) => <span className="font-medium text-foreground">{pod.name}</span>,
    },
    {
      key: "namespace", label: "Namespace",
      render: (pod: any) => <Badge variant="outline" className="bg-secondary/50">{pod.namespace}</Badge>,
    },
    {
      key: "status", label: "Status",
      render: (pod: any) => <StatusBadge status={pod.status} />,
    },
    {
      key: "ready", label: "Ready",
      render: (pod: any) => <span className="text-muted-foreground">{pod.ready}</span>,
    },
    {
      key: "restarts", label: "Restarts",
      render: (pod: any) => <span className={pod.restarts > 5 ? "text-destructive" : "text-muted-foreground"}>{pod.restarts}</span>,
    },
    {
      key: "cpu", label: "CPU",
      render: (pod: any) => <span className="text-muted-foreground font-mono text-xs">{pod.cpu}</span>,
    },
    {
      key: "memory", label: "Memory",
      render: (pod: any) => <span className="text-muted-foreground font-mono text-xs">{pod.memory}</span>,
    },
    {
      key: "node", label: "Node",
      render: (pod: any) => <span className="text-muted-foreground">{pod.node}</span>,
    },
    {
      key: "age", label: "Age",
      render: (pod: any) => <span className="text-muted-foreground">{pod.age}</span>,
    },
  ]

  return (
    <DashboardLayout title="Pods" description="A Pod is the smallest deployable unit in Kubernetes.">
      <ResourceList
        data={pods}
        columns={columns}
        resourceName="Pods"
        resourceKind="pods"
        createResourceKind="pods"
        defaultNamespace={effectiveNs}
        filterByNamespace={true}
        getNamespace={(pod: any) => pod.namespace}
        getName={(pod: any) => pod.name}
        loading={isLoading}
        showTerminal={true}
        getDetailHref={(pod: any) => `/workloads/pods/${pod.namespace}/${pod.name}`}
        onRefresh={() => mutate()}
        onDelete={async (pod: any) => {
          if (confirm(`Delete pod ${pod.name}?`)) {
            await deletePod(pod.namespace, pod.name)
            mutate()
          }
        }}
      />
    </DashboardLayout>
  )
}
