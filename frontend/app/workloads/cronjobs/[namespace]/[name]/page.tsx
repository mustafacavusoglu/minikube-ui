"use client"

import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { ResourceDetailLayout } from "@/components/detail/resource-detail-layout"
import { Badge } from "@/components/ui/badge"
import { useCronJob } from "@/hooks/use-resource"
import { deleteCronJob } from "@/lib/api-client"

export default function CronJobDetailPage() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>()
  const router = useRouter()
  const { data: cj, isLoading, mutate } = useCronJob(namespace, name)

  return (
    <ResourceDetailLayout
      resource={cj}
      isLoading={isLoading}
      backHref="/workloads/cronjobs"
      backLabel="CronJobs"
      namespace={namespace}
      statusBadge={cj && (
        <Badge variant="outline" className={cj.suspend ? "text-warning border-warning/30" : "text-success border-success/30"}>
          {cj.suspend ? "Suspended" : "Active"}
        </Badge>
      )}
      extraFields={[
        { label: "Schedule", value: <span className="font-mono">{cj?.schedule}</span> },
        { label: "Active", value: cj?.active },
        { label: "Last Schedule", value: cj?.lastSchedule },
      ]}
      onRefresh={() => mutate()}
      onDelete={async () => {
        if (!confirm(`Delete cronjob ${name}?`)) return
        await deleteCronJob(namespace, name)
        router.push('/workloads/cronjobs')
      }}
    />
  )
}
