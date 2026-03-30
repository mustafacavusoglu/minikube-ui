"use client"

import useSWR from 'swr'
import * as api from '@/lib/api-client'

const REFRESH = 10000 // 10s auto-refresh

export const useNamespaces     = () => useSWR('namespaces', api.getNamespaces, { refreshInterval: REFRESH })
export const usePods           = (ns?: string) => useSWR(['pods', ns], () => api.getPods(ns), { refreshInterval: REFRESH })
export const useDeployments    = (ns?: string) => useSWR(['deployments', ns], () => api.getDeployments(ns), { refreshInterval: REFRESH })
export const useReplicaSets    = (ns?: string) => useSWR(['replicasets', ns], () => api.getReplicaSets(ns), { refreshInterval: REFRESH })
export const useStatefulSets   = (ns?: string) => useSWR(['statefulsets', ns], () => api.getStatefulSets(ns), { refreshInterval: REFRESH })
export const useDaemonSets     = (ns?: string) => useSWR(['daemonsets', ns], () => api.getDaemonSets(ns), { refreshInterval: REFRESH })
export const useJobs           = (ns?: string) => useSWR(['jobs', ns], () => api.getJobs(ns), { refreshInterval: REFRESH })
export const useCronJobs       = (ns?: string) => useSWR(['cronjobs', ns], () => api.getCronJobs(ns), { refreshInterval: REFRESH })
export const useServices       = (ns?: string) => useSWR(['services', ns], () => api.getServices(ns), { refreshInterval: REFRESH })
export const useIngresses      = (ns?: string) => useSWR(['ingresses', ns], () => api.getIngresses(ns), { refreshInterval: REFRESH })
export const usePVCs           = (ns?: string) => useSWR(['pvcs', ns], () => api.getPVCs(ns), { refreshInterval: REFRESH })
export const useStorageClasses = () => useSWR('storageclasses', api.getStorageClasses, { refreshInterval: REFRESH })
export const useConfigMaps     = (ns?: string) => useSWR(['configmaps', ns], () => api.getConfigMaps(ns), { refreshInterval: REFRESH })
export const useSecrets        = (ns?: string) => useSWR(['secrets', ns], () => api.getSecrets(ns), { refreshInterval: REFRESH })
export const useNodes          = () => useSWR('nodes', api.getNodes, { refreshInterval: REFRESH })
export const useServiceAccounts = (ns?: string) => useSWR(['serviceaccounts', ns], () => api.getServiceAccounts(ns), { refreshInterval: REFRESH })
export const useEvents         = (ns?: string) => useSWR(['events', ns], () => api.getEvents(ns), { refreshInterval: REFRESH })
export const useCRDs           = () => useSWR('crds', api.getCRDs, { refreshInterval: REFRESH })
export const useClusterStats   = () => useSWR('cluster/stats', api.getClusterStats, { refreshInterval: REFRESH })
export const useCpuHistory     = () => useSWR('cluster/cpu-history', api.getCpuHistory, { refreshInterval: 60000 })
export const useMemoryHistory  = () => useSWR('cluster/memory-history', api.getMemoryHistory, { refreshInterval: 60000 })
export const useAbout          = () => useSWR('about', api.getAboutInfo, { refreshInterval: 60000 })

// ---- Single-resource hooks ----
export const usePod            = (ns: string, name: string) => useSWR(['pod', ns, name], () => api.getPod(ns, name), { refreshInterval: REFRESH })
export const useDeployment     = (ns: string, name: string) => useSWR(['deployment', ns, name], () => api.getDeployment(ns, name), { refreshInterval: REFRESH })
export const useReplicaSet     = (ns: string, name: string) => useSWR(['replicaset', ns, name], () => api.getReplicaSet(ns, name), { refreshInterval: REFRESH })
export const useStatefulSet    = (ns: string, name: string) => useSWR(['statefulset', ns, name], () => api.getStatefulSet(ns, name), { refreshInterval: REFRESH })
export const useDaemonSet      = (ns: string, name: string) => useSWR(['daemonset', ns, name], () => api.getDaemonSet(ns, name), { refreshInterval: REFRESH })
export const useJob            = (ns: string, name: string) => useSWR(['job', ns, name], () => api.getJob(ns, name), { refreshInterval: REFRESH })
export const useCronJob        = (ns: string, name: string) => useSWR(['cronjob', ns, name], () => api.getCronJob(ns, name), { refreshInterval: REFRESH })
export const useService        = (ns: string, name: string) => useSWR(['service', ns, name], () => api.getService(ns, name), { refreshInterval: REFRESH })
export const useIngress        = (ns: string, name: string) => useSWR(['ingress', ns, name], () => api.getIngress(ns, name), { refreshInterval: REFRESH })
export const usePVC            = (ns: string, name: string) => useSWR(['pvc', ns, name], () => api.getPVC(ns, name), { refreshInterval: REFRESH })
export const useStorageClass   = (name: string) => useSWR(['storageclass', name], () => api.getStorageClass(name), { refreshInterval: REFRESH })
export const useConfigMap      = (ns: string, name: string) => useSWR(['configmap', ns, name], () => api.getConfigMap(ns, name), { refreshInterval: REFRESH })
export const useSecret         = (ns: string, name: string) => useSWR(['secret', ns, name], () => api.getSecret(ns, name), { refreshInterval: REFRESH })
export const useNode           = (name: string) => useSWR(['node', name], () => api.getNode(name), { refreshInterval: REFRESH })
export const useServiceAccount = (ns: string, name: string) => useSWR(['serviceaccount', ns, name], () => api.getServiceAccount(ns, name), { refreshInterval: REFRESH })
export const useResourceEvents = (ns: string, resourceName: string) => useSWR(['resource-events', ns, resourceName], () => api.getResourceEvents(ns, resourceName), { refreshInterval: REFRESH })
