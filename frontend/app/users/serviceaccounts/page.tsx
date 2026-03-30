"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ResourceList } from "@/components/dashboard/resource-list"
import { Badge } from "@/components/ui/badge"
import { useServiceAccounts } from "@/hooks/use-resource"
import { useNamespace } from "@/contexts/namespace-context"
import { deleteServiceAccount } from "@/lib/api-client"

export default function ServiceAccountsPage() {
  const { namespace } = useNamespace()
  const { data: serviceAccounts = [], isLoading, mutate } = useServiceAccounts(namespace)
  const effectiveNs = namespace === 'All Namespaces' ? 'default' : namespace

  const columns = [
    { key: "name", label: "Name", render: (s: any) => <span className="font-medium text-foreground">{s.name}</span> },
    { key: "namespace", label: "Namespace", render: (s: any) => <Badge variant="outline" className="bg-secondary/50">{s.namespace}</Badge> },
    { key: "secrets", label: "Secrets", render: (s: any) => <span className="text-muted-foreground">{s.secrets}</span> },
    { key: "age", label: "Age", render: (s: any) => <span className="text-muted-foreground">{s.age}</span> },
  ]

  return (
    <DashboardLayout title="ServiceAccounts" description="ServiceAccounts provide identities for pods.">
      <ResourceList
        data={serviceAccounts}
        columns={columns}
        resourceName="ServiceAccounts"
        resourceKind="serviceaccounts"
        createResourceKind="serviceaccounts"
        defaultNamespace={effectiveNs}
        filterByNamespace={true}
        getNamespace={(s: any) => s.namespace}
        getName={(s: any) => s.name}
        loading={isLoading}
        getDetailHref={(s: any) => `/users/serviceaccounts/${s.namespace}/${s.name}`}
        onRefresh={() => mutate()}
        onDelete={async (s: any) => {
          if (confirm(`Delete serviceaccount ${s.name}?`)) { await deleteServiceAccount(s.namespace, s.name); mutate() }
        }}
      />
    </DashboardLayout>
  )
}
