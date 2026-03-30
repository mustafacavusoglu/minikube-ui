import { metricsClient } from '../config/k8s'

export async function getNodeMetrics() {
  try {
    const metrics = await metricsClient.getNodeMetrics()
    return { available: true, items: metrics.items }
  } catch {
    return { available: false, items: [] }
  }
}

export async function getPodMetrics(namespace?: string) {
  try {
    const metrics = namespace
      ? await metricsClient.getPodMetrics(namespace)
      : await metricsClient.getPodMetrics()
    return { available: true, items: metrics.items }
  } catch {
    return { available: false, items: [] }
  }
}

// Generate stub history when metrics-server is not available
export function generateStubHistory(hours = 24) {
  return Array.from({ length: hours }, (_, i) => ({
    time: new Date(Date.now() - (hours - 1 - i) * 3600 * 1000).toISOString(),
    value: null,
  }))
}
