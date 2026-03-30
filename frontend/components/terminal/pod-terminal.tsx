"use client"

import { useEffect, useRef } from "react"
import { getTerminalWsUrl } from "@/lib/api-client"

interface PodTerminalProps {
  namespace: string
  pod: string
  container?: string
}

export function PodTerminal({ namespace, pod, container }: PodTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<any>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const fitAddonRef = useRef<any>(null)

  useEffect(() => {
    if (!terminalRef.current) return

    let term: any
    let fitAddon: any
    let ws: WebSocket

    async function init() {
      const { Terminal } = await import('@xterm/xterm')
      const { FitAddon } = await import('@xterm/addon-fit')
      const { WebLinksAddon } = await import('@xterm/addon-web-links')

      // Dynamically import xterm CSS
      await import('@xterm/xterm/css/xterm.css')

      term = new Terminal({
        cursorBlink: true,
        fontFamily: 'var(--font-mono), "Red Hat Mono", monospace',
        fontSize: 14,
        theme: {
          background: '#0d1117',
          foreground: '#c9d1d9',
          cursor: '#58a6ff',
          selectionBackground: '#264f78',
          black: '#0d1117',
          red: '#ff7b72',
          green: '#3fb950',
          yellow: '#d29922',
          blue: '#58a6ff',
          magenta: '#bc8cff',
          cyan: '#76e3ea',
          white: '#c9d1d9',
        },
      })

      fitAddon = new FitAddon()
      term.loadAddon(fitAddon)
      term.loadAddon(new WebLinksAddon())

      term.open(terminalRef.current!)
      fitAddon.fit()

      xtermRef.current = term
      fitAddonRef.current = fitAddon

      term.write('\r\n\x1b[33mConnecting to pod...\x1b[0m\r\n')

      const url = getTerminalWsUrl(namespace, pod, container)
      ws = new WebSocket(url)
      wsRef.current = ws
      ws.binaryType = 'arraybuffer'

      ws.onopen = () => {
        term.write('\x1b[32mConnected.\x1b[0m\r\n')
      }

      ws.onmessage = (event) => {
        if (typeof event.data === 'string') {
          try {
            const msg = JSON.parse(event.data)
            if (msg.type === 'error') {
              term.write(`\r\n\x1b[31mError: ${msg.message}\x1b[0m\r\n`)
            } else if (msg.type === 'exit') {
              term.write('\r\n\x1b[33mSession ended.\x1b[0m\r\n')
            }
          } catch {
            term.write(event.data)
          }
        } else {
          const data = new Uint8Array(event.data)
          term.write(data)
        }
      }

      ws.onerror = () => {
        term.write('\r\n\x1b[31mWebSocket error. Is the backend running?\x1b[0m\r\n')
      }

      ws.onclose = () => {
        term.write('\r\n\x1b[33mConnection closed.\x1b[0m\r\n')
      }

      // Forward keystrokes to backend
      term.onData((data: string) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(data)
        }
      })

      // Handle resize
      const observer = new ResizeObserver(() => {
        fitAddon.fit()
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'resize', cols: term.cols, rows: term.rows }))
        }
      })
      if (terminalRef.current) observer.observe(terminalRef.current)

      return () => observer.disconnect()
    }

    const cleanup = init()

    return () => {
      cleanup.then(fn => fn?.())
      ws?.close()
      term?.dispose()
    }
  }, [namespace, pod, container])

  return (
    <div
      ref={terminalRef}
      className="w-full h-full min-h-[400px] rounded-md overflow-hidden"
      style={{ background: '#0d1117' }}
    />
  )
}
