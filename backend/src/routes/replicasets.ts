import { Router } from 'express'
import { appsV1Api } from '../config/k8s'
import { transformReplicaSet } from '../services/transformer'

const router = Router()

router.get('/replicasets', async (req, res, next) => {
  try {
    const { body } = await appsV1Api.listReplicaSetForAllNamespaces()
    const items = (body.items || []).map(transformReplicaSet)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/replicasets', async (req, res, next) => {
  try {
    const { body } = await appsV1Api.listNamespacedReplicaSet(req.params.namespace)
    const items = (body.items || []).map(transformReplicaSet)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/replicasets/:name', async (req, res, next) => {
  try {
    const { body } = await appsV1Api.readNamespacedReplicaSet(req.params.name, req.params.namespace)
    res.json({ data: transformReplicaSet(body) })
  } catch (err) { next(err) }
})

router.delete('/namespaces/:namespace/replicasets/:name', async (req, res, next) => {
  try {
    await appsV1Api.deleteNamespacedReplicaSet(req.params.name, req.params.namespace)
    res.json({ message: `ReplicaSet ${req.params.name} deleted` })
  } catch (err) { next(err) }
})

export default router
