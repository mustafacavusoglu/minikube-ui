import cors from 'cors'

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'

export const corsMiddleware = cors({
  origin: [corsOrigin, 'http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
})
