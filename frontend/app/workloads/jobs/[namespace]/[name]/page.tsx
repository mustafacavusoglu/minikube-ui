"use client"

import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { ResourceDetailLayout } from "@/components/detail/resource-detail-layout"
import { Badge } from "@/components/ui/badge"
import { useJob } from "@/hooks/use-resource"
import { deleteJob } from "@/lib/api-client"
import { cn } from "@/lib/utils"

const STATUS_STYLES: Record<string, string> = {
  Complete: "text-success border-success/30",
  Running: "text-info border-info/30",
  Failed: "text-destructive border-destructive/30",
}

export default function JobDetailPage() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>()
  const router = useRouter()
  const { data: job, isLoading, mutate } = useJob(namespace, name)

  return (
    <ResourceDetailLayout
      resource={job}
      isLoading={isLoading}
      backHref="/workloads/jobs"
      backLabel="Jobs"
      namespace={namespace}
      statusBadge={job && (
        <Badge variant="outline" className={cn(STATUS_STYLES[job.status])}>
          {job.status}
        </Badge>
      )}
      extraFields={[
        { label: "Completions", value: job?.completions },
        { label: "Duration", value: <span className="font-mono">{job?.duration}</span> },
      ]}
      onRefresh={() => mutate()}
      onDelete={async () => {
        if (!confirm(`Delete job ${name}?`)) return
        await deleteJob(namespace, name)
        router.push('/workloads/jobs')
      }}
    />
  )
}
