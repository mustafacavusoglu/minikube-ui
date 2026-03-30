import { Router } from 'express'
import { storageV1Api } from '../config/k8s'
import { transformStorageClass } from '../services/transformer'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const { body } = await storageV1Api.listStorageClass()
    const items = (body.items || []).map(transformStorageClass)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/:name', async (req, res, next) => {
  try {
    const { body } = await storageV1Api.readStorageClass(req.params.name)
    res.json({ data: transformStorageClass(body) })
  } catch (err) { next(err) }
})

router.delete('/:name', async (req, res, next) => {
  try {
    await storageV1Api.deleteStorageClass(req.params.name)
    res.json({ message: `StorageClass ${req.params.name} deleted` })
  } catch (err) { next(err) }
})

export default router
