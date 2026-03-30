"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetadataPanelProps {
  resource: any
  extraFields?: { label: string; value: React.ReactNode }[]
}

function ownerHref(
  kind: string,
  namespace: string,
  name: string,
): string | null {
  const map: Record<string, string> = {
    ReplicaSet: `/workloads/replicasets/${namespace}/${name}`,
    Deployment: `/workloads/deployments/${namespace}/${name}`,
    StatefulSet: `/workloads/statefulsets/${namespace}/${name}`,
    DaemonSet: `/workloads/daemonsets/${namespace}/${name}`,
    Job: `/workloads/jobs/${namespace}/${name}`,
    CronJob: `/workloads/cronjobs/${namespace}/${name}`,
    Node: `/compute/nodes/${name}`,
  }
  return map[kind] || null
}

export function MetadataPanel({ resource, extraFields = [] }: MetadataPanelProps) {
  if (!resource) return null

  const labels = resource.labels || {}
  const ownerRefs = resource.ownerReferences || []

  return (
    <div className="space-y-4">
      {/* Core metadata */}
      <Card className="p-5 bg-card border-border">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Metadata</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          <MetaRow label="Name" value={<span className="font-mono">{resource.name}</span>} />
          {resource.namespace && (
            <MetaRow label="Namespace" value={
              <Badge variant="outline" className="bg-secondary/50">{resource.namespace}</Badge>
            } />
          )}
          {resource.age && <MetaRow label="Age" value={resource.age} />}
          {extraFields.map((f, i) => (
            <MetaRow key={i} label={f.label} value={f.value} />
          ))}
        </dl>
      </Card>

      {/* Owner references */}
      {ownerRefs.length > 0 && (
        <Card className="p-5 bg-card border-border">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Owned By</h3>
          <div className="flex flex-wrap gap-3">
            {ownerRefs.map((ref: any, i: number) => {
              const href = ownerHref(ref.kind, resource.namespace || '', ref.name)
              return (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 border border-border text-sm">
                  <span className="text-muted-foreground">{ref.kind}</span>
                  <span className="text-foreground/40">/</span>
                  {href ? (
                    <Link href={href} className="text-primary hover:underline flex items-center gap-1">
                      {ref.name}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  ) : (
                    <span className="font-mono text-foreground">{ref.name}</span>
                  )}
                  {ref.controller && (
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">controller</Badge>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Labels */}
      {Object.keys(labels).length > 0 && (
        <Card className="p-5 bg-card border-border">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Labels</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(labels).map(([k, v]) => (
              <span key={k} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary border border-border text-xs font-mono">
                <span className="text-primary">{k}</span>
                <span className="text-muted-foreground">=</span>
                <span className="text-foreground">{String(v)}</span>
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  )
}
