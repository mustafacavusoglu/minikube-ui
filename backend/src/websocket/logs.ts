import { WebSocket } from 'ws'
import { IncomingMessage } from 'http'
import { URL } from 'url'
import stream from 'stream'
import { logClient } from '../config/k8s'

export function handleLogConnection(ws: WebSocket, req: IncomingMessage) {
  const params = new URL(req.url || '', `http://localhost`).searchParams
  const namespace = params.get('namespace') || 'default'
  const pod = params.get('pod') || ''
  const container = params.get('container') || undefined
  const tailLines = parseInt(params.get('tailLines') || '100', 10)

  if (!pod) {
    ws.send(JSON.stringify({ type: 'error', message: 'pod parameter is required' }))
    ws.close()
    return
  }

  console.log(`[logs] New stream: ${namespace}/${pod}${container ? '/' + container : ''}`)

  const logStream = new stream.PassThrough()

  logStream.on('data', (chunk: Buffer) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(chunk.toString())
    }
  })

  logStream.on('error', (err) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'error', message: err.message }))
      ws.close()
    }
  })

  logStream.on('end', () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'end' }))
      ws.close()
    }
  })

  logClient.log(
    namespace,
    pod,
    container || '',
    logStream,
    { follow: true, tailLines, pretty: false, timestamps: true }
  ).then((req) => {
    // Store the request so we can abort on WS close
    ws.on('close', () => {
      try { req.abort() } catch {}
      logStream.destroy()
      console.log(`[logs] Stream closed: ${namespace}/${pod}`)
    })
  }).catch((err: any) => {
    console.error(`[logs] Error: ${err.message}`)
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'error', message: err.message }))
      ws.close()
    }
  })

  ws.on('error', (err) => {
    console.error(`[logs] WebSocket error: ${err.message}`)
    logStream.destroy()
  })
}
