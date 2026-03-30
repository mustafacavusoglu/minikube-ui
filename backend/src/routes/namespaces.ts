import { Router } from 'express'
import { coreV1Api } from '../config/k8s'
import { transformNamespace } from '../services/transformer'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const { body } = await coreV1Api.listNamespace()
    const namespaces = (body.items || []).map(transformNamespace)
    res.json({ data: namespaces, total: namespaces.length })
  } catch (err) { next(err) }
})

router.get('/:name', async (req, res, next) => {
  try {
    const { body } = await coreV1Api.readNamespace(req.params.name)
    res.json({ data: transformNamespace(body) })
  } catch (err) { next(err) }
})

export default router
