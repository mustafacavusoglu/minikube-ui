"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ResourceList } from "@/components/dashboard/resource-list"
import { Badge } from "@/components/ui/badge"
import { useSecrets } from "@/hooks/use-resource"
import { useNamespace } from "@/contexts/namespace-context"
import { deleteSecret } from "@/lib/api-client"

export default function SecretsPage() {
  const { namespace } = useNamespace()
  const { data: secrets = [], isLoading, mutate } = useSecrets(namespace)

  const columns = [
    { key: "name", label: "Name", render: (s: any) => <span className="font-medium text-foreground">{s.name}</span> },
    { key: "namespace", label: "Namespace", render: (s: any) => <Badge variant="outline" className="bg-secondary/50">{s.namespace}</Badge> },
    { key: "type", label: "Type", render: (s: any) => <span className="font-mono text-xs text-muted-foreground">{s.type}</span> },
    { key: "dataKeys", label: "Keys", render: (s: any) => <span className="text-muted-foreground">{(s.dataKeys || []).join(", ") || "-"}</span> },
    { key: "age", label: "Age", render: (s: any) => <span className="text-muted-foreground">{s.age}</span> },
  ]

  return (
    <DashboardLayout title="Secrets" description="Secrets store sensitive data like passwords and tokens.">
      <ResourceList
        data={secrets}
        columns={columns}
        resourceName="Secrets"
        filterByNamespace={true}
        getNamespace={(s: any) => s.namespace}
        getName={(s: any) => s.name}
        loading={isLoading}
        getDetailHref={(s: any) => `/config/secrets/${s.namespace}/${s.name}`}
        onRefresh={() => mutate()}
        onDelete={async (s: any) => {
          if (confirm(`Delete secret ${s.name}?`)) { await deleteSecret(s.namespace, s.name); mutate() }
        }}
      />
    </DashboardLayout>
  )
}
