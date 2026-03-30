"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card } from "@/components/ui/card"
import { useAbout } from "@/hooks/use-resource"
import { Loader2, Server, Box, Cpu, Globe, Info } from "lucide-react"

export default function AboutPage() {
  const { data: about, isLoading } = useAbout()

  return (
    <DashboardLayout title="About" description="Cluster information and version details">
      {isLoading || !about ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kubernetes Version */}
          <Card className="p-6 bg-card border-border">
            <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-primary" />
              Kubernetes
            </h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Version</dt>
                <dd className="text-sm font-mono text-foreground">{about.kubernetes?.version}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Platform</dt>
                <dd className="text-sm font-mono text-foreground">{about.kubernetes?.platform}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Go Version</dt>
                <dd className="text-sm font-mono text-foreground">{about.kubernetes?.goVersion}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Build Date</dt>
                <dd className="text-sm font-mono text-foreground">{about.kubernetes?.buildDate}</dd>
              </div>
            </dl>
          </Card>

          {/* Cluster Info */}
          <Card className="p-6 bg-card border-border">
            <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-info" />
              Cluster
            </h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Name</dt>
                <dd className="text-sm font-medium text-foreground">{about.cluster?.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Server</dt>
                <dd className="text-sm font-mono text-foreground">{about.cluster?.server}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Context</dt>
                <dd className="text-sm font-mono text-foreground">{about.context}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Nodes</dt>
                <dd className="text-sm text-foreground">{about.nodeCount}</dd>
              </div>
            </dl>
          </Card>

          {/* Node Info */}
          {about.node && (
            <Card className="p-6 bg-card border-border">
              <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <Server className="h-5 w-5 text-success" />
                Node: {about.node.name}
              </h2>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">OS</dt>
                  <dd className="text-sm text-foreground">{about.node.os}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Kernel</dt>
                  <dd className="text-sm font-mono text-foreground">{about.node.kernel}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Architecture</dt>
                  <dd className="text-sm font-mono text-foreground">{about.node.arch}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Container Runtime</dt>
                  <dd className="text-sm font-mono text-foreground">{about.node.runtime}</dd>
                </div>
              </dl>
            </Card>
          )}

          {/* UI Info */}
          <Card className="p-6 bg-card border-border">
            <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <Box className="h-5 w-5 text-chart-5" />
              Minikube UI
            </h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Version</dt>
                <dd className="text-sm font-mono text-foreground">1.0.0</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Frontend</dt>
                <dd className="text-sm font-mono text-foreground">Next.js 15 + React 19</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Backend</dt>
                <dd className="text-sm font-mono text-foreground">Express.js + @kubernetes/client-node</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Terminal</dt>
                <dd className="text-sm font-mono text-foreground">xterm.js + WebSocket</dd>
              </div>
            </dl>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
