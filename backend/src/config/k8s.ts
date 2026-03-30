import * as k8s from '@kubernetes/client-node'

const kc = new k8s.KubeConfig()
kc.loadFromDefault()

if (process.env.K8S_CONTEXT) {
  try {
    kc.setCurrentContext(process.env.K8S_CONTEXT)
  } catch {
    console.warn(`[k8s] Context "${process.env.K8S_CONTEXT}" not found, using default`)
  }
}

const currentContext = kc.getCurrentContext()
const currentCluster = kc.getCurrentCluster()
console.log(`[k8s] Using context: ${currentContext}`)
console.log(`[k8s] Cluster server: ${currentCluster?.server}`)

export const coreV1Api         = kc.makeApiClient(k8s.CoreV1Api)
export const appsV1Api         = kc.makeApiClient(k8s.AppsV1Api)
export const batchV1Api        = kc.makeApiClient(k8s.BatchV1Api)
export const networkingV1Api   = kc.makeApiClient(k8s.NetworkingV1Api)
export const storageV1Api      = kc.makeApiClient(k8s.StorageV1Api)
export const rbacV1Api         = kc.makeApiClient(k8s.RbacAuthorizationV1Api)
export const apiextensionsV1Api = kc.makeApiClient(k8s.ApiextensionsV1Api)
export const customObjectsApi  = kc.makeApiClient(k8s.CustomObjectsApi)
export const versionApi        = kc.makeApiClient(k8s.VersionApi)
export const metricsClient     = new k8s.Metrics(kc)
export const execClient        = new k8s.Exec(kc)
export const logClient         = new k8s.Log(kc)

export { kc }
