"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useResourceEvents } from "@/hooks/use-resource"

interface EventsPanelProps {
  namespace: string
  resourceName: string
}

export function EventsPanel({ namespace, resourceName }: EventsPanelProps) {
  const { data: events = [], isLoading } = useResourceEvents(namespace, resourceName)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <Card className="p-8 bg-card border-border text-center text-muted-foreground text-sm">
        No events found for this resource
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {events.map((event: any, i: number) => {
        const isWarning = event.type === 'Warning'
        return (
          <Card key={i} className={cn(
            "p-4 border",
            isWarning ? "bg-destructive/5 border-destructive/20" : "bg-card border-border"
          )}>
            <div className="flex items-start gap-3">
              {isWarning
                ? <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                : <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              }
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={cn(
                    "text-xs font-medium px-1.5 py-0.5 rounded",
                    isWarning ? "bg-destructive/20 text-destructive" : "bg-success/20 text-success"
                  )}>{event.type}</span>
                  <span className="text-sm font-semibold text-foreground">{event.reason}</span>
                  {event.count > 1 && (
                    <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">×{event.count}</span>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">{event.lastSeen}</span>
                </div>
                <p className="text-sm text-foreground/80">{event.message}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
