"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Terminal } from "lucide-react"
import { usePods } from "@/hooks/use-resource"
import { useNamespace } from "@/contexts/namespace-context"
import dynamic from "next/dynamic"

const PodTerminal = dynamic(
  () => import("./pod-terminal").then(m => ({ default: m.PodTerminal })),
  { ssr: false }
)

interface PodTerminalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultNamespace?: string
  defaultPod?: string
  defaultContainer?: string
}

export function PodTerminalDialog({
  open,
  onOpenChange,
  defaultNamespace,
  defaultPod,
  defaultContainer,
}: PodTerminalDialogProps) {
  const { namespace: globalNs } = useNamespace()
  const effectiveNs = defaultNamespace || (globalNs === 'All Namespaces' ? 'default' : globalNs)

  const { data: pods = [] } = usePods(effectiveNs === 'default' ? undefined : effectiveNs)
  const [selectedPod, setSelectedPod] = useState(defaultPod || '')
  const [selectedContainer, setSelectedContainer] = useState(defaultContainer || '')
  const [connected, setConnected] = useState(false)

  const runningPods = pods.filter((p: any) => p.status === 'Running')
  const selectedPodObj = runningPods.find((p: any) => p.name === selectedPod)
  const containers = selectedPodObj?.containers || []

  const handleConnect = () => {
    if (selectedPod) setConnected(true)
  }

  const handleClose = (v: boolean) => {
    if (!v) {
      setConnected(false)
      setSelectedPod(defaultPod || '')
      setSelectedContainer(defaultContainer || '')
    }
    onOpenChange(v)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent aria-describedby={undefined} className="max-w-4xl w-full h-[600px] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 py-3 border-b border-border flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Terminal className="h-4 w-4" />
            Pod Terminal
            {connected && selectedPod && (
              <span className="text-muted-foreground text-sm font-normal ml-1">
                — {effectiveNs}/{selectedPod}{selectedContainer ? `/${selectedContainer}` : ''}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {!connected ? (
          <div className="flex flex-col gap-4 p-6">
            <p className="text-sm text-muted-foreground">Select a running pod to open a terminal session.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Pod</label>
                <Select value={selectedPod} onValueChange={v => { setSelectedPod(v); setSelectedContainer('') }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a pod..." />
                  </SelectTrigger>
                  <SelectContent>
                    {runningPods.map((p: any) => (
                      <SelectItem key={p.name} value={p.name}>
                        {p.namespace}/{p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {containers.length > 1 && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground">Container</label>
                  <Select value={selectedContainer} onValueChange={setSelectedContainer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select container..." />
                    </SelectTrigger>
                    <SelectContent>
                      {containers.map((c: any) => (
                        <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <Button
              onClick={handleConnect}
              disabled={!selectedPod}
              className="w-fit"
            >
              <Terminal className="h-4 w-4 mr-2" />
              Connect
            </Button>
          </div>
        ) : (
          <div className="flex-1 p-2 min-h-0">
            <PodTerminal
              namespace={selectedPodObj?.namespace || effectiveNs}
              pod={selectedPod}
              container={selectedContainer || undefined}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
