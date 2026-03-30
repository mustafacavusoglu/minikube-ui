import { Router } from 'express'
import { appsV1Api } from '../config/k8s'
import { transformDaemonSet } from '../services/transformer'

const router = Router()

router.get('/daemonsets', async (req, res, next) => {
  try {
    const { body } = await appsV1Api.listDaemonSetForAllNamespaces()
    const items = (body.items || []).map(transformDaemonSet)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/daemonsets', async (req, res, next) => {
  try {
    const { body } = await appsV1Api.listNamespacedDaemonSet(req.params.namespace)
    const items = (body.items || []).map(transformDaemonSet)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/daemonsets/:name', async (req, res, next) => {
  try {
    const { body } = await appsV1Api.readNamespacedDaemonSet(req.params.name, req.params.namespace)
    res.json({ data: transformDaemonSet(body) })
  } catch (err) { next(err) }
})

router.delete('/namespaces/:namespace/daemonsets/:name', async (req, res, next) => {
  try {
    await appsV1Api.deleteNamespacedDaemonSet(req.params.name, req.params.namespace)
    res.json({ message: `DaemonSet ${req.params.name} deleted` })
  } catch (err) { next(err) }
})

export default router
