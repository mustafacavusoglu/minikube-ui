// API client — replaces mock-data.ts with real backend calls

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `API error ${res.status}`)
  }
  return res.json()
}

async function apiDelete(path: string): Promise<{ message: string }> {
  const res = await fetch(`${BASE}${path}`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `API error ${res.status}`)
  }
  return res.json()
}

async function apiPatch(path: string, body: any): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `API error ${res.status}`)
  }
  return res.json()
}

async function apiPost(path: string, body: any): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `API error ${res.status}`)
  }
  return res.json()
}

async function apiPut(path: string, body: any): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `API error ${res.status}`)
  }
  return res.json()
}

// ---- Namespace helpers ----
function nsPath(namespace?: string) {
  if (!namespace || namespace === 'All Namespaces') return ''
  return `/namespaces/${namespace}`
}

// ---- Namespaces ----
export const getNamespaces = () =>
  apiFetch<{ data: any[] }>('/api/v1/namespaces').then(r => r.data)

export const getNamespace = (name: string) =>
  apiFetch<{ data: any }>(`/api/v1/namespaces/${name}`).then(r => r.data)

// ---- Pods ----
export const getPods = (namespace?: string) =>
  apiFetch<{ data: any[] }>(`/api/v1${nsPath(namespace)}/pods`).then(r => r.data)

export const getPod = (namespace: string, name: string) =>
  apiFetch<{ data: any }>(`/api/v1/namespaces/${namespace}/pods/${name}`).then(r => r.data)

export const deletePod = (namespace: string, name: string) =>
  apiDelete(`/api/v1/namespaces/${namespace}/pods/${name}`)

export const getPodLogs = (namespace: string, name: string, container?: string, tailLines = 100) =>
  fetch(`${BASE}/api/v1/namespaces/${namespace}/pods/${name}/logs?container=${container || ''}&tailLines=${tailLines}`)
    .then(r => r.text())

// ---- Deployments ----
export const getDeployments = (namespace?: string) =>
  apiFetch<{ data: any[] }>(`/api/v1${nsPath(namespace)}/deployments`).then(r => r.data)

export const getDeployment = (namespace: string, name: string) =>
  apiFetch<{ data: any }>(`/api/v1/namespaces/${namespace}/deployments/${name}`).then(r => r.data)

export const deleteDeployment = (namespace: string, name: string) =>
  apiDelete(`/api/v1/namespaces/${namespace}/deployments/${name}`)

export const scaleDeployment = (namespace: string, name: string, replicas: number) =>
  apiPatch(`/api/v1/namespaces/${namespace}/deployments/${name}/scale`, { replicas })

// ---- ReplicaSets ----
export const getReplicaSets = (namespace?: string) =>
  apiFetch<{ data: any[] }>(`/api/v1${nsPath(namespace)}/replicasets`).then(r => r.data)

export const getReplicaSet = (namespace: string, name: string) =>
  apiFetch<{ data: any }>(`/api/v1/namespaces/${namespace}/replicasets/${name}`).then(r => r.data)

export const deleteReplicaSet = (namespace: string, name: string) =>
  apiDelete(`/api/v1/namespaces/${namespace}/replicasets/${name}`)

// ---- StatefulSets ----
export const getStatefulSets = (namespace?: string) =>
  apiFetch<{ data: any[] }>(`/api/v1${nsPath(namespace)}/statefulsets`).then(r => r.data)

export const getStatefulSet = (namespace: string, name: string) =>
  apiFetch<{ data: any }>(`/api/v1/namespaces/${namespace}/statefulsets/${name}`).then(r => r.data)

export const deleteStatefulSet = (namespace: string, name: string) =>
  apiDelete(`/api/v1/namespaces/${namespace}/statefulsets/${name}`)

// ---- DaemonSets ----
export const getDaemonSets = (namespace?: string) =>
  apiFetch<{ data: any[] }>(`/api/v1${nsPath(namespace)}/daemonsets`).then(r => r.data)

export const getDaemonSet = (namespace: string, name: string) =>
  apiFetch<{ data: any }>(`/api/v1/namespaces/${namespace}/daemonsets/${name}`).then(r => r.data)

export const deleteDaemonSet = (namespace: string, name: string) =>
  apiDelete(`/api/v1/namespaces/${namespace}/daemonsets/${name}`)

// ---- Jobs ----
export const getJobs = (namespace?: string) =>
  apiFetch<{ data: any[] }>(`/api/v1${nsPath(namespace)}/jobs`).then(r => r.data)

export const getJob = (namespace: string, name: string) =>
  apiFetch<{ data: any }>(`/api/v1/namespaces/${namespace}/jobs/${name}`).then(r => r.data)

export const deleteJob = (namespace: string, name: string) =>
  apiDelete(`/api/v1/namespaces/${namespace}/jobs/${name}`)

// ---- CronJobs ----
export const getCronJobs = (namespace?: string) =>
  apiFetch<{ data: any[] }>(`/api/v1${nsPath(namespace)}/cronjobs`).then(r => r.data)

export const getCronJob = (namespace: string, name: string) =>
  apiFetch<{ data: any }>(`/api/v1/namespaces/${namespace}/cronjobs/${name}`).then(r => r.data)

export const deleteCronJob = (namespace: string, name: string) =>
  apiDelete(`/api/v1/namespaces/${namespace}/cronjobs/${name}`)

export const suspendCronJob = (namespace: string, name: string, suspend: boolean) =>
  apiPatch(`/api/v1/namespaces/${namespace}/cronjobs/${name}/suspend`, { suspend })

// ---- Services ----
export const getServices = (namespace?: string) =>
  apiFetch<{ data: any[] }>(`/api/v1${nsPath(namespace)}/services`).then(r => r.data)

export const getService = (namespace: string, name: string) =>
  apiFetch<{ data: any }>(`/api/v1/namespaces/${namespace}/services/${name}`).then(r => r.data)

export const deleteService = (namespace: string, name: string) =>
  apiDelete(`/api/v1/namespaces/${namespace}/services/${name}`)

// ---- Ingresses ----
export const getIngresses = (namespace?: string) =>
  apiFetch<{ data: any[] }>(`/api/v1${nsPath(namespace)}/ingresses`).then(r => r.data)

export const getIngress = (namespace: string, name: string) =>
  apiFetch<{ data: any }>(`/api/v1/namespaces/${namespace}/ingresses/${name}`).then(r => r.data)

export const deleteIngress = (namespace: string, name: string) =>
  apiDelete(`/api/v1/namespaces/${namespace}/ingresses/${name}`)

// ---- PVCs ----
export const getPVCs = (namespace?: string) =>
  apiFetch<{ data: any[] }>(`/api/v1${nsPath(namespace)}/pvcs`).then(r => r.data)

export const getPVC = (namespace: string, name: string) =>
  apiFetch<{ data: any }>(`/api/v1/namespaces/${namespace}/pvcs/${name}`).then(r => r.data)

export const deletePVC = (namespace: string, name: string) =>
  apiDelete(`/api/v1/namespaces/${namespace}/pvcs/${name}`)

// ---- StorageClasses ----
export const getStorageClasses = () =>
  apiFetch<{ data: any[] }>('/api/v1/storageclasses').then(r => r.data)

export const getStorageClass = (name: string) =>
  apiFetch<{ data: any }>(`/api/v1/storageclasses/${name}`).then(r => r.data)

export const deleteStorageClass = (name: string) =>
  apiDelete(`/api/v1/storageclasses/${name}`)

// ---- ConfigMaps ----
export const getConfigMaps = (namespace?: string) =>
  apiFetch<{ data: any[] }>(`/api/v1${nsPath(namespace)}/configmaps`).then(r => r.data)

export const getConfigMap = (namespace: string, name: string) =>
  apiFetch<{ data: any }>(`/api/v1/namespaces/${namespace}/configmaps/${name}`).then(r => r.data)

export const deleteConfigMap = (namespace: string, name: string) =>
  apiDelete(`/api/v1/namespaces/${namespace}/configmaps/${name}`)

// ---- Secrets ----
export const getSecrets = (namespace?: string) =>
  apiFetch<{ data: any[] }>(`/api/v1${nsPath(namespace)}/secrets`).then(r => r.data)

export const getSecret = (namespace: string, name: string) =>
  apiFetch<{ data: any }>(`/api/v1/namespaces/${namespace}/secrets/${name}`).then(r => r.data)

export const deleteSecret = (namespace: string, name: string) =>
  apiDelete(`/api/v1/namespaces/${namespace}/secrets/${name}`)

// ---- Nodes ----
export const getNodes = () =>
  apiFetch<{ data: any[] }>('/api/v1/nodes').then(r => r.data)

export const getNode = (name: string) =>
  apiFetch<{ data: any }>(`/api/v1/nodes/${name}`).then(r => r.data)

// ---- ServiceAccounts ----
export const getServiceAccounts = (namespace?: string) =>
  apiFetch<{ data: any[] }>(`/api/v1${nsPath(namespace)}/serviceaccounts`).then(r => r.data)

export const getServiceAccount = (namespace: string, name: string) =>
  apiFetch<{ data: any }>(`/api/v1/namespaces/${namespace}/serviceaccounts/${name}`).then(r => r.data)

export const deleteServiceAccount = (namespace: string, name: string) =>
  apiDelete(`/api/v1/namespaces/${namespace}/serviceaccounts/${name}`)

// ---- Events ----
export const getEvents = (namespace?: string) =>
  apiFetch<{ data: any[] }>(`/api/v1${nsPath(namespace)}/events`).then(r => r.data)

export const getResourceEvents = (namespace: string, resourceName: string) =>
  apiFetch<{ data: any[] }>(
    `/api/v1/namespaces/${namespace}/events?fieldSelector=involvedObject.name=${resourceName}`
  ).then(r => r.data)

// ---- CRDs ----
export const getCRDs = () =>
  apiFetch<{ data: any[] }>('/api/v1/crds').then(r => r.data)

export const deleteCRD = (name: string) =>
  apiDelete(`/api/v1/crds/${name}`)

// ---- Custom Resources ----
export const getCustomResources = (namespace: string, group: string, version: string, plural: string) =>
  apiFetch<{ data: any[]; available: boolean }>(
    `/api/v1/namespaces/${namespace}/custom-resources/${group}/${version}/${plural}`
  )

// ---- Cluster Stats ----
export const getClusterStats = () =>
  apiFetch<{ data: any }>('/api/v1/cluster/stats').then(r => r.data)

export const getClusterInfo = () =>
  apiFetch<{ data: any }>('/api/v1/cluster/info').then(r => r.data)

export const getCpuHistory = () =>
  apiFetch<{ available: boolean; data: any[] }>('/api/v1/cluster/metrics/cpu-history')

export const getMemoryHistory = () =>
  apiFetch<{ available: boolean; data: any[] }>('/api/v1/cluster/metrics/memory-history')

// ---- About ----
export const getAboutInfo = () =>
  apiFetch<{ data: any }>('/api/v1/about').then(r => r.data)

// ---- YAML ----
export const getResourceYaml = (namespace: string, resource: string, name: string): Promise<string> =>
  fetch(`${BASE}/api/v1/namespaces/${namespace}/${resource}/${name}/yaml`)
    .then(r => r.text())

export const applyResourceYaml = (namespace: string, resource: string, name: string, yamlContent: string) =>
  apiPut(`/api/v1/namespaces/${namespace}/${resource}/${name}/yaml`, { yamlContent })

export const createResourceYaml = (resource: string, yamlContent: string) =>
  apiPost('/api/v1/create', { resource, yamlContent })

// ---- WebSocket URLs ----
const WS_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/^http/, 'ws')

export const getTerminalWsUrl = (namespace: string, pod: string, container?: string) =>
  `${WS_BASE}/ws/terminal?namespace=${namespace}&pod=${pod}${container ? '&container=' + container : ''}`

export const getLogsWsUrl = (namespace: string, pod: string, container?: string, tailLines = 100) =>
  `${WS_BASE}/ws/logs?namespace=${namespace}&pod=${pod}${container ? '&container=' + container : ''}&tailLines=${tailLines}`
