import { Router } from 'express'
import { coreV1Api } from '../config/k8s'
import { transformService } from '../services/transformer'

const router = Router()

router.get('/services', async (req, res, next) => {
  try {
    const { body } = await coreV1Api.listServiceForAllNamespaces()
    const items = (body.items || []).map(transformService)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/services', async (req, res, next) => {
  try {
    const { body } = await coreV1Api.listNamespacedService(req.params.namespace)
    const items = (body.items || []).map(transformService)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/services/:name', async (req, res, next) => {
  try {
    const { body } = await coreV1Api.readNamespacedService(req.params.name, req.params.namespace)
    res.json({ data: transformService(body) })
  } catch (err) { next(err) }
})

router.delete('/namespaces/:namespace/services/:name', async (req, res, next) => {
  try {
    await coreV1Api.deleteNamespacedService(req.params.name, req.params.namespace)
    res.json({ message: `Service ${req.params.name} deleted` })
  } catch (err) { next(err) }
})

export default router
