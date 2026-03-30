// Client-side utilities (non-tailwind, non-shadcn)

export function computeAge(creationTimestamp: string | Date | undefined): string {
  if (!creationTimestamp) return '-'
  const ts = typeof creationTimestamp === 'string' ? new Date(creationTimestamp) : creationTimestamp
  const seconds = Math.floor((Date.now() - ts.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  return `${Math.floor(seconds / 86400)}d`
}
