import { Request, Response, NextFunction } from 'express'

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err.statusCode || err.response?.statusCode || 500
  const message = err.message || 'Internal server error'

  // Kubernetes API errors have a body with message
  const k8sMessage = err.body?.message || err.response?.body?.message

  console.error(`[error] ${req.method} ${req.path}: ${k8sMessage || message}`)

  res.status(status).json({
    error: k8sMessage || message,
    code: status,
  })
}
