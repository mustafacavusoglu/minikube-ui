import * as k8s from '@kubernetes/client-node'

// ---- Age utility ----
export function computeAge(creationTimestamp: Date | string | undefined): string {
  if (!creationTimestamp) return '-'
  const ts = typeof creationTimestamp === 'string' ? new Date(creationTimestamp) : creationTimestamp
  const seconds = Math.floor((Date.now() - ts.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  return `${Math.floor(seconds / 86400)}d`
}

// ---- Owner references ----
function ownerRefs(meta: k8s.V1ObjectMeta | undefined) {
  return (meta?.ownerReferences || []).map(ref => ({
    kind: ref.kind,
    name: ref.name,
    uid: ref.uid,
    controller: ref.controller,
  }))
}

// ---- Pod status detection ----
function podStatus(pod: k8s.V1Pod): string {
  const phase = pod.status?.phase || 'Unknown'
  if (pod.metadata?.deletionTimestamp) return 'Terminating'

  // Check container statuses for specific error states
  const containerStatuses = pod.status?.containerStatuses || []
  for (const cs of containerStatuses) {
    const waiting = cs.state?.waiting
    if (waiting?.reason === 'CrashLoopBackOff') return 'CrashLoopBackOff'
    if (waiting?.reason === 'ImagePullBackOff' || waiting?.reason === 'ErrImagePull') return 'ImagePullBackOff'
  }
  return phase
}

function podReady(pod: k8s.V1Pod): string {
  const containerStatuses = pod.status?.containerStatuses || []
  const total = pod.spec?.containers?.length || 0
  const ready = containerStatuses.filter(cs => cs.ready).length
  return `${ready}/${total}`
}

// ---- Transformers ----

export function transformNamespace(ns: k8s.V1Namespace) {
  return {
    name: ns.metadata?.name || '',
    status: (ns.status?.phase as 'Active' | 'Terminating') || 'Active',
    labels: ns.metadata?.labels || {},
    createdAt: computeAge(ns.metadata?.creationTimestamp),
    podCount: 0, // filled separately if needed
    ownerReferences: ownerRefs(ns.metadata),
  }
}

export function transformPod(pod: k8s.V1Pod) {
  const containerStatuses = pod.status?.containerStatuses || []
  const containers = (pod.spec?.containers || []).map(c => {
    const cs = containerStatuses.find(s => s.name === c.name)
    const waiting = cs?.state?.waiting
    const running = cs?.state?.running
    const terminated = cs?.state?.terminated
    let state: 'running' | 'waiting' | 'terminated' = 'waiting'
    if (running) state = 'running'
    else if (terminated) state = 'terminated'
    return {
      name: c.name,
      image: c.image || '',
      ready: cs?.ready || false,
      restartCount: cs?.restartCount || 0,
      state,
    }
  })

  const totalRestarts = containerStatuses.reduce((sum, cs) => sum + (cs.restartCount || 0), 0)

  return {
    name: pod.metadata?.name || '',
    namespace: pod.metadata?.namespace || '',
    status: podStatus(pod),
    ready: podReady(pod),
    restarts: totalRestarts,
    age: computeAge(pod.metadata?.creationTimestamp),
    cpu: '-',    // requires metrics-server
    memory: '-', // requires metrics-server
    node: pod.spec?.nodeName || '-',
    ip: pod.status?.podIP || '-',
    containers,
    labels: pod.metadata?.labels || {},
    ownerReferences: ownerRefs(pod.metadata),
  }
}

export function transformDeployment(dep: k8s.V1Deployment) {
  const desired = dep.spec?.replicas || 0
  const ready = dep.status?.readyReplicas || 0
  const available = dep.status?.availableReplicas || 0

  return {
    name: dep.metadata?.name || '',
    namespace: dep.metadata?.namespace || '',
    replicas: `${ready}/${desired}`,
    availableReplicas: available,
    readyReplicas: ready,
    desiredReplicas: desired,
    image: dep.spec?.template?.spec?.containers?.[0]?.image || '-',
    age: computeAge(dep.metadata?.creationTimestamp),
    strategy: (dep.spec?.strategy?.type as 'RollingUpdate' | 'Recreate') || 'RollingUpdate',
    labels: dep.metadata?.labels || {},
    ownerReferences: ownerRefs(dep.metadata),
  }
}

export function transformService(svc: k8s.V1Service) {
  const ports = (svc.spec?.ports || [])
    .map(p => `${p.port}${p.nodePort ? ':' + p.nodePort : ''}/${p.protocol || 'TCP'}`)
    .join(', ')

  const externalIPs = svc.status?.loadBalancer?.ingress?.map(i => i.ip || i.hostname).filter(Boolean) || []
  const externalIPsFromSpec = svc.spec?.externalIPs || []

  return {
    name: svc.metadata?.name || '',
    namespace: svc.metadata?.namespace || '',
    type: (svc.spec?.type as 'ClusterIP' | 'NodePort' | 'LoadBalancer' | 'ExternalName') || 'ClusterIP',
    clusterIP: svc.spec?.clusterIP || '-',
    externalIP: [...externalIPs, ...externalIPsFromSpec][0] || undefined,
    ports: ports || '-',
    selector: svc.spec?.selector || {},
    age: computeAge(svc.metadata?.creationTimestamp),
    ownerReferences: ownerRefs(svc.metadata),
  }
}

export function transformNode(node: k8s.V1Node) {
  const conditions = (node.status?.conditions || []).map(c => ({
    type: c.type,
    status: c.status as 'True' | 'False' | 'Unknown',
    message: c.message || '',
  }))

  const ready = conditions.find(c => c.type === 'Ready')
  let status: 'Ready' | 'NotReady' | 'SchedulingDisabled' = 'NotReady'
  if (node.spec?.unschedulable) status = 'SchedulingDisabled'
  else if (ready?.status === 'True') status = 'Ready'

  const roles = Object.keys(node.metadata?.labels || {})
    .filter(l => l.startsWith('node-role.kubernetes.io/'))
    .map(l => l.replace('node-role.kubernetes.io/', ''))

  return {
    name: node.metadata?.name || '',
    status,
    roles: roles.length ? roles : ['worker'],
    version: node.status?.nodeInfo?.kubeletVersion || '-',
    os: node.status?.nodeInfo?.osImage || '-',
    kernel: node.status?.nodeInfo?.kernelVersion || '-',
    containerRuntime: node.status?.nodeInfo?.containerRuntimeVersion || '-',
    cpu: {
      capacity: node.status?.capacity?.['cpu'] || '-',
      allocatable: node.status?.allocatable?.['cpu'] || '-',
      used: '-',
    },
    memory: {
      capacity: node.status?.capacity?.['memory'] || '-',
      allocatable: node.status?.allocatable?.['memory'] || '-',
      used: '-',
    },
    pods: {
      capacity: parseInt(node.status?.capacity?.['pods'] || '0'),
      allocatable: parseInt(node.status?.allocatable?.['pods'] || '0'),
      used: 0,
    },
    age: computeAge(node.metadata?.creationTimestamp),
    conditions,
    ownerReferences: ownerRefs(node.metadata),
  }
}

export function transformStatefulSet(ss: k8s.V1StatefulSet) {
  const desired = ss.spec?.replicas || 0
  const ready = ss.status?.readyReplicas || 0
  return {
    name: ss.metadata?.name || '',
    namespace: ss.metadata?.namespace || '',
    ready: `${ready}/${desired}`,
    age: computeAge(ss.metadata?.creationTimestamp),
    image: ss.spec?.template?.spec?.containers?.[0]?.image || '-',
    ownerReferences: ownerRefs(ss.metadata),
  }
}

export function transformDaemonSet(ds: k8s.V1DaemonSet) {
  return {
    name: ds.metadata?.name || '',
    namespace: ds.metadata?.namespace || '',
    desired: ds.status?.desiredNumberScheduled || 0,
    current: ds.status?.currentNumberScheduled || 0,
    ready: ds.status?.numberReady || 0,
    available: ds.status?.numberAvailable || 0,
    age: computeAge(ds.metadata?.creationTimestamp),
    ownerReferences: ownerRefs(ds.metadata),
  }
}

export function transformJob(job: k8s.V1Job) {
  const completions = job.spec?.completions || 1
  const succeeded = job.status?.succeeded || 0
  let status: 'Complete' | 'Running' | 'Failed' = 'Running'
  if (job.status?.completionTime) status = 'Complete'
  else if (job.status?.failed && job.status.failed > 0) status = 'Failed'

  let duration = '-'
  if (job.status?.startTime) {
    const end = job.status.completionTime ? new Date(job.status.completionTime) : new Date()
    const ms = end.getTime() - new Date(job.status.startTime).getTime()
    duration = `${Math.floor(ms / 1000)}s`
  }

  return {
    name: job.metadata?.name || '',
    namespace: job.metadata?.namespace || '',
    completions: `${succeeded}/${completions}`,
    duration,
    age: computeAge(job.metadata?.creationTimestamp),
    status,
    ownerReferences: ownerRefs(job.metadata),
  }
}

export function transformReplicaSet(rs: k8s.V1ReplicaSet) {
  const desired = rs.spec?.replicas || 0
  const ready = rs.status?.readyReplicas || 0
  const available = rs.status?.availableReplicas || 0

  return {
    name: rs.metadata?.name || '',
    namespace: rs.metadata?.namespace || '',
    desired,
    ready,
    available,
    replicas: `${ready}/${desired}`,
    image: rs.spec?.template?.spec?.containers?.[0]?.image || '-',
    age: computeAge(rs.metadata?.creationTimestamp),
    labels: rs.metadata?.labels || {},
    ownerReferences: ownerRefs(rs.metadata),
  }
}

export function transformCronJob(cj: k8s.V1CronJob) {
  const lastScheduleTime = cj.status?.lastScheduleTime
    ? computeAge(cj.status.lastScheduleTime)
    : 'Never'

  return {
    name: cj.metadata?.name || '',
    namespace: cj.metadata?.namespace || '',
    schedule: cj.spec?.schedule || '-',
    suspend: cj.spec?.suspend || false,
    active: (cj.status?.active || []).length,
    lastSchedule: lastScheduleTime,
    age: computeAge(cj.metadata?.creationTimestamp),
    ownerReferences: ownerRefs(cj.metadata),
  }
}

export function transformIngress(ing: k8s.V1Ingress) {
  const hosts = (ing.spec?.rules || []).map(r => r.host || '*')
  const address = ing.status?.loadBalancer?.ingress?.map(i => i.ip || i.hostname).filter(Boolean).join(', ') || '-'
  const ports = ing.spec?.tls?.length ? '80, 443' : '80'

  return {
    name: ing.metadata?.name || '',
    namespace: ing.metadata?.namespace || '',
    hosts,
    address,
    ports,
    age: computeAge(ing.metadata?.creationTimestamp),
    ownerReferences: ownerRefs(ing.metadata),
  }
}

export function transformPVC(pvc: k8s.V1PersistentVolumeClaim) {
  return {
    name: pvc.metadata?.name || '',
    namespace: pvc.metadata?.namespace || '',
    status: (pvc.status?.phase as 'Bound' | 'Pending' | 'Lost') || 'Pending',
    volume: pvc.spec?.volumeName || '-',
    capacity: pvc.status?.capacity?.['storage'] || pvc.spec?.resources?.requests?.['storage'] || '-',
    accessModes: pvc.status?.accessModes || pvc.spec?.accessModes || [],
    storageClass: pvc.spec?.storageClassName || '-',
    age: computeAge(pvc.metadata?.creationTimestamp),
    ownerReferences: ownerRefs(pvc.metadata),
  }
}

export function transformStorageClass(sc: k8s.V1StorageClass) {
  const isDefault = sc.metadata?.annotations?.['storageclass.kubernetes.io/is-default-class'] === 'true'
  return {
    name: sc.metadata?.name || '',
    provisioner: sc.provisioner || '-',
    reclaimPolicy: (sc.reclaimPolicy as 'Delete' | 'Retain') || 'Delete',
    volumeBindingMode: sc.volumeBindingMode || 'Immediate',
    allowVolumeExpansion: sc.allowVolumeExpansion || false,
    isDefault,
    age: computeAge(sc.metadata?.creationTimestamp),
    ownerReferences: ownerRefs(sc.metadata),
  }
}

export function transformConfigMap(cm: k8s.V1ConfigMap) {
  return {
    name: cm.metadata?.name || '',
    namespace: cm.metadata?.namespace || '',
    data: cm.data || {},
    age: computeAge(cm.metadata?.creationTimestamp),
    ownerReferences: ownerRefs(cm.metadata),
  }
}

export function transformSecret(secret: k8s.V1Secret) {
  return {
    name: secret.metadata?.name || '',
    namespace: secret.metadata?.namespace || '',
    type: secret.type || 'Opaque',
    dataKeys: Object.keys(secret.data || {}),
    age: computeAge(secret.metadata?.creationTimestamp),
    ownerReferences: ownerRefs(secret.metadata),
  }
}

export function transformEvent(event: k8s.CoreV1Event) {
  return {
    type: (event.type as 'Normal' | 'Warning') || 'Normal',
    reason: event.reason || '-',
    message: event.message || '-',
    object: `${event.involvedObject?.kind}/${event.involvedObject?.name}`,
    namespace: event.metadata?.namespace || '',
    count: event.count || 1,
    firstSeen: computeAge(event.firstTimestamp || event.metadata?.creationTimestamp),
    lastSeen: computeAge(event.lastTimestamp || event.metadata?.creationTimestamp),
  }
}

export function transformServiceAccount(sa: k8s.V1ServiceAccount) {
  return {
    name: sa.metadata?.name || '',
    namespace: sa.metadata?.namespace || '',
    secrets: (sa.secrets || []).length,
    age: computeAge(sa.metadata?.creationTimestamp),
    ownerReferences: ownerRefs(sa.metadata),
  }
}

export function transformCRD(crd: k8s.V1CustomResourceDefinition) {
  const firstVersion = crd.spec?.versions?.[0]
  const established = (crd.status?.conditions || []).some(c => c.type === 'Established' && c.status === 'True')
  return {
    name: crd.metadata?.name || '',
    group: crd.spec?.group || '',
    version: firstVersion?.name || '-',
    scope: (crd.spec?.scope as 'Namespaced' | 'Cluster') || 'Namespaced',
    kind: crd.spec?.names?.kind || '',
    shortNames: crd.spec?.names?.shortNames || [],
    established,
    age: computeAge(crd.metadata?.creationTimestamp),
    ownerReferences: ownerRefs(crd.metadata),
  }
}
