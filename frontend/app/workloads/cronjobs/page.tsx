"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ResourceList } from "@/components/dashboard/resource-list"
import { Badge } from "@/components/ui/badge"
import { useCronJobs } from "@/hooks/use-resource"
import { useNamespace } from "@/contexts/namespace-context"
import { deleteCronJob } from "@/lib/api-client"

export default function CronJobsPage() {
  const { namespace } = useNamespace()
  const { data: cronJobs = [], isLoading, mutate } = useCronJobs(namespace)

  const columns = [
    { key: "name", label: "Name", render: (c: any) => <span className="font-medium text-foreground">{c.name}</span> },
    { key: "namespace", label: "Namespace", render: (c: any) => <Badge variant="outline" className="bg-secondary/50">{c.namespace}</Badge> },
    { key: "schedule", label: "Schedule", render: (c: any) => <span className="font-mono text-xs text-muted-foreground">{c.schedule}</span> },
    { key: "suspend", label: "Suspend", render: (c: any) => <Badge variant="outline" className={c.suspend ? "text-warning border-warning/30" : "text-success border-success/30"}>{c.suspend ? "Suspended" : "Active"}</Badge> },
    { key: "active", label: "Active", render: (c: any) => <span className="text-muted-foreground">{c.active}</span> },
    { key: "lastSchedule", label: "Last Schedule", render: (c: any) => <span className="text-muted-foreground">{c.lastSchedule}</span> },
    { key: "age", label: "Age", render: (c: any) => <span className="text-muted-foreground">{c.age}</span> },
  ]

  return (
    <DashboardLayout title="CronJobs" description="CronJobs run jobs on a schedule.">
      <ResourceList
        data={cronJobs}
        columns={columns}
        resourceName="CronJobs"
        resourceKind="cronjobs"
        filterByNamespace={true}
        getNamespace={(c: any) => c.namespace}
        getName={(c: any) => c.name}
        getDetailHref={(c: any) => `/workloads/cronjobs/${c.namespace}/${c.name}`}
        loading={isLoading}
        onRefresh={() => mutate()}
        onDelete={async (c: any) => {
          if (confirm(`Delete cronjob ${c.name}?`)) { await deleteCronJob(c.namespace, c.name); mutate() }
        }}
      />
    </DashboardLayout>
  )
}
