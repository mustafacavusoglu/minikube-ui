import { Router } from 'express'
import { customObjectsApi } from '../config/k8s'
import { computeAge } from '../services/transformer'

const router = Router()

// GET /api/v1/namespaces/:namespace/custom-resources/:group/:version/:plural
router.get('/namespaces/:namespace/custom-resources/:group/:version/:plural', async (req, res, next) => {
  try {
    const { namespace, group, version, plural } = req.params
    const response: any = await customObjectsApi.listNamespacedCustomObject(
      group, version, namespace, plural
    )
    const items = (response.items || []).map((item: any) => ({
      name: item.metadata?.name,
      namespace: item.metadata?.namespace,
      age: computeAge(item.metadata?.creationTimestamp),
      status: item.status,
      spec: item.spec,
      labels: item.metadata?.labels || {},
      ownerReferences: (item.metadata?.ownerReferences || []).map((ref: any) => ({
        kind: ref.kind,
        name: ref.name,
        uid: ref.uid,
        controller: ref.controller,
      })),
    }))
    res.json({ data: items, total: items.length, available: true })
  } catch (err: any) {
    // CRD not installed — return empty gracefully
    const status = err.statusCode || err.response?.statusCode
    if (status === 404 || status === 405) {
      return res.json({ data: [], total: 0, available: false })
    }
    next(err)
  }
})

// GET /api/v1/custom-resources/:group/:version/:plural  (cluster-scoped)
router.get('/custom-resources/:group/:version/:plural', async (req, res, next) => {
  try {
    const { group, version, plural } = req.params
    const response: any = await customObjectsApi.listClusterCustomObject(group, version, plural)
    const items = (response.items || []).map((item: any) => ({
      name: item.metadata?.name,
      namespace: item.metadata?.namespace,
      age: computeAge(item.metadata?.creationTimestamp),
      status: item.status,
      spec: item.spec,
      labels: item.metadata?.labels || {},
      ownerReferences: (item.metadata?.ownerReferences || []).map((ref: any) => ({
        kind: ref.kind, name: ref.name, uid: ref.uid, controller: ref.controller,
      })),
    }))
    res.json({ data: items, total: items.length, available: true })
  } catch (err: any) {
    const status = err.statusCode || err.response?.statusCode
    if (status === 404 || status === 405) {
      return res.json({ data: [], total: 0, available: false })
    }
    next(err)
  }
})

export default router
