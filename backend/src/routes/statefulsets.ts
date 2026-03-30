import { Router } from 'express'
import { appsV1Api } from '../config/k8s'
import { transformStatefulSet } from '../services/transformer'

const router = Router()

router.get('/statefulsets', async (req, res, next) => {
  try {
    const { body } = await appsV1Api.listStatefulSetForAllNamespaces()
    const items = (body.items || []).map(transformStatefulSet)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/statefulsets', async (req, res, next) => {
  try {
    const { body } = await appsV1Api.listNamespacedStatefulSet(req.params.namespace)
    const items = (body.items || []).map(transformStatefulSet)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/statefulsets/:name', async (req, res, next) => {
  try {
    const { body } = await appsV1Api.readNamespacedStatefulSet(req.params.name, req.params.namespace)
    res.json({ data: transformStatefulSet(body) })
  } catch (err) { next(err) }
})

router.delete('/namespaces/:namespace/statefulsets/:name', async (req, res, next) => {
  try {
    await appsV1Api.deleteNamespacedStatefulSet(req.params.name, req.params.namespace)
    res.json({ message: `StatefulSet ${req.params.name} deleted` })
  } catch (err) { next(err) }
})

export default router
