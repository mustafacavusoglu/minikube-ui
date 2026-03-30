import { Router } from 'express'
import { coreV1Api } from '../config/k8s'
import { transformSecret } from '../services/transformer'

const router = Router()

router.get('/secrets', async (req, res, next) => {
  try {
    const { body } = await coreV1Api.listSecretForAllNamespaces()
    const items = (body.items || []).map(transformSecret)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/secrets', async (req, res, next) => {
  try {
    const { body } = await coreV1Api.listNamespacedSecret(req.params.namespace)
    const items = (body.items || []).map(transformSecret)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/secrets/:name', async (req, res, next) => {
  try {
    const { body } = await coreV1Api.readNamespacedSecret(req.params.name, req.params.namespace)
    res.json({ data: transformSecret(body) })
  } catch (err) { next(err) }
})

router.delete('/namespaces/:namespace/secrets/:name', async (req, res, next) => {
  try {
    await coreV1Api.deleteNamespacedSecret(req.params.name, req.params.namespace)
    res.json({ message: `Secret ${req.params.name} deleted` })
  } catch (err) { next(err) }
})

export default router
