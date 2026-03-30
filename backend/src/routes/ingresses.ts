import { Router } from 'express'
import { networkingV1Api } from '../config/k8s'
import { transformIngress } from '../services/transformer'

const router = Router()

router.get('/ingresses', async (req, res, next) => {
  try {
    const { body } = await networkingV1Api.listIngressForAllNamespaces()
    const items = (body.items || []).map(transformIngress)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/ingresses', async (req, res, next) => {
  try {
    const { body } = await networkingV1Api.listNamespacedIngress(req.params.namespace)
    const items = (body.items || []).map(transformIngress)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/ingresses/:name', async (req, res, next) => {
  try {
    const { body } = await networkingV1Api.readNamespacedIngress(req.params.name, req.params.namespace)
    res.json({ data: transformIngress(body) })
  } catch (err) { next(err) }
})

router.delete('/namespaces/:namespace/ingresses/:name', async (req, res, next) => {
  try {
    await networkingV1Api.deleteNamespacedIngress(req.params.name, req.params.namespace)
    res.json({ message: `Ingress ${req.params.name} deleted` })
  } catch (err) { next(err) }
})

export default router
