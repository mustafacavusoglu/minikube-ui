"use client"

import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { ResourceDetailLayout } from "@/components/detail/resource-detail-layout"
import { Card } from "@/components/ui/card"
import { useSecret } from "@/hooks/use-resource"
import { deleteSecret } from "@/lib/api-client"
import { Lock } from "lucide-react"

export default function SecretDetailPage() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>()
  const router = useRouter()
  const { data: secret, isLoading, mutate } = useSecret(namespace, name)

  return (
    <ResourceDetailLayout
      resource={secret}
      isLoading={isLoading}
      backHref="/config/secrets"
      backLabel="Secrets"
      namespace={namespace}
      extraFields={[
        { label: "Type", value: <span className="font-mono text-xs">{secret?.type}</span> },
        { label: "Keys", value: `${(secret?.dataKeys || []).length} keys` },
      ]}
      detailsExtra={(secret?.dataKeys || []).length > 0 && (
        <Card className="p-5 bg-card border-border">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Data Keys</h3>
          <div className="space-y-2">
            {(secret.dataKeys || []).map((key: string) => (
              <div key={key} className="flex items-center gap-2 px-3 py-2 rounded bg-secondary/50 border border-border">
                <Lock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="font-mono text-sm text-foreground">{key}</span>
                <span className="ml-auto text-xs text-muted-foreground">value hidden</span>
              </div>
            ))}
          </div>
        </Card>
      )}
      onRefresh={() => mutate()}
      onDelete={async () => {
        if (!confirm(`Delete secret ${name}?`)) return
        await deleteSecret(namespace, name)
        router.push('/config/secrets')
      }}
    />
  )
}
