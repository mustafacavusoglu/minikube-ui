"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ResourceList, StatusBadge } from "@/components/dashboard/resource-list"
import { Badge } from "@/components/ui/badge"
import { useJobs } from "@/hooks/use-resource"
import { useNamespace } from "@/contexts/namespace-context"
import { deleteJob } from "@/lib/api-client"

export default function JobsPage() {
  const { namespace } = useNamespace()
  const { data: jobs = [], isLoading, mutate } = useJobs(namespace)

  const columns = [
    { key: "name", label: "Name", render: (j: any) => <span className="font-medium text-foreground">{j.name}</span> },
    { key: "namespace", label: "Namespace", render: (j: any) => <Badge variant="outline" className="bg-secondary/50">{j.namespace}</Badge> },
    { key: "status", label: "Status", render: (j: any) => <StatusBadge status={j.status} /> },
    { key: "completions", label: "Completions", render: (j: any) => <span className="text-muted-foreground">{j.completions}</span> },
    { key: "duration", label: "Duration", render: (j: any) => <span className="text-muted-foreground font-mono">{j.duration}</span> },
    { key: "age", label: "Age", render: (j: any) => <span className="text-muted-foreground">{j.age}</span> },
  ]

  return (
    <DashboardLayout title="Jobs" description="Jobs run pods to completion.">
      <ResourceList
        data={jobs}
        columns={columns}
        resourceName="Jobs"
        resourceKind="jobs"
        filterByNamespace={true}
        getNamespace={(j: any) => j.namespace}
        getName={(j: any) => j.name}
        loading={isLoading}
        getDetailHref={(j: any) => `/workloads/jobs/${j.namespace}/${j.name}`}
        onRefresh={() => mutate()}
        onDelete={async (j: any) => {
          if (confirm(`Delete job ${j.name}?`)) { await deleteJob(j.namespace, j.name); mutate() }
        }}
      />
    </DashboardLayout>
  )
}
