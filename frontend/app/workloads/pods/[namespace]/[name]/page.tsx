"use client"

import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MetadataPanel } from "@/components/detail/metadata-panel"
import { EventsPanel } from "@/components/detail/events-panel"
import { LogsPanel } from "@/components/detail/logs-panel"
import { YamlInlinePanel } from "@/components/detail/yaml-inline-panel"
import { usePod } from "@/hooks/use-resource"
import { deletePod } from "@/lib/api-client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import dynamic from "next/dynamic"
import {
  ArrowLeft, Loader2, Terminal, Trash2,
  CheckCircle, XCircle, AlertCircle, RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const PodTerminal = dynamic(
  () => import("@/components/terminal/pod-terminal").then(m => ({ default: m.PodTerminal })),
  { ssr: false }
)

const STATUS_STYLES: Record<string, string> = {
  Running: "bg-success/20 text-success border-success/30",
  Succeeded: "bg-success/20 text-success border-success/30",
  Pending: "bg-warning/20 text-warning border-warning/30",
  Failed: "bg-destructive/20 text-destructive border-destructive/30",
  CrashLoopBackOff: "bg-destructive/20 text-destructive border-destructive/30",
  ImagePullBackOff: "bg-destructive/20 text-destructive border-destructive/30",
  Terminating: "bg-muted/50 text-muted-foreground",
}

export default function PodDetailPage() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>()
  const router = useRouter()
  const { data: pod, isLoading, mutate } = usePod(namespace, name)
  const [terminalContainer, setTerminalContainer] = useState<string>('')
  const [terminalConnected, setTerminalConnected] = useState(false)
  const [activeTab, setActiveTab] = useState('details')

  const handleDelete = async () => {
    if (!confirm(`Delete pod ${name}?`)) return
    await deletePod(namespace, name)
    router.push('/workloads/pods')
  }

  return (
    <DashboardLayout title="" description="">
      {/* Back + header */}
      <div className="mb-6">
        <Link
          href="/workloads/pods"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-4 w-4" /> Pods
        </Link>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-foreground font-mono">{name}</h1>
            {pod && (
              <span className={cn(
                "px-2 py-0.5 rounded text-xs font-medium border",
                STATUS_STYLES[pod.status] || "bg-secondary text-muted-foreground"
              )}>
                {pod.status}
              </span>
            )}
            <Badge variant="outline" className="bg-secondary/50">{namespace}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => mutate()} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
            <Button size="sm" variant="destructive" onClick={handleDelete} className="gap-1.5">
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          </div>
        </div>
      </div>

      {isLoading || !pod ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={v => { setActiveTab(v); if (v !== 'terminal') setTerminalConnected(false) }}>
          <TabsList className="bg-secondary border border-border mb-6">
            {["details", "logs", "terminal", "yaml", "events"].map(tab => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="capitalize data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* DETAILS TAB */}
          <TabsContent value="details" className="space-y-4">
            <MetadataPanel
              resource={pod}
              extraFields={[
                { label: "Node", value: <span className="font-mono">{pod.node || "-"}</span> },
                { label: "IP", value: <span className="font-mono">{pod.ip || "-"}</span> },
                { label: "Ready", value: pod.ready },
                { label: "Restarts", value: <span className={pod.restarts > 5 ? "text-destructive font-medium" : ""}>{pod.restarts}</span> },
              ]}
            />

            {/* Containers */}
            <Card className="p-5 bg-card border-border">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                Containers ({(pod.containers || []).length})
              </h3>
              <div className="space-y-3">
                {(pod.containers || []).map((c: any) => (
                  <div key={c.name} className="p-3 rounded-lg bg-secondary/40 border border-border">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        {c.ready
                          ? <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                          : c.state === 'waiting'
                          ? <AlertCircle className="h-4 w-4 text-warning flex-shrink-0" />
                          : <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                        }
                        <span className="font-medium text-foreground">{c.name}</span>
                        <Badge variant="outline" className={cn(
                          "text-xs",
                          c.state === 'running' ? "text-success border-success/30"
                          : c.state === 'terminated' ? "text-muted-foreground"
                          : "text-warning border-warning/30"
                        )}>
                          {c.state}
                        </Badge>
                        {c.restartCount > 0 && (
                          <span className="text-xs text-muted-foreground">{c.restartCount} restarts</span>
                        )}
                      </div>
                      <span className="font-mono text-xs text-muted-foreground truncate max-w-xs">{c.image}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* LOGS TAB */}
          <TabsContent value="logs">
            <LogsPanel
              namespace={namespace}
              pod={name}
              containers={pod.containers || []}
            />
          </TabsContent>

          {/* TERMINAL TAB */}
          <TabsContent value="terminal">
            {!terminalConnected ? (
              <Card className="p-6 bg-card border-border space-y-4">
                <p className="text-sm text-muted-foreground">Select a container to open an interactive shell session.</p>
                <div className="flex items-end gap-3">
                  {(pod.containers || []).length > 1 && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-muted-foreground">Container</label>
                      <Select value={terminalContainer} onValueChange={setTerminalContainer}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select container..." />
                        </SelectTrigger>
                        <SelectContent>
                          {(pod.containers || []).map((c: any) => (
                            <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <Button
                    onClick={() => setTerminalConnected(true)}
                    disabled={(pod.containers || []).length > 1 && !terminalContainer}
                    className="gap-2"
                  >
                    <Terminal className="h-4 w-4" />
                    Connect
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-0 bg-card border-border overflow-hidden" style={{ height: '500px' }}>
                <PodTerminal
                  namespace={namespace}
                  pod={name}
                  container={terminalContainer || undefined}
                />
              </Card>
            )}
          </TabsContent>

          {/* YAML TAB */}
          <TabsContent value="yaml">
            <YamlInlinePanel namespace={namespace} resource="pods" name={name} />
          </TabsContent>

          {/* EVENTS TAB */}
          <TabsContent value="events">
            <EventsPanel namespace={namespace} resourceName={name} />
          </TabsContent>
        </Tabs>
      )}

    </DashboardLayout>
  )
}
