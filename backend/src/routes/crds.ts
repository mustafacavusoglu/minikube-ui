import { Router } from 'express'
import { apiextensionsV1Api } from '../config/k8s'
import { transformCRD } from '../services/transformer'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const { body } = await apiextensionsV1Api.listCustomResourceDefinition()
    const items = (body.items || []).map(transformCRD)
    res.json({ data: items, total: items.length })
  } catch (err) { next(err) }
})

router.get('/:name', async (req, res, next) => {
  try {
    const { body } = await apiextensionsV1Api.readCustomResourceDefinition(req.params.name)
    res.json({ data: transformCRD(body) })
  } catch (err) { next(err) }
})

router.delete('/:name', async (req, res, next) => {
  try {
    await apiextensionsV1Api.deleteCustomResourceDefinition(req.params.name)
    res.json({ message: `CRD ${req.params.name} deleted` })
  } catch (err) { next(err) }
})

export default router
