"use client"

import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { ResourceDetailLayout } from "@/components/detail/resource-detail-layout"
import { useDaemonSet } from "@/hooks/use-resource"
import { deleteDaemonSet } from "@/lib/api-client"

export default function DaemonSetDetailPage() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>()
  const router = useRouter()
  const { data: ds, isLoading, mutate } = useDaemonSet(namespace, name)

  return (
    <ResourceDetailLayout
      resource={ds}
      isLoading={isLoading}
      backHref="/workloads/daemonsets"
      backLabel="DaemonSets"
      namespace={namespace}
      resourceKind="daemonsets"
      extraFields={[
        { label: "Desired", value: ds?.desired },
        { label: "Current", value: ds?.current },
        { label: "Ready", value: <span className="text-success font-medium">{ds?.ready}</span> },
        { label: "Available", value: ds?.available },
      ]}
      onRefresh={() => mutate()}
      onDelete={async () => {
        if (!confirm(`Delete daemonset ${name}?`)) return
        await deleteDaemonSet(namespace, name)
        router.push('/workloads/daemonsets')
      }}
      onSaved={() => mutate()}
    />
  )
}
