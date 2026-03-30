import { Router } from 'express'
import { coreV1Api } from '../config/k8s'
import { transformPod } from '../services/transformer'

const router = Router()

router.get('/pods', async (req, res, next) => {
  try {
    const { body } = await coreV1Api.listPodForAllNamespaces(
      undefined, undefined, undefined,
      req.query.labelSelector as string | undefined
    )
    const pods = (body.items || []).map(transformPod)
    res.json({ data: pods, total: pods.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/pods', async (req, res, next) => {
  try {
    const { body } = await coreV1Api.listNamespacedPod(
      req.params.namespace,
      undefined, undefined, undefined, undefined,
      req.query.labelSelector as string | undefined
    )
    const pods = (body.items || []).map(transformPod)
    res.json({ data: pods, total: pods.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/pods/:name', async (req, res, next) => {
  try {
    const { body } = await coreV1Api.readNamespacedPod(req.params.name, req.params.namespace)
    res.json({ data: transformPod(body) })
  } catch (err) { next(err) }
})

router.delete('/namespaces/:namespace/pods/:name', async (req, res, next) => {
  try {
    await coreV1Api.deleteNamespacedPod(req.params.name, req.params.namespace)
    res.json({ message: `Pod ${req.params.name} deleted` })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/pods/:name/logs', async (req, res, next) => {
  try {
    const { container, tailLines, follow } = req.query
    const { body } = await coreV1Api.readNamespacedPodLog(
      req.params.name,
      req.params.namespace,
      container as string | undefined,
      follow === 'true',
      undefined, undefined, undefined, undefined,
      tailLines ? parseInt(tailLines as string) : 100
    )
    res.set('Content-Type', 'text/plain')
    res.send(body)
  } catch (err) { next(err) }
})

export default router
