import { Router } from 'express'
import { coreV1Api } from '../config/k8s'
import { transformEvent } from '../services/transformer'

const router = Router()

router.get('/events', async (req, res, next) => {
  try {
    const fieldSelector = req.query.fieldSelector as string | undefined
    const { body } = await coreV1Api.listEventForAllNamespaces(
      undefined, undefined, fieldSelector
    )
    const items = (body.items || []).map(transformEvent)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/events', async (req, res, next) => {
  try {
    const fieldSelector = req.query.fieldSelector as string | undefined
    const { body } = await coreV1Api.listNamespacedEvent(
      req.params.namespace,
      undefined, undefined, undefined, fieldSelector
    )
    const items = (body.items || []).map(transformEvent)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

export default router
