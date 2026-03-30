import { Router } from 'express'
import { appsV1Api } from '../config/k8s'
import { transformDeployment } from '../services/transformer'

const router = Router()

router.get('/deployments', async (req, res, next) => {
  try {
    const { body } = await appsV1Api.listDeploymentForAllNamespaces()
    const items = (body.items || []).map(transformDeployment)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/deployments', async (req, res, next) => {
  try {
    const { body } = await appsV1Api.listNamespacedDeployment(req.params.namespace)
    const items = (body.items || []).map(transformDeployment)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/deployments/:name', async (req, res, next) => {
  try {
    const { body } = await appsV1Api.readNamespacedDeployment(req.params.name, req.params.namespace)
    res.json({ data: transformDeployment(body) })
  } catch (err) { next(err) }
})

router.delete('/namespaces/:namespace/deployments/:name', async (req, res, next) => {
  try {
    await appsV1Api.deleteNamespacedDeployment(req.params.name, req.params.namespace)
    res.json({ message: `Deployment ${req.params.name} deleted` })
  } catch (err) { next(err) }
})

router.patch('/namespaces/:namespace/deployments/:name/scale', async (req, res, next) => {
  try {
    const { replicas } = req.body
    const patch = [{ op: 'replace', path: '/spec/replicas', value: replicas }]
    const { body } = await appsV1Api.patchNamespacedDeploymentScale(
      req.params.name,
      req.params.namespace,
      patch,
      undefined, undefined,
      'application/json-patch+json'
    )
    res.json({ data: { replicas: body.spec?.replicas } })
  } catch (err) { next(err) }
})

export default router
