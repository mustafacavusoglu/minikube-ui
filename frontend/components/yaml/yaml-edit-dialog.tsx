"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getResourceYaml, applyResourceYaml } from "@/lib/api-client"
import { FileCode, Loader2, Save } from "lucide-react"

interface YamlEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  namespace: string
  resource: string
  name: string
  onSaved?: () => void
}

export function YamlEditDialog({ open, onOpenChange, namespace, resource, name, onSaved }: YamlEditDialogProps) {
  const [yamlContent, setYamlContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setError(null)
    setSuccess(false)
    getResourceYaml(namespace, resource, name)
      .then(setYamlContent)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [open, namespace, resource, name])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      await applyResourceYaml(namespace, resource, name, yamlContent)
      setSuccess(true)
      onSaved?.()
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
            <FileCode className="h-4 w-4" />
            Edit YAML — {namespace}/{name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <textarea
              value={yamlContent}
              onChange={(e) => setYamlContent(e.target.value)}
              className="w-full h-full resize-none bg-[#0d1117] text-[#c9d1d9] font-mono text-sm p-3 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              spellCheck={false}
            />
          )}
        </div>

        {(error || success) && (
          <div className={`px-4 py-2 text-sm ${error ? 'text-destructive' : 'text-success'}`}>
            {error || '✓ Saved successfully'}
          </div>
        )}

        <DialogFooter className="px-4 py-3 border-t border-border flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || loading} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
