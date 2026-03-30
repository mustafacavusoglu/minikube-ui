import { Router } from 'express'
import { batchV1Api } from '../config/k8s'
import { transformCronJob } from '../services/transformer'

const router = Router()

router.get('/cronjobs', async (req, res, next) => {
  try {
    const { body } = await batchV1Api.listCronJobForAllNamespaces()
    const items = (body.items || []).map(transformCronJob)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/cronjobs', async (req, res, next) => {
  try {
    const { body } = await batchV1Api.listNamespacedCronJob(req.params.namespace)
    const items = (body.items || []).map(transformCronJob)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/namespaces/:namespace/cronjobs/:name', async (req, res, next) => {
  try {
    const { body } = await batchV1Api.readNamespacedCronJob(req.params.name, req.params.namespace)
    res.json({ data: transformCronJob(body) })
  } catch (err) { next(err) }
})

router.delete('/namespaces/:namespace/cronjobs/:name', async (req, res, next) => {
  try {
    await batchV1Api.deleteNamespacedCronJob(req.params.name, req.params.namespace)
    res.json({ message: `CronJob ${req.params.name} deleted` })
  } catch (err) { next(err) }
})

router.patch('/namespaces/:namespace/cronjobs/:name/suspend', async (req, res, next) => {
  try {
    const { suspend } = req.body
    const patch = [{ op: 'replace', path: '/spec/suspend', value: suspend }]
    await batchV1Api.patchNamespacedCronJob(
      req.params.name, req.params.namespace, patch,
      undefined, undefined, 'application/json-patch+json'
    )
    res.json({ message: `CronJob ${req.params.name} ${suspend ? 'suspended' : 'resumed'}` })
  } catch (err) { next(err) }
})

export default router
