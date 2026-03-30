"use client"

import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { ResourceDetailLayout } from "@/components/detail/resource-detail-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDeployment } from "@/hooks/use-resource"
import { deleteDeployment } from "@/lib/api-client"
import { cn } from "@/lib/utils"

export default function DeploymentDetailPage() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>()
  const router = useRouter()
  const { data: dep, isLoading, mutate } = useDeployment(namespace, name)

  const healthy = dep?.availableReplicas === dep?.desiredReplicas

  return (
    <ResourceDetailLayout
      resource={dep}
      isLoading={isLoading}
      backHref="/workloads/deployments"
      backLabel="Deployments"
      namespace={namespace}
      resourceKind="deployments"
      statusBadge={dep && (
        <Badge variant="outline" className={cn(healthy ? "text-success border-success/30" : "text-warning border-warning/30")}>
          {dep.replicas}
        </Badge>
      )}
      extraFields={[
        { label: "Strategy", value: <Badge variant="outline" className="bg-info/10 text-info border-info/30">{dep?.strategy}</Badge> },
        { label: "Image", value: <span className="font-mono text-xs break-all">{dep?.image}</span> },
        { label: "Available", value: dep?.availableReplicas },
        { label: "Ready", value: dep?.readyReplicas },
        { label: "Desired", value: dep?.desiredReplicas },
      ]}
      onRefresh={() => mutate()}
      onDelete={async () => {
        if (!confirm(`Delete deployment ${name}?`)) return
        await deleteDeployment(namespace, name)
        router.push('/workloads/deployments')
      }}
      onSaved={() => mutate()}
    />
  )
}
