import { Router } from 'express'
import { coreV1Api, versionApi, kc } from '../config/k8s'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const [{ body: version }, { body: nodes }] = await Promise.all([
      versionApi.getCode(),
      coreV1Api.listNode(),
    ])

    const currentContext = kc.getCurrentContext()
    const currentCluster = kc.getCurrentCluster()
    const firstNode = (nodes.items || [])[0]

    res.json({
      data: {
        kubernetes: {
          version: version.gitVersion,
          platform: version.platform,
          buildDate: version.buildDate,
          goVersion: version.goVersion,
        },
        cluster: {
          name: currentContext || 'minikube',
          server: currentCluster?.server || '-',
        },
        node: firstNode ? {
          name: firstNode.metadata?.name,
          runtime: firstNode.status?.nodeInfo?.containerRuntimeVersion,
          os: firstNode.status?.nodeInfo?.osImage,
          kernel: firstNode.status?.nodeInfo?.kernelVersion,
          arch: firstNode.status?.nodeInfo?.architecture,
        } : null,
        context: currentContext,
        nodeCount: (nodes.items || []).length,
      }
    })
  } catch (err) { next(err) }
})

export default router
