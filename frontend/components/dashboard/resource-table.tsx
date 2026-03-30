"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  Terminal,
  FileText,
  Loader2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { usePods } from "@/hooks/use-resource"
import { deletePod } from "@/lib/api-client"
import { PodTerminalDialog } from "@/components/terminal/pod-terminal-dialog"

const STATUS_STYLES: Record<string, string> = {
  Running: "bg-success/20 text-success border-success/30",
  Pending: "bg-warning/20 text-warning border-warning/30",
  Failed: "bg-destructive/20 text-destructive border-destructive/30",
  Succeeded: "bg-info/20 text-info border-info/30",
  CrashLoopBackOff: "bg-destructive/20 text-destructive border-destructive/30",
  ImagePullBackOff: "bg-destructive/20 text-destructive border-destructive/30",
  Terminating: "bg-warning/20 text-warning border-warning/30",
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("px-2 py-0.5 rounded text-xs font-medium border", STATUS_STYLES[status] || "bg-secondary/50 text-muted-foreground")}>
      {status}
    </span>
  )
}

interface ResourceTableProps {
  namespace: string
}

export function ResourceTable({ namespace }: ResourceTableProps) {
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [terminalPod, setTerminalPod] = useState<any | null>(null)
  const { data: pods = [], isLoading, mutate } = usePods(namespace)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
  }

  const sortedPods = [...pods].sort((a: any, b: any) => {
    const aVal = a[sortField] ?? ""
    const bVal = b[sortField] ?? ""
    const modifier = sortDirection === "asc" ? 1 : -1
    return String(aVal).localeCompare(String(bVal)) * modifier
  })

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-foreground">Pods</h3>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
            {pods.length} items
          </span>
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground" onClick={() => mutate()}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              {[["name", "Name"], ["namespace", "Namespace"], ["status", "Status"]].map(([field, label]) => (
                <th key={field} className="text-left p-3 text-xs font-medium text-muted-foreground">
                  <button onClick={() => handleSort(field)} className="flex items-center gap-1 hover:text-foreground">
                    {label} <SortIcon field={field} />
                  </button>
                </th>
              ))}
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Ready</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Restarts</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Age</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">IP</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">CPU</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Memory</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Node</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && pods.length === 0 ? (
              <tr><td colSpan={11} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></td></tr>
            ) : sortedPods.map((pod: any) => (
              <tr key={`${pod.namespace}-${pod.name}`} className="border-b border-border hover:bg-secondary/30 transition-colors">
                <td className="p-3">
                  <Link
                    href={`/workloads/pods/${pod.namespace}/${pod.name}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {pod.name}
                  </Link>
                </td>
                <td className="p-3">
                  <span className="text-xs text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded">{pod.namespace}</span>
                </td>
                <td className="p-3"><StatusBadge status={pod.status} /></td>
                <td className="p-3 text-sm text-foreground">{pod.ready}</td>
                <td className="p-3 text-sm text-foreground">
                  <span className={cn(pod.restarts > 5 && "text-destructive font-medium")}>{pod.restarts}</span>
                </td>
                <td className="p-3 text-sm text-muted-foreground">{pod.age}</td>
                <td className="p-3 text-sm text-muted-foreground font-mono">{pod.ip}</td>
                <td className="p-3 text-sm text-muted-foreground font-mono">{pod.cpu}</td>
                <td className="p-3 text-sm text-muted-foreground font-mono">{pod.memory}</td>
                <td className="p-3 text-sm text-muted-foreground">{pod.node}</td>
                <td className="p-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/workloads/pods/${pod.namespace}/${pod.name}`}>
                          <Eye className="h-4 w-4 mr-2" />View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/workloads/pods/${pod.namespace}/${pod.name}?tab=logs`}>
                          <FileText className="h-4 w-4 mr-2" />View Logs
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTerminalPod(pod)}>
                        <Terminal className="h-4 w-4 mr-2" />Open Terminal
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/workloads/pods/${pod.namespace}/${pod.name}?tab=yaml`}>
                          <Pencil className="h-4 w-4 mr-2" />Edit YAML
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={async () => {
                        if (confirm(`Delete pod ${pod.name}?`)) { await deletePod(pod.namespace, pod.name); mutate() }
                      }}>
                        <Trash2 className="h-4 w-4 mr-2" />Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {sortedPods.length} of {pods.length} items</span>
      </div>

      {terminalPod && (
        <PodTerminalDialog
          open={!!terminalPod}
          onOpenChange={(v) => !v && setTerminalPod(null)}
          defaultNamespace={terminalPod.namespace}
          defaultPod={terminalPod.name}
        />
      )}
    </Card>
  )
}
