"use client"

import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MetadataPanel } from "@/components/detail/metadata-panel"
import { EventsPanel } from "@/components/detail/events-panel"
import { YamlInlinePanel } from "@/components/detail/yaml-inline-panel"
import { ArrowLeft, Loader2, RefreshCw, Trash2 } from "lucide-react"

interface Tab {
  value: string
  label: string
  content: React.ReactNode
}

interface ResourceDetailLayoutProps {
  resource: any
  isLoading: boolean
  backHref: string
  backLabel: string
  namespace?: string
  resourceKind?: string       // e.g. "deployments" — for YAML edit
  extraFields?: { label: string; value: React.ReactNode }[]
  extraTabs?: Tab[]
  onDelete?: () => void
  onRefresh?: () => void
  onSaved?: () => void
  statusBadge?: React.ReactNode
  /** Extra cards rendered under metadata in the Details tab */
  detailsExtra?: React.ReactNode
}

export function ResourceDetailLayout({
  resource,
  isLoading,
  backHref,
  backLabel,
  namespace,
  resourceKind,
  extraFields = [],
  extraTabs = [],
  onDelete,
  onRefresh,
  onSaved,
  statusBadge,
  detailsExtra,
}: ResourceDetailLayoutProps) {
  const name = resource?.name || ''

  const tabs: Tab[] = [
    {
      value: 'details',
      label: 'Details',
      content: (
        <div className="space-y-4">
          <MetadataPanel resource={resource} extraFields={extraFields} />
          {detailsExtra}
        </div>
      ),
    },
    ...extraTabs,
    ...(namespace ? [{
      value: 'events',
      label: 'Events',
      content: <EventsPanel namespace={namespace} resourceName={name} />,
    }] : []),
    ...(resourceKind && namespace ? [{
      value: 'yaml',
      label: 'YAML',
      content: <YamlInlinePanel namespace={namespace} resource={resourceKind} name={name} onSaved={onSaved} />,
    }] : []),
  ]

  return (
    <DashboardLayout title="" description="">
      {/* Back + header */}
      <div className="mb-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-4 w-4" /> {backLabel}
        </Link>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-xl font-semibold text-foreground font-mono truncate">{name}</h1>
            {statusBadge}
            {namespace && (
              <Badge variant="outline" className="bg-secondary/50 flex-shrink-0">{namespace}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {onRefresh && (
              <Button size="sm" variant="outline" onClick={onRefresh} className="gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </Button>
            )}
            {onDelete && (
              <Button size="sm" variant="destructive" onClick={onDelete} className="gap-1.5">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
            )}
          </div>
        </div>
      </div>

      {isLoading || !resource ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Tabs defaultValue="details">
          <TabsList className="bg-secondary border border-border mb-6">
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="capitalize data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      )}

    </DashboardLayout>
  )
}
