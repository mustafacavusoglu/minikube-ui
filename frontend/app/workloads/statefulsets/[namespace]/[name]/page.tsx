"use client"

import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { ResourceDetailLayout } from "@/components/detail/resource-detail-layout"
import { useStatefulSet } from "@/hooks/use-resource"
import { deleteStatefulSet } from "@/lib/api-client"

export default function StatefulSetDetailPage() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>()
  const router = useRouter()
  const { data: ss, isLoading, mutate } = useStatefulSet(namespace, name)

  return (
    <ResourceDetailLayout
      resource={ss}
      isLoading={isLoading}
      backHref="/workloads/statefulsets"
      backLabel="StatefulSets"
      namespace={namespace}
      resourceKind="statefulsets"
      extraFields={[
        { label: "Ready", value: <span className="text-success font-medium">{ss?.ready}</span> },
        { label: "Image", value: <span className="font-mono text-xs break-all">{ss?.image}</span> },
      ]}
      onRefresh={() => mutate()}
      onDelete={async () => {
        if (!confirm(`Delete statefulset ${name}?`)) return
        await deleteStatefulSet(namespace, name)
        router.push('/workloads/statefulsets')
      }}
      onSaved={() => mutate()}
    />
  )
}
