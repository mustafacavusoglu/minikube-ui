import { Router } from 'express'
import { coreV1Api, appsV1Api, versionApi, kc } from '../config/k8s'
import { getNodeMetrics, generateStubHistory } from '../services/metrics'

const router = Router()

router.get('/stats', async (req, res, next) => {
  try {
    const [pods, deployments, services, pvcs, namespaces, nodes] = await Promise.all([
      coreV1Api.listPodForAllNamespaces(),
      appsV1Api.listDeploymentForAllNamespaces(),
      coreV1Api.listServiceForAllNamespaces(),
      coreV1Api.listPersistentVolumeClaimForAllNamespaces(),
      coreV1Api.listNamespace(),
      coreV1Api.listNode(),
    ])

    const podItems = pods.body.items || []
    const runningPods = podItems.filter(p => p.status?.phase === 'Running').length
    const pendingPods = podItems.filter(p => p.status?.phase === 'Pending').length
    const failedPods = podItems.filter(p => p.status?.phase === 'Failed').length

    res.json({
      data: {
        pods: { total: podItems.length, running: runningPods, pending: pendingPods, failed: failedPods },
        deployments: (deployments.body.items || []).length,
        services: (services.body.items || []).length,
        pvcs: (pvcs.body.items || []).length,
        namespaces: (namespaces.body.items || []).length,
        nodes: (nodes.body.items || []).length,
      }
    })
  } catch (err) { next(err) }
})

router.get('/metrics/cpu-history', async (req, res, next) => {
  try {
    const result = await getNodeMetrics()
    res.json({ available: result.available, data: generateStubHistory() })
  } catch (err) { next(err) }
})

router.get('/metrics/memory-history', async (req, res, next) => {
  try {
    const result = await getNodeMetrics()
    res.json({ available: result.available, data: generateStubHistory() })
  } catch (err) { next(err) }
})

router.get('/info', async (req, res, next) => {
  try {
    const { body: version } = await versionApi.getCode()
    const currentContext = kc.getCurrentContext()
    const currentCluster = kc.getCurrentCluster()

    res.json({
      data: {
        name: currentContext || 'minikube',
        server: currentCluster?.server || '-',
        version: version.gitVersion,
        platform: version.platform,
        context: currentContext,
      }
    })
  } catch (err) { next(err) }
})

export default router
