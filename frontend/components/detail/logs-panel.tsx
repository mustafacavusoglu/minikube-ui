"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getLogsWsUrl } from "@/lib/api-client"
import { Play, Square, Trash2, Download } from "lucide-react"

interface LogsPanelProps {
  namespace: string
  pod: string
  containers: { name: string }[]
}

export function LogsPanel({ namespace, pod, containers }: LogsPanelProps) {
  const [container, setContainer] = useState(containers[0]?.name || '')
  const [lines, setLines] = useState<string[]>([])
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const autoScrollRef = useRef(true)

  const stop = useCallback(() => {
    wsRef.current?.close()
    wsRef.current = null
    setConnected(false)
  }, [])

  const start = useCallback(() => {
    stop()
    setLines([])
    const url = getLogsWsUrl(namespace, pod, container, 200)
    const ws = new WebSocket(url)
    wsRef.current = ws
    setConnected(true)

    ws.onmessage = (e) => {
      if (typeof e.data === 'string') {
        try {
          const msg = JSON.parse(e.data)
          if (msg.type === 'error') setLines(l => [...l, `\x1b[31m[error] ${msg.message}\x1b[0m`])
          else if (msg.type === 'end') setConnected(false)
        } catch {
          // Raw log line — split on newlines
          const newLines = e.data.split('\n').filter(Boolean)
          setLines(l => [...l, ...newLines])
        }
      }
    }
    ws.onerror = () => {
      setLines(l => [...l, '[error] WebSocket connection failed'])
      setConnected(false)
    }
    ws.onclose = () => setConnected(false)
  }, [namespace, pod, container, stop])

  // Auto-start on mount / container change
  useEffect(() => {
    start()
    return () => stop()
  }, [container]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll
  useEffect(() => {
    if (autoScrollRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines])

  const handleScroll = () => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    autoScrollRef.current = scrollHeight - scrollTop - clientHeight < 40
  }

  const downloadLogs = () => {
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${pod}-${container}.log`
    a.click()
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        {containers.length > 1 && (
          <Select value={container} onValueChange={setContainer}>
            <SelectTrigger className="w-48 bg-secondary border-border h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {containers.map(c => (
                <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <div className="flex items-center gap-2 ml-auto">
          {connected ? (
            <Button size="sm" variant="outline" onClick={stop} className="gap-1.5 h-8">
              <Square className="h-3 w-3 fill-current" /> Stop
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={start} className="gap-1.5 h-8">
              <Play className="h-3 w-3 fill-current" /> Stream
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setLines([])} className="gap-1.5 h-8">
            <Trash2 className="h-3 w-3" /> Clear
          </Button>
          <Button size="sm" variant="ghost" onClick={downloadLogs} disabled={lines.length === 0} className="gap-1.5 h-8">
            <Download className="h-3 w-3" /> Download
          </Button>
        </div>
        {connected && (
          <span className="flex items-center gap-1.5 text-xs text-success">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            Live
          </span>
        )}
      </div>

      {/* Log output */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="bg-[#0d1117] rounded-lg border border-border font-mono text-xs leading-5 text-[#c9d1d9] overflow-auto"
        style={{ height: 'calc(100vh - 320px)', minHeight: 400 }}
      >
        {lines.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Waiting for logs…
          </div>
        ) : (
          <div className="p-4 space-y-px">
            {lines.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap break-all hover:bg-white/5 px-1 rounded">
                <span className="text-muted-foreground/40 select-none mr-3 text-[10px]">
                  {String(i + 1).padStart(4, ' ')}
                </span>
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
