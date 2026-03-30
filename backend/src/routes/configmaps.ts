import { Router } from 'express'
import { coreV1Api } from '../config/k8s'
import { transformConfigMap } from '../services/transformer'

const router = Router()

router.get('/configmaps', async (req, res, next) => {
  try {
    const { body } = await coreV1Api.listConfigMapForAllNamespaces()
    const items = (body.items || []).map(transformConfigMap)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/configmaps', async (req, res, next) => {
  try {
    const { body } = await coreV1Api.listNamespacedConfigMap(req.params.namespace)
    const items = (body.items || []).map(transformConfigMap)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/configmaps/:name', async (req, res, next) => {
  try {
    const { body } = await coreV1Api.readNamespacedConfigMap(req.params.name, req.params.namespace)
    res.json({ data: transformConfigMap(body) })
  } catch (err) { next(err) }
})

router.delete('/namespaces/:namespace/configmaps/:name', async (req, res, next) => {
  try {
    await coreV1Api.deleteNamespacedConfigMap(req.params.name, req.params.namespace)
    res.json({ message: `ConfigMap ${req.params.name} deleted` })
  } catch (err) { next(err) }
})

export default router
