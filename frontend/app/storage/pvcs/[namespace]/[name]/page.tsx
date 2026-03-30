"use client"

import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { ResourceDetailLayout } from "@/components/detail/resource-detail-layout"
import { Badge } from "@/components/ui/badge"
import { usePVC } from "@/hooks/use-resource"
import { deletePVC } from "@/lib/api-client"
import { cn } from "@/lib/utils"

const STATUS_STYLES: Record<string, string> = {
  Bound: "text-success border-success/30",
  Pending: "text-warning border-warning/30",
  Lost: "text-destructive border-destructive/30",
}

export default function PVCDetailPage() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>()
  const router = useRouter()
  const { data: pvc, isLoading, mutate } = usePVC(namespace, name)

  return (
    <ResourceDetailLayout
      resource={pvc}
      isLoading={isLoading}
      backHref="/storage/pvcs"
      backLabel="PVCs"
      namespace={namespace}
      statusBadge={pvc && (
        <Badge variant="outline" className={cn(STATUS_STYLES[pvc.status])}>
          {pvc.status}
        </Badge>
      )}
      extraFields={[
        { label: "Volume", value: <span className="font-mono text-xs">{pvc?.volume || "-"}</span> },
        { label: "Capacity", value: pvc?.capacity },
        { label: "Access Modes", value: (pvc?.accessModes || []).join(", ") },
        { label: "Storage Class", value: pvc?.storageClass },
      ]}
      onRefresh={() => mutate()}
      onDelete={async () => {
        if (!confirm(`Delete PVC ${name}?`)) return
        await deletePVC(namespace, name)
        router.push('/storage/pvcs')
      }}
    />
  )
}
