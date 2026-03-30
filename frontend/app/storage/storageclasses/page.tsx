"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ResourceList } from "@/components/dashboard/resource-list"
import { Badge } from "@/components/ui/badge"
import { useStorageClasses } from "@/hooks/use-resource"

export default function StorageClassesPage() {
  const { data: storageClasses = [], isLoading, mutate } = useStorageClasses()

  const columns = [
    { key: "name", label: "Name", render: (s: any) => (
      <div className="flex items-center gap-2">
        <span className="font-medium text-foreground">{s.name}</span>
        {s.isDefault && <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 text-xs">default</Badge>}
      </div>
    )},
    { key: "provisioner", label: "Provisioner", render: (s: any) => <span className="font-mono text-xs text-muted-foreground">{s.provisioner}</span> },
    { key: "reclaimPolicy", label: "Reclaim Policy", render: (s: any) => <span className="text-muted-foreground">{s.reclaimPolicy}</span> },
    { key: "volumeBindingMode", label: "Binding Mode", render: (s: any) => <span className="text-muted-foreground">{s.volumeBindingMode}</span> },
    { key: "allowVolumeExpansion", label: "Expandable", render: (s: any) => <span className={s.allowVolumeExpansion ? "text-success" : "text-muted-foreground"}>{s.allowVolumeExpansion ? "Yes" : "No"}</span> },
    { key: "age", label: "Age", render: (s: any) => <span className="text-muted-foreground">{s.age}</span> },
  ]

  return (
    <DashboardLayout title="StorageClasses" description="StorageClasses define the provisioner and parameters for dynamic storage.">
      <ResourceList
        data={storageClasses}
        columns={columns}
        resourceName="StorageClasses"
        filterByNamespace={false}
        loading={isLoading}
        onRefresh={() => mutate()}
      />
    </DashboardLayout>
  )
}
