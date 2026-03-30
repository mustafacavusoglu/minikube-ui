"use client"

import { useState } from "react"
import { Bell, Search, User, Settings, HelpCircle, ChevronDown, Terminal, RefreshCw, ExternalLink, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNamespace } from "@/contexts/namespace-context"
import { useNamespaces } from "@/hooks/use-resource"
import { PodTerminalDialog } from "@/components/terminal/pod-terminal-dialog"
import { useSWRConfig } from "swr"

export function Header() {
  const { namespace, setNamespace } = useNamespace()
  const { data: namespaceList = [] } = useNamespaces()
  const [searchOpen, setSearchOpen] = useState(false)
  const [terminalOpen, setTerminalOpen] = useState(false)
  const { mutate } = useSWRConfig()

  const allNamespaces = [
    { name: "All Namespaces", podCount: 0 },
    ...namespaceList,
  ]

  const handleRefresh = () => {
    mutate(() => true, undefined, { revalidate: true })
  }

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        {/* Namespace Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-secondary border-border text-foreground hover:bg-muted min-w-[180px] justify-between">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs font-medium">NS</span>
                <span className="font-medium">{namespace}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <div className="px-2 py-1.5 text-xs text-muted-foreground border-b border-border mb-1">
              Select Namespace
            </div>
            {allNamespaces.map((ns) => (
              <DropdownMenuItem
                key={ns.name}
                onClick={() => setNamespace(ns.name)}
                className={ns.name === namespace ? "bg-accent" : ""}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{ns.name}</span>
                  {ns.podCount > 0 && (
                    <span className="text-xs text-muted-foreground">{ns.podCount} pods</span>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search */}
        <div className="relative">
          {searchOpen ? (
            <input
              type="text"
              placeholder="Search resources (pods, deployments, services...)"
              className="w-80 h-9 px-3 pl-9 bg-secondary border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
              onBlur={() => setSearchOpen(false)}
            />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchOpen(true)}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Search resources</span>
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs text-muted-foreground">
                /
              </kbd>
            </Button>
          )}
          {searchOpen && <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Refresh */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          title="Refresh all"
          onClick={handleRefresh}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>

        {/* Terminal */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          title="Open Pod Terminal"
          onClick={() => setTerminalOpen(true)}
        >
          <Terminal className="h-4 w-4" />
        </Button>

        <PodTerminalDialog open={terminalOpen} onOpenChange={setTerminalOpen} />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full animate-pulse" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-3 py-2 border-b border-border">
              <p className="font-medium text-foreground text-sm">Notifications</p>
              <p className="text-xs text-muted-foreground">System events</p>
            </div>
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
              No recent alerts
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <ExternalLink className="h-4 w-4 mr-2" />
              Documentation
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/about">About</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Cluster Context */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground ml-2">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span className="text-sm font-medium">minikube</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="px-2 py-1.5 text-xs text-muted-foreground border-b border-border mb-1">
              Cluster Context
            </div>
            <DropdownMenuItem className="flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="font-medium">minikube</span>
                <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">current</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Copy className="h-4 w-4 mr-2" />
              Copy kubeconfig
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-foreground">kubernetes-admin</p>
              <p className="text-xs text-muted-foreground">cluster-admin</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
