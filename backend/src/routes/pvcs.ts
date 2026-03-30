import { Router } from 'express'
import { coreV1Api } from '../config/k8s'
import { transformPVC } from '../services/transformer'

const router = Router()

router.get('/pvcs', async (req, res, next) => {
  try {
    const { body } = await coreV1Api.listPersistentVolumeClaimForAllNamespaces()
    const items = (body.items || []).map(transformPVC)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/pvcs', async (req, res, next) => {
  try {
    const { body } = await coreV1Api.listNamespacedPersistentVolumeClaim(req.params.namespace)
    const items = (body.items || []).map(transformPVC)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/pvcs/:name', async (req, res, next) => {
  try {
    const { body } = await coreV1Api.readNamespacedPersistentVolumeClaim(req.params.name, req.params.namespace)
    res.json({ data: transformPVC(body) })
  } catch (err) { next(err) }
})

router.delete('/namespaces/:namespace/pvcs/:name', async (req, res, next) => {
  try {
    await coreV1Api.deleteNamespacedPersistentVolumeClaim(req.params.name, req.params.namespace)
    res.json({ message: `PVC ${req.params.name} deleted` })
  } catch (err) { next(err) }
})

export default router
