"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { StatusCards } from "@/components/dashboard/status-cards"
import { ResourceTable } from "@/components/dashboard/resource-table"
import { ClusterHealth } from "@/components/dashboard/cluster-health"
import { UsageCharts } from "@/components/dashboard/usage-charts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDeployments, useServices, useStatefulSets, useIngresses } from "@/hooks/use-resource"
import { useNamespace } from "@/contexts/namespace-context"
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Scale,
  RefreshCw,
  Loader2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Dashboard() {
  const { namespace } = useNamespace()

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Cluster Overview</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage your Minikube cluster resources
            </p>
          </div>

          <div className="mb-6"><StatusCards /></div>
          <div className="mb-6"><UsageCharts /></div>
          <div className="mb-6"><ClusterHealth /></div>

          <Tabs defaultValue="pods" className="mb-6">
            <TabsList className="bg-secondary border border-border">
              {["pods", "deployments", "services", "statefulsets", "ingresses"].map(tab => (
                <TabsTrigger key={tab} value={tab} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground capitalize">
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="pods" className="mt-4">
              <ResourceTable namespace={namespace} />
            </TabsContent>
            <TabsContent value="deployments" className="mt-4">
              <DeploymentsTable namespace={namespace} />
            </TabsContent>
            <TabsContent value="services" className="mt-4">
              <ServicesTable namespace={namespace} />
            </TabsContent>
            <TabsContent value="statefulsets" className="mt-4">
              <StatefulSetsTable namespace={namespace} />
            </TabsContent>
            <TabsContent value="ingresses" className="mt-4">
              <IngressesTable namespace={namespace} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

function DeploymentsTable({ namespace }: { namespace: string }) {
  const { data: deployments = [], isLoading, mutate } = useDeployments(namespace)

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-foreground">Deployments</h3>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">{deployments.length} items</span>
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={() => mutate()}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Refresh
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              {["Name", "Namespace", "Replicas", "Strategy", "Image", "Age", ""].map(h => (
                <th key={h} className="text-left p-3 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></td></tr>
            ) : deployments.map((dep: any) => (
              <tr key={`${dep.namespace}-${dep.name}`} className="border-b border-border hover:bg-secondary/30 transition-colors">
                <td className="p-3"><p className="text-sm font-medium text-primary hover:underline cursor-pointer">{dep.name}</p></td>
                <td className="p-3"><span className="text-xs text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded">{dep.namespace}</span></td>
                <td className="p-3"><span className={cn("text-sm font-medium", dep.availableReplicas === dep.desiredReplicas ? "text-success" : dep.availableReplicas > 0 ? "text-warning" : "text-destructive")}>{dep.replicas}</span></td>
                <td className="p-3"><span className="text-xs bg-info/20 text-info border border-info/30 px-2 py-0.5 rounded">{dep.strategy}</span></td>
                <td className="p-3 text-sm text-muted-foreground font-mono max-w-[200px] truncate">{dep.image}</td>
                <td className="p-3 text-sm text-muted-foreground">{dep.age}</td>
                <td className="p-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View Details</DropdownMenuItem>
                      <DropdownMenuItem><Scale className="h-4 w-4 mr-2" />Scale</DropdownMenuItem>
                      <DropdownMenuItem><Pencil className="h-4 w-4 mr-2" />Edit YAML</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function ServicesTable({ namespace }: { namespace: string }) {
  const { data: services = [], isLoading, mutate } = useServices(namespace)
  const typeColors: Record<string, string> = {
    ClusterIP: "bg-info/20 text-info border-info/30",
    NodePort: "bg-warning/20 text-warning border-warning/30",
    LoadBalancer: "bg-success/20 text-success border-success/30",
    ExternalName: "bg-chart-5/20 text-chart-5 border-chart-5/30",
  }

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-foreground">Services</h3>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">{services.length} items</span>
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={() => mutate()}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Refresh
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              {["Name", "Namespace", "Type", "Cluster IP", "External IP", "Ports", "Age", ""].map(h => (
                <th key={h} className="text-left p-3 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={8} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></td></tr>
            ) : services.map((svc: any) => (
              <tr key={`${svc.namespace}-${svc.name}`} className="border-b border-border hover:bg-secondary/30 transition-colors">
                <td className="p-3 text-sm font-medium text-primary hover:underline cursor-pointer">{svc.name}</td>
                <td className="p-3"><span className="text-xs text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded">{svc.namespace}</span></td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs font-medium border ${typeColors[svc.type] || ''}`}>{svc.type}</span></td>
                <td className="p-3 text-sm text-muted-foreground font-mono">{svc.clusterIP}</td>
                <td className="p-3 text-sm text-muted-foreground font-mono">{svc.externalIP || "-"}</td>
                <td className="p-3 text-sm text-muted-foreground font-mono">{svc.ports}</td>
                <td className="p-3 text-sm text-muted-foreground">{svc.age}</td>
                <td className="p-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View Details</DropdownMenuItem>
                      <DropdownMenuItem><Pencil className="h-4 w-4 mr-2" />Edit YAML</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function StatefulSetsTable({ namespace }: { namespace: string }) {
  const { data: statefulSets = [], isLoading } = useStatefulSets(namespace)

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">StatefulSets</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              {["Name", "Namespace", "Ready", "Image", "Age"].map(h => (
                <th key={h} className="text-left p-3 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></td></tr>
            ) : statefulSets.map((sts: any) => (
              <tr key={`${sts.namespace}-${sts.name}`} className="border-b border-border hover:bg-secondary/30 transition-colors">
                <td className="p-3 text-sm font-medium text-primary hover:underline cursor-pointer">{sts.name}</td>
                <td className="p-3"><span className="text-xs text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded">{sts.namespace}</span></td>
                <td className="p-3 text-sm text-success font-medium">{sts.ready}</td>
                <td className="p-3 text-sm text-muted-foreground font-mono">{sts.image}</td>
                <td className="p-3 text-sm text-muted-foreground">{sts.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function IngressesTable({ namespace }: { namespace: string }) {
  const { data: ingresses = [], isLoading } = useIngresses(namespace)

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Ingresses</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              {["Name", "Namespace", "Hosts", "Address", "Ports", "Age"].map(h => (
                <th key={h} className="text-left p-3 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></td></tr>
            ) : ingresses.map((ing: any) => (
              <tr key={`${ing.namespace}-${ing.name}`} className="border-b border-border hover:bg-secondary/30 transition-colors">
                <td className="p-3 text-sm font-medium text-primary hover:underline cursor-pointer">{ing.name}</td>
                <td className="p-3"><span className="text-xs text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded">{ing.namespace}</span></td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {(ing.hosts || []).map((host: string) => (
                      <span key={host} className="text-xs text-info bg-info/10 px-2 py-0.5 rounded">{host}</span>
                    ))}
                  </div>
                </td>
                <td className="p-3 text-sm text-muted-foreground font-mono">{ing.address}</td>
                <td className="p-3 text-sm text-muted-foreground">{ing.ports}</td>
                <td className="p-3 text-sm text-muted-foreground">{ing.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
