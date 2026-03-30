"use client"

import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { ResourceDetailLayout } from "@/components/detail/resource-detail-layout"
import { Card } from "@/components/ui/card"
import { useConfigMap } from "@/hooks/use-resource"
import { deleteConfigMap } from "@/lib/api-client"

export default function ConfigMapDetailPage() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>()
  const router = useRouter()
  const { data: cm, isLoading, mutate } = useConfigMap(namespace, name)

  const dataEntries = Object.entries(cm?.data || {})

  return (
    <ResourceDetailLayout
      resource={cm}
      isLoading={isLoading}
      backHref="/config/configmaps"
      backLabel="ConfigMaps"
      namespace={namespace}
      resourceKind="configmaps"
      extraFields={[
        { label: "Keys", value: `${dataEntries.length} keys` },
      ]}
      detailsExtra={dataEntries.length > 0 && (
        <Card className="p-5 bg-card border-border">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Data</h3>
          <div className="space-y-3">
            {dataEntries.map(([key, val]) => (
              <div key={key}>
                <div className="text-xs font-medium text-primary mb-1 font-mono">{key}</div>
                <pre className="bg-[#0d1117] text-[#c9d1d9] text-xs font-mono p-3 rounded border border-border overflow-auto max-h-48 whitespace-pre-wrap break-all">
                  {String(val)}
                </pre>
              </div>
            ))}
          </div>
        </Card>
      )}
      onRefresh={() => mutate()}
      onDelete={async () => {
        if (!confirm(`Delete configmap ${name}?`)) return
        await deleteConfigMap(namespace, name)
        router.push('/config/configmaps')
      }}
      onSaved={() => mutate()}
    />
  )
}
