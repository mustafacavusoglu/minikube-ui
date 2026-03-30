import { WebSocket } from 'ws'
import { IncomingMessage } from 'http'
import { URL } from 'url'
import stream from 'stream'
import { execClient } from '../config/k8s'

const MAX_SESSIONS = parseInt(process.env.MAX_TERMINAL_SESSIONS || '10', 10)
let activeSessions = 0

export function handleTerminalConnection(ws: WebSocket, req: IncomingMessage) {
  const params = new URL(req.url || '', `http://localhost`).searchParams
  const namespace = params.get('namespace') || 'default'
  const pod = params.get('pod') || ''
  const container = params.get('container') || undefined
  const shell = process.env.TERMINAL_SHELL || '/bin/sh'

  if (!pod) {
    ws.send(JSON.stringify({ type: 'error', message: 'pod parameter is required' }))
    ws.close()
    return
  }

  if (activeSessions >= MAX_SESSIONS) {
    ws.send(JSON.stringify({ type: 'error', message: 'Max terminal sessions reached' }))
    ws.close()
    return
  }

  activeSessions++
  console.log(`[terminal] New session: ${namespace}/${pod}${container ? '/' + container : ''} (active: ${activeSessions})`)

  // Streams for the exec session
  const stdin = new stream.PassThrough()
  const stdout = new stream.PassThrough()
  const stderr = new stream.PassThrough()

  // Forward stdout/stderr to WebSocket as binary
  stdout.on('data', (data: Buffer) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(data)
  })
  stderr.on('data', (data: Buffer) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(data)
  })

  // Start exec session
  execClient.exec(
    namespace,
    pod,
    container || '',
    [shell],
    stdout,
    stderr,
    stdin,
    true, // tty
    (status) => {
      console.log(`[terminal] Session ended: ${namespace}/${pod} status=${JSON.stringify(status)}`)
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'exit', status }))
        ws.close()
      }
    }
  ).then(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'ready' }))
    }
  }).catch((err: any) => {
    console.error(`[terminal] Exec error: ${err.message}`)
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'error', message: err.message }))
      ws.close()
    }
    activeSessions--
  })

  // Forward WebSocket messages to stdin
  ws.on('message', (data: Buffer | string) => {
    if (typeof data === 'string') {
      try {
        const msg = JSON.parse(data)
        if (msg.type === 'resize') {
          // Resize is handled by xterm.js addon-fit on client side for TTY
          // The K8s exec API resize would need a separate resize stream
        } else if (msg.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }))
        }
      } catch {
        // Not JSON, write as-is
        stdin.write(data)
      }
    } else {
      stdin.write(data)
    }
  })

  ws.on('close', () => {
    activeSessions--
    stdin.destroy()
    stdout.destroy()
    stderr.destroy()
    console.log(`[terminal] Session closed: ${namespace}/${pod} (active: ${activeSessions})`)
  })

  ws.on('error', (err) => {
    activeSessions--
    console.error(`[terminal] WebSocket error: ${err.message}`)
  })
}
