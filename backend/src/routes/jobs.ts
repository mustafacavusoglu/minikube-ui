import { Router } from 'express'
import { batchV1Api } from '../config/k8s'
import { transformJob } from '../services/transformer'

const router = Router()

router.get('/jobs', async (req, res, next) => {
  try {
    const { body } = await batchV1Api.listJobForAllNamespaces()
    const items = (body.items || []).map(transformJob)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/jobs', async (req, res, next) => {
  try {
    const { body } = await batchV1Api.listNamespacedJob(req.params.namespace)
    const items = (body.items || []).map(transformJob)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/jobs/:name', async (req, res, next) => {
  try {
    const { body } = await batchV1Api.readNamespacedJob(req.params.name, req.params.namespace)
    res.json({ data: transformJob(body) })
  } catch (err) { next(err) }
})

router.delete('/namespaces/:namespace/jobs/:name', async (req, res, next) => {
  try {
    await batchV1Api.deleteNamespacedJob(req.params.name, req.params.namespace)
    res.json({ message: `Job ${req.params.name} deleted` })
  } catch (err) { next(err) }
})

export default router
