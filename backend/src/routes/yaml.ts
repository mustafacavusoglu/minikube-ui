import { Router } from 'express'
import yaml from 'js-yaml'
import { coreV1Api, appsV1Api, batchV1Api, networkingV1Api } from '../config/k8s'

async function createResource(resource: string, namespace: string, body: any): Promise<any> {
  switch (resource) {
    case 'pods':            return (await coreV1Api.createNamespacedPod(namespace, body)).body
    case 'services':        return (await coreV1Api.createNamespacedService(namespace, body)).body
    case 'pvcs':            return (await coreV1Api.createNamespacedPersistentVolumeClaim(namespace, body)).body
    case 'serviceaccounts': return (await coreV1Api.createNamespacedServiceAccount(namespace, body)).body
    case 'ingresses':       return (await networkingV1Api.createNamespacedIngress(namespace, body)).body
    case 'configmaps':      return (await coreV1Api.createNamespacedConfigMap(namespace, body)).body
    case 'secrets':         return (await coreV1Api.createNamespacedSecret(namespace, body)).body
    case 'deployments':     return (await appsV1Api.createNamespacedDeployment(namespace, body)).body
    case 'namespaces':      return (await coreV1Api.createNamespace(body)).body
    default: throw Object.assign(new Error(`Create not supported for: ${resource}`), { statusCode: 400 })
  }
}

const router = Router()

// Strip class instances → plain JSON-serialisable object
function toPlain(obj: any): any {
  return JSON.parse(JSON.stringify(obj))
}

async function readResource(resource: string, name: string, namespace: string): Promise<any> {
  let body: any
  switch (resource) {
    case 'pods':            body = (await coreV1Api.readNamespacedPod(name, namespace)).body; break
    case 'deployments':     body = (await appsV1Api.readNamespacedDeployment(name, namespace)).body; break
    case 'statefulsets':    body = (await appsV1Api.readNamespacedStatefulSet(name, namespace)).body; break
    case 'daemonsets':      body = (await appsV1Api.readNamespacedDaemonSet(name, namespace)).body; break
    case 'jobs':            body = (await batchV1Api.readNamespacedJob(name, namespace)).body; break
    case 'cronjobs':        body = (await batchV1Api.readNamespacedCronJob(name, namespace)).body; break
    case 'services':        body = (await coreV1Api.readNamespacedService(name, namespace)).body; break
    case 'ingresses':       body = (await networkingV1Api.readNamespacedIngress(name, namespace)).body; break
    case 'pvcs':            body = (await coreV1Api.readNamespacedPersistentVolumeClaim(name, namespace)).body; break
    case 'configmaps':      body = (await coreV1Api.readNamespacedConfigMap(name, namespace)).body; break
    case 'secrets':         body = (await coreV1Api.readNamespacedSecret(name, namespace)).body; break
    case 'serviceaccounts': body = (await coreV1Api.readNamespacedServiceAccount(name, namespace)).body; break
    default: throw Object.assign(new Error(`Unknown resource: ${resource}`), { statusCode: 400 })
  }
  // Remove server-managed fields that cause conflicts on apply
  const plain = toPlain(body)
  delete plain.metadata?.managedFields
  delete plain.metadata?.resourceVersion
  delete plain.metadata?.generation
  delete plain.metadata?.uid
  delete plain.metadata?.creationTimestamp
  delete plain.status
  return plain
}

// Merge-patch: send only the fields we want to update
async function applyResource(resource: string, name: string, namespace: string, body: any): Promise<void> {
  const specPatch = { spec: body.spec }
  const dataPatch = { data: body.data }
  const mergeOpts = { headers: { 'Content-Type': 'application/merge-patch+json' } }
  switch (resource) {
    case 'deployments':  await appsV1Api.patchNamespacedDeployment(name, namespace, specPatch, undefined, undefined, undefined, undefined, undefined, mergeOpts); break
    case 'statefulsets': await appsV1Api.patchNamespacedStatefulSet(name, namespace, specPatch, undefined, undefined, undefined, undefined, undefined, mergeOpts); break
    case 'daemonsets':   await appsV1Api.patchNamespacedDaemonSet(name, namespace, specPatch, undefined, undefined, undefined, undefined, undefined, mergeOpts); break
    case 'jobs':         await batchV1Api.patchNamespacedJob(name, namespace, specPatch, undefined, undefined, undefined, undefined, undefined, mergeOpts); break
    case 'cronjobs':     await batchV1Api.patchNamespacedCronJob(name, namespace, specPatch, undefined, undefined, undefined, undefined, undefined, mergeOpts); break
    case 'services':     await coreV1Api.patchNamespacedService(name, namespace, specPatch, undefined, undefined, undefined, undefined, undefined, mergeOpts); break
    case 'ingresses':    await networkingV1Api.patchNamespacedIngress(name, namespace, specPatch, undefined, undefined, undefined, undefined, undefined, mergeOpts); break
    case 'configmaps':   await coreV1Api.patchNamespacedConfigMap(name, namespace, dataPatch, undefined, undefined, undefined, undefined, undefined, mergeOpts); break
    default: throw Object.assign(new Error(`YAML edit not supported for: ${resource}`), { statusCode: 400 })
  }
}

// POST /api/v1/create
router.post('/create', async (req, res, next) => {
  try {
    const { resource, yamlContent } = req.body
    if (!resource || !yamlContent) {
      return res.status(400).json({ error: 'resource and yamlContent are required' })
    }
    const parsed = yaml.load(yamlContent) as any
    const namespace = parsed?.metadata?.namespace || 'default'
    const created = await createResource(resource, namespace, parsed)
    res.json({ message: `${resource}/${parsed?.metadata?.name} created`, data: created })
  } catch (err) {
    next(err)
  }
})

// GET /api/v1/namespaces/:namespace/:resource/:name/yaml
router.get('/namespaces/:namespace/:resource/:name/yaml', async (req, res, next) => {
  try {
    const obj = await readResource(req.params.resource, req.params.name, req.params.namespace)
    const yamlStr = yaml.dump(obj, { noRefs: true, lineWidth: 120, skipInvalid: true })
    res.set('Content-Type', 'text/yaml')
    res.send(yamlStr)
  } catch (err) {
    next(err)
  }
})

// PUT /api/v1/namespaces/:namespace/:resource/:name/yaml
router.put('/namespaces/:namespace/:resource/:name/yaml', async (req, res, next) => {
  try {
    const { yamlContent } = req.body
    if (!yamlContent) {
      return res.status(400).json({ error: 'yamlContent is required' })
    }
    const parsed = yaml.load(yamlContent) as any
    await applyResource(req.params.resource, req.params.name, req.params.namespace, parsed)
    res.json({ message: `${req.params.resource}/${req.params.name} updated` })
  } catch (err) {
    next(err)
  }
})

export default router
