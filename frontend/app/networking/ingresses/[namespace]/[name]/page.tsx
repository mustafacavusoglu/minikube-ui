"use client"

import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { ResourceDetailLayout } from "@/components/detail/resource-detail-layout"
import { Card } from "@/components/ui/card"
import { useIngress } from "@/hooks/use-resource"
import { deleteIngress } from "@/lib/api-client"

export default function IngressDetailPage() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>()
  const router = useRouter()
  const { data: ing, isLoading, mutate } = useIngress(namespace, name)

  return (
    <ResourceDetailLayout
      resource={ing}
      isLoading={isLoading}
      backHref="/networking/ingresses"
      backLabel="Ingresses"
      namespace={namespace}
      resourceKind="ingresses"
      extraFields={[
        { label: "Address", value: <span className="font-mono">{ing?.address || "-"}</span> },
        { label: "Ports", value: ing?.ports },
      ]}
      detailsExtra={ing?.hosts?.length > 0 && (
        <Card className="p-5 bg-card border-border">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Hosts</h3>
          <div className="flex flex-wrap gap-2">
            {(ing.hosts || []).map((h: string) => (
              <span key={h} className="px-2 py-1 text-sm font-mono bg-secondary rounded border border-border text-info">{h}</span>
            ))}
          </div>
        </Card>
      )}
      onRefresh={() => mutate()}
      onDelete={async () => {
        if (!confirm(`Delete ingress ${name}?`)) return
        await deleteIngress(namespace, name)
        router.push('/networking/ingresses')
      }}
      onSaved={() => mutate()}
    />
  )
}
