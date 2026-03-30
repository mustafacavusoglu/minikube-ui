"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MoreVertical, Search, RefreshCw, FileCode, Terminal, Trash2, Eye, Loader2, Plus } from "lucide-react"
import { useNamespaces } from "@/hooks/use-resource"
import { cn } from "@/lib/utils"
import { PodTerminalDialog } from "@/components/terminal/pod-terminal-dialog"
import { YamlEditDialog } from "@/components/yaml/yaml-edit-dialog"
import { YamlCreateDialog } from "@/components/yaml/yaml-create-dialog"
import Link from "next/link"

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (item: T) => React.ReactNode
}

interface ResourceListProps<T> {
  data: T[]
  columns: Column<T>[]
  resourceName: string
  resourceKind?: string  // e.g. "pods", "deployments" — used for YAML edit
  createResourceKind?: string  // when set, shows a Create button
  defaultNamespace?: string    // passed to create dialog as default namespace
  filterByNamespace?: boolean
  getNamespace?: (item: T) => string
  getName?: (item: T) => string
  loading?: boolean
  onDelete?: (item: T) => void
  onRefresh?: () => void
  showTerminal?: boolean
  getDetailHref?: (item: T) => string
}

export function ResourceList<T extends Record<string, unknown>>({
  data,
  columns,
  resourceName,
  resourceKind,
  createResourceKind,
  defaultNamespace = 'default',
  filterByNamespace = true,
  getNamespace,
  getName,
  loading,
  onDelete,
  onRefresh,
  showTerminal = false,
  getDetailHref,
}: ResourceListProps<T>) {
  const [search, setSearch] = useState("")
  const [selectedNamespace, setSelectedNamespace] = useState("all")
  const [terminalItem, setTerminalItem] = useState<T | null>(null)
  const [yamlItem, setYamlItem] = useState<T | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const { data: namespaceList = [] } = useNamespaces()

  const filteredData = data.filter((item) => {
    const matchesSearch = getName
      ? getName(item).toLowerCase().includes(search.toLowerCase())
      : true
    const matchesNamespace =
      selectedNamespace === "all" ||
      !filterByNamespace ||
      (getNamespace && getNamespace(item) === selectedNamespace)
    return matchesSearch && matchesNamespace
  })

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${resourceName}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-64 bg-secondary border-border"
            />
          </div>
          {filterByNamespace && (
            <Select value={selectedNamespace} onValueChange={setSelectedNamespace}>
              <SelectTrigger className="w-48 bg-secondary border-border">
                <SelectValue placeholder="All Namespaces" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Namespaces</SelectItem>
                {namespaceList.map((ns: any) => (
                  <SelectItem key={ns.name} value={ns.name}>
                    {ns.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex items-center gap-2">
          {createResourceKind && (
            <Button size="sm" className="gap-2" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Create
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-2" onClick={onRefresh} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>
      </div>

      {/* Count */}
      <div className="text-sm text-muted-foreground">
        {filteredData.length} {resourceName.toLowerCase()}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              {columns.map((col) => (
                <TableHead key={String(col.key)} className="text-muted-foreground font-medium">
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-12 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-12 text-muted-foreground">
                  No {resourceName.toLowerCase()} found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => {
                const detailHref = getDetailHref ? getDetailHref(item) : null
                return (
                <TableRow key={index} className="hover:bg-secondary/30">
                  {columns.map((col, colIdx) => (
                    <TableCell key={String(col.key)}>
                      {/* First column: wrap content in a link if detailHref is set */}
                      {colIdx === 0 && detailHref ? (
                        <Link href={detailHref} className="hover:underline text-primary">
                          {col.render
                            ? col.render(item)
                            : String(item[col.key as keyof T] ?? "-")}
                        </Link>
                      ) : col.render
                        ? col.render(item)
                        : String(item[col.key as keyof T] ?? "-")}
                    </TableCell>
                  ))}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2" asChild>
                          {detailHref ? (
                            <Link href={detailHref}>
                              <Eye className="h-4 w-4" /> View Details
                            </Link>
                          ) : (
                            <span><Eye className="h-4 w-4" /> View Details</span>
                          )}
                        </DropdownMenuItem>
                        {resourceKind && getNamespace && getName && (
                          <DropdownMenuItem className="gap-2" onClick={() => setYamlItem(item)}>
                            <FileCode className="h-4 w-4" /> Edit YAML
                          </DropdownMenuItem>
                        )}
                        {showTerminal && (
                          <DropdownMenuItem className="gap-2" onClick={() => setTerminalItem(item)}>
                            <Terminal className="h-4 w-4" /> Terminal
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="gap-2 text-destructive"
                              onClick={() => onDelete(item)}
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Terminal Dialog */}
      {terminalItem && getNamespace && getName && (
        <PodTerminalDialog
          open={!!terminalItem}
          onOpenChange={(v) => !v && setTerminalItem(null)}
          defaultNamespace={getNamespace(terminalItem)}
          defaultPod={getName(terminalItem)}
        />
      )}

      {/* YAML Edit Dialog */}
      {yamlItem && resourceKind && getNamespace && getName && (
        <YamlEditDialog
          open={!!yamlItem}
          onOpenChange={(v) => !v && setYamlItem(null)}
          namespace={getNamespace(yamlItem)}
          resource={resourceKind}
          name={getName(yamlItem)}
          onSaved={onRefresh}
        />
      )}

      {/* YAML Create Dialog */}
      {createResourceKind && (
        <YamlCreateDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          resource={createResourceKind}
          defaultNamespace={defaultNamespace}
          onCreated={onRefresh}
        />
      )}
    </div>
  )
}

// Status Badge Component
export function StatusBadge({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    Running: "bg-success/20 text-success border-success/30",
    Succeeded: "bg-success/20 text-success border-success/30",
    Active: "bg-success/20 text-success border-success/30",
    Bound: "bg-success/20 text-success border-success/30",
    Ready: "bg-success/20 text-success border-success/30",
    Complete: "bg-success/20 text-success border-success/30",
    Pending: "bg-warning/20 text-warning border-warning/30",
    CrashLoopBackOff: "bg-destructive/20 text-destructive border-destructive/30",
    ImagePullBackOff: "bg-destructive/20 text-destructive border-destructive/30",
    Failed: "bg-destructive/20 text-destructive border-destructive/30",
    Lost: "bg-destructive/20 text-destructive border-destructive/30",
    NotReady: "bg-destructive/20 text-destructive border-destructive/30",
    Terminating: "bg-muted/50 text-muted-foreground border-muted",
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium",
        statusStyles[status] || "bg-muted/50 text-muted-foreground"
      )}
    >
      {status}
    </Badge>
  )
}

// Type Badge Component
export function TypeBadge({ type }: { type: string }) {
  const typeStyles: Record<string, string> = {
    ClusterIP: "bg-info/20 text-info border-info/30",
    NodePort: "bg-chart-3/20 text-chart-3 border-chart-3/30",
    LoadBalancer: "bg-primary/20 text-primary border-primary/30",
    ExternalName: "bg-chart-5/20 text-chart-5 border-chart-5/30",
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium",
        typeStyles[type] || "bg-muted/50 text-muted-foreground"
      )}
    >
      {type}
    </Badge>
  )
}
