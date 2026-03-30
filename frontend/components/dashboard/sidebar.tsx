"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Box,
  Server,
  Network,
  Settings,
  ChevronDown,
  ChevronRight,
  Container,
  Users,
  FileCode,
  HardDrive,
  Puzzle,
  Info,
} from "lucide-react"

interface NavItem {
  label: string
  href?: string
  icon: React.ReactNode
  children?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    label: "Custom Resources",
    icon: <Puzzle className="h-4 w-4" />,
    children: [
      { label: "CustomResourceDefinitions", href: "/custom-resources/crds" },
    ],
  },
  {
    label: "Workloads",
    icon: <Box className="h-4 w-4" />,
    children: [
      { label: "Pods", href: "/workloads/pods" },
      { label: "Deployments", href: "/workloads/deployments" },
      { label: "ReplicaSets", href: "/workloads/replicasets" },
      { label: "StatefulSets", href: "/workloads/statefulsets" },
      { label: "DaemonSets", href: "/workloads/daemonsets" },
      { label: "Jobs", href: "/workloads/jobs" },
      { label: "CronJobs", href: "/workloads/cronjobs" },
    ],
  },
  {
    label: "Networking",
    icon: <Network className="h-4 w-4" />,
    children: [
      { label: "Services", href: "/networking/services" },
      { label: "Ingresses", href: "/networking/ingresses" },
    ],
  },
  {
    label: "Storage",
    icon: <HardDrive className="h-4 w-4" />,
    children: [
      { label: "PersistentVolumeClaims", href: "/storage/pvcs" },
      { label: "StorageClasses", href: "/storage/storageclasses" },
    ],
  },
  {
    label: "Config",
    icon: <FileCode className="h-4 w-4" />,
    children: [
      { label: "ConfigMaps", href: "/config/configmaps" },
      { label: "Secrets", href: "/config/secrets" },
    ],
  },
  {
    label: "Compute",
    icon: <Server className="h-4 w-4" />,
    children: [
      { label: "Nodes", href: "/compute/nodes" },
    ],
  },
  {
    label: "User Management",
    icon: <Users className="h-4 w-4" />,
    children: [
      { label: "ServiceAccounts", href: "/users/serviceaccounts" },
    ],
  },
  {
    label: "Administration",
    icon: <Settings className="h-4 w-4" />,
    children: [
      { label: "Namespaces", href: "/admin/namespaces" },
    ],
  },
  {
    label: "About",
    href: "/about",
    icon: <Info className="h-4 w-4" />,
  },
]

function findParentForPath(path: string | null): string | null {
  if (!path) return null
  const parentItem = navItems.find(item =>
    item.children?.some(child => child.href === path)
  )
  return parentItem?.label || null
}

export function Sidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  const initialExpanded = useMemo(() => {
    const parent = findParentForPath(pathname)
    return parent ? [parent] : []
  }, [pathname])

  useEffect(() => {
    setMounted(true)
    if (initialExpanded.length > 0) {
      setExpandedItems(prev => {
        const newItems = initialExpanded.filter(item => !prev.includes(item))
        return newItems.length > 0 ? [...prev, ...newItems] : prev
      })
    }
  }, [initialExpanded])

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    )
  }

  const isActive = (href: string) => mounted && pathname === href

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <Container className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">MiniKube Console</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.label}>
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive(item.href)
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleExpand(item.label)}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                      expandedItems.includes(item.label)
                        ? "text-sidebar-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {expandedItems.includes(item.label) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {expandedItems.includes(item.label) && item.children && (
                    <ul className="mt-1 ml-4 space-y-1 border-l border-sidebar-border pl-4">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            href={child.href}
                            className={cn(
                              "block px-3 py-1.5 rounded-md text-sm transition-colors",
                              isActive(child.href)
                                ? "bg-sidebar-accent text-sidebar-primary"
                                : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Cluster Info */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span>minikube</span>
        </div>
      </div>
    </aside>
  )
}
