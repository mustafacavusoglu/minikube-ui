import { Router } from 'express'
import { coreV1Api } from '../config/k8s'
import { transformServiceAccount } from '../services/transformer'

const router = Router()

router.get('/serviceaccounts', async (req, res, next) => {
  try {
    const { body } = await coreV1Api.listServiceAccountForAllNamespaces()
    const items = (body.items || []).map(transformServiceAccount)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/serviceaccounts', async (req, res, next) => {
  try {
    const { body } = await coreV1Api.listNamespacedServiceAccount(req.params.namespace)
    const items = (body.items || []).map(transformServiceAccount)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/serviceaccounts/:name', async (req, res, next) => {
  try {
    const { body } = await coreV1Api.readNamespacedServiceAccount(req.params.name, req.params.namespace)
    res.json({ data: transformServiceAccount(body) })
  } catch (err) { next(err) }
})

router.delete('/namespaces/:namespace/serviceaccounts/:name', async (req, res, next) => {
  try {
    await coreV1Api.deleteNamespacedServiceAccount(req.params.name, req.params.namespace)
    res.json({ message: `ServiceAccount ${req.params.name} deleted` })
  } catch (err) { next(err) }
})

export default router
