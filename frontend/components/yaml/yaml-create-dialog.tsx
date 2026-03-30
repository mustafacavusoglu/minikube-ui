"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FilePlus, Loader2, Save } from "lucide-react"
import { createResourceYaml } from "@/lib/api-client"

const TEMPLATES: Record<string, (ns: string) => string> = {
  pods: (ns) => `apiVersion: v1
kind: Pod
metadata:
  name: my-pod
  namespace: ${ns}
  labels:
    app: my-pod
spec:
  containers:
    - name: main
      image: nginx:latest
      ports:
        - containerPort: 80
      resources:
        requests:
          cpu: 100m
          memory: 128Mi
        limits:
          cpu: 500m
          memory: 256Mi
`,
  services: (ns) => `apiVersion: v1
kind: Service
metadata:
  name: my-service
  namespace: ${ns}
  labels:
    app: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: ClusterIP
`,
  ingresses: (ns) => `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  namespace: ${ns}
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: my-app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-service
                port:
                  number: 80
`,
  pvcs: (ns) => `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
  namespace: ${ns}
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: standard
`,
  serviceaccounts: (ns) => `apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-service-account
  namespace: ${ns}
  labels:
    app: my-service-account
`,
  namespaces: () => `apiVersion: v1
kind: Namespace
metadata:
  name: my-namespace
  labels:
    app: my-namespace
`,
}

const RESOURCE_LABELS: Record<string, string> = {
  pods: 'Pod',
  services: 'Service',
  ingresses: 'Ingress',
  pvcs: 'PersistentVolumeClaim',
  serviceaccounts: 'ServiceAccount',
  namespaces: 'Namespace',
}

interface YamlCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  resource: string
  defaultNamespace?: string
  onCreated?: () => void
}

export function YamlCreateDialog({
  open,
  onOpenChange,
  resource,
  defaultNamespace = 'default',
  onCreated,
}: YamlCreateDialogProps) {
  const templateFn = TEMPLATES[resource]
  const [yamlContent, setYamlContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (open) {
      setYamlContent(templateFn ? templateFn(defaultNamespace) : '')
      setError(null)
      setSuccess(false)
      setSaving(false)
    }
  }, [open, resource, defaultNamespace])

  const handleCreate = async () => {
    setSaving(true)
    setError(null)
    try {
      await createResourceYaml(resource, yamlContent)
      setSuccess(true)
      onCreated?.()
      setTimeout(() => onOpenChange(false), 1000)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="max-w-3xl w-full h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 py-3 border-b border-border flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <FilePlus className="h-4 w-4" />
            Create {RESOURCE_LABELS[resource] ?? resource}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 p-4">
          <textarea
            value={yamlContent}
            onChange={(e) => setYamlContent(e.target.value)}
            className="w-full h-full resize-none bg-[#0d1117] text-[#c9d1d9] font-mono text-sm p-3 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            spellCheck={false}
          />
        </div>

        {(error || success) && (
          <div className={`px-4 py-2 text-sm ${error ? 'text-destructive' : 'text-green-400'}`}>
            {error || '✓ Created successfully'}
          </div>
        )}

        <DialogFooter className="px-4 py-3 border-t border-border flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
