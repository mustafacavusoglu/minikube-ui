"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getResourceYaml, applyResourceYaml } from "@/lib/api-client"
import { Loader2, Save } from "lucide-react"

interface YamlInlinePanelProps {
  namespace: string
  resource: string
  name: string
  onSaved?: () => void
}

export function YamlInlinePanel({ namespace, resource, name, onSaved }: YamlInlinePanelProps) {
  const [yamlContent, setYamlContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    getResourceYaml(namespace, resource, name)
      .then(setYamlContent)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [namespace, resource, name])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      await applyResourceYaml(namespace, resource, name, yamlContent)
      setSuccess(true)
      onSaved?.()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 h-[70vh]">
      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <textarea
          value={yamlContent}
          onChange={(e) => setYamlContent(e.target.value)}
          className="flex-1 resize-none bg-[#0d1117] text-[#c9d1d9] font-mono text-sm p-3 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary"
          spellCheck={false}
        />
      )}
      {(error || success) && (
        <div className={`text-sm ${error ? 'text-destructive' : 'text-success'}`}>
          {error || '✓ Saved successfully'}
        </div>
      )}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving || loading} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save
        </Button>
      </div>
    </div>
  )
}
