import { Router } from 'express'
import { coreV1Api } from '../config/k8s'
import { transformNode } from '../services/transformer'
import { getNodeMetrics } from '../services/metrics'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const { body } = await coreV1Api.listNode()
    const nodes = (body.items || []).map(transformNode)
    res.json({ data: nodes, total: nodes.length })
  } catch (err) { next(err) }
})

router.get('/:name', async (req, res, next) => {
  try {
    const { body } = await coreV1Api.readNode(req.params.name)
    res.json({ data: transformNode(body) })
  } catch (err) { next(err) }
})

router.get('/:name/metrics', async (req, res, next) => {
  try {
    const result = await getNodeMetrics()
    if (!result.available) return res.json({ available: false, data: null })
    const item = result.items.find((i: any) => i.metadata?.name === req.params.name)
    res.json({ available: true, data: item || null })
  } catch (err) { next(err) }
})

export default router
