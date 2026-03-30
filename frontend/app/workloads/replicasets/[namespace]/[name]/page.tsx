"use client"

import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { ResourceDetailLayout } from "@/components/detail/resource-detail-layout"
import { Badge } from "@/components/ui/badge"
import { useReplicaSet } from "@/hooks/use-resource"
import { deleteReplicaSet } from "@/lib/api-client"
import { cn } from "@/lib/utils"

export default function ReplicaSetDetailPage() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>()
  const router = useRouter()
  const { data: rs, isLoading, mutate } = useReplicaSet(namespace, name)

  const healthy = rs?.ready === rs?.desired

  return (
    <ResourceDetailLayout
      resource={rs}
      isLoading={isLoading}
      backHref="/workloads/replicasets"
      backLabel="ReplicaSets"
      namespace={namespace}
      resourceKind="replicasets"
      statusBadge={rs && (
        <Badge variant="outline" className={cn(healthy ? "text-success border-success/30" : "text-warning border-warning/30")}>
          {rs.replicas}
        </Badge>
      )}
      extraFields={[
        { label: "Image", value: <span className="font-mono text-xs break-all">{rs?.image}</span> },
        { label: "Available", value: rs?.available },
        { label: "Ready", value: rs?.ready },
        { label: "Desired", value: rs?.desired },
      ]}
      onRefresh={() => mutate()}
      onDelete={async () => {
        if (!confirm(`Delete replicaset ${name}?`)) return
        await deleteReplicaSet(namespace, name)
        router.push('/workloads/replicasets')
      }}
      onSaved={() => mutate()}
    />
  )
}
