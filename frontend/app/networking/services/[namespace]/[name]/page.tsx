"use client"

import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { ResourceDetailLayout } from "@/components/detail/resource-detail-layout"
import { Badge } from "@/components/ui/badge"
import { useService } from "@/hooks/use-resource"
import { deleteService } from "@/lib/api-client"

const TYPE_STYLES: Record<string, string> = {
  ClusterIP: "bg-info/20 text-info border-info/30",
  NodePort: "bg-warning/20 text-warning border-warning/30",
  LoadBalancer: "bg-success/20 text-success border-success/30",
  ExternalName: "bg-chart-5/20 text-chart-5 border-chart-5/30",
}

export default function ServiceDetailPage() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>()
  const router = useRouter()
  const { data: svc, isLoading, mutate } = useService(namespace, name)

  return (
    <ResourceDetailLayout
      resource={svc}
      isLoading={isLoading}
      backHref="/networking/services"
      backLabel="Services"
      namespace={namespace}
      resourceKind="services"
      statusBadge={svc && (
        <Badge variant="outline" className={TYPE_STYLES[svc.type] || ""}>
          {svc.type}
        </Badge>
      )}
      extraFields={[
        { label: "Cluster IP", value: <span className="font-mono">{svc?.clusterIP}</span> },
        { label: "External IP", value: <span className="font-mono">{svc?.externalIP || "-"}</span> },
        { label: "Ports", value: <span className="font-mono">{svc?.ports}</span> },
      ]}
      onRefresh={() => mutate()}
      onDelete={async () => {
        if (!confirm(`Delete service ${name}?`)) return
        await deleteService(namespace, name)
        router.push('/networking/services')
      }}
      onSaved={() => mutate()}
    />
  )
}
