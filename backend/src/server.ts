import 'dotenv/config'
import express from 'express'
import http from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import { URL } from 'url'
import { corsMiddleware } from './middleware/cors'
import { errorHandler } from './middleware/errorHandler'
import apiRouter from './routes/index'
import { handleTerminalConnection } from './websocket/terminal'
import { handleLogConnection } from './websocket/logs'

const app = express()
const PORT = parseInt(process.env.PORT || '3001', 10)

app.use(corsMiddleware)
app.use(express.json({ limit: '10mb' }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// All API routes
app.use('/api/v1', apiRouter)

// Error handler (must be last)
app.use(errorHandler)

// Create HTTP server and attach WebSocket server
const server = http.createServer(app)
const wss = new WebSocketServer({ noServer: true })

server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url || '', `http://localhost:${PORT}`).pathname

  if (pathname === '/ws/terminal') {
    wss.handleUpgrade(request, socket as any, head, (ws) => {
      handleTerminalConnection(ws, request)
    })
  } else if (pathname === '/ws/logs') {
    wss.handleUpgrade(request, socket as any, head, (ws) => {
      handleLogConnection(ws, request)
    })
  } else {
    socket.destroy()
  }
})

server.listen(PORT, () => {
  console.log(`[server] Minikube UI backend running on http://localhost:${PORT}`)
  console.log(`[server] WebSocket terminal: ws://localhost:${PORT}/ws/terminal`)
  console.log(`[server] WebSocket logs:     ws://localhost:${PORT}/ws/logs`)
})

export default app
