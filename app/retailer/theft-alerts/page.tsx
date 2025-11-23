"use client"

import { useState } from "react"
import RetailerLayout from "@/components/layout/retailer-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { AlertCircle } from "lucide-react"
import { toast } from "react-hot-toast"

export default function TheftAlertsPage() {
  const { suspiciousEvents, addSuspiciousEvent } = useStore()
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  const handleResolveEvent = (eventId: string) => {
    toast.success("Event marked as reviewed")
    setSelectedEvent(null)
  }

  const handleAddMockEvent = () => {
    const productId = Math.floor(Math.random() * 50 + 1).toString()
    const types = ["Unusual Pattern", "Frequent Returns", "Multiple Removals"]
    addSuspiciousEvent(productId, types[Math.floor(Math.random() * types.length)])
    toast.success("Mock event added")
  }

  return (
    <RetailerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <AlertCircle className="w-8 h-8 text-red-600" />
              Theft Detection Alerts
            </h1>
            <p className="text-muted-foreground mt-1">Monitor suspicious activities</p>
          </div>
          <Button onClick={handleAddMockEvent} variant="outline">
            Add Mock Event
          </Button>
        </div>

        {suspiciousEvents.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg">No suspicious events detected</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Events List */}
            <div className="lg:col-span-2 space-y-3">
              {suspiciousEvents.map((event) => (
                <Card
                  key={event.id}
                  className={`cursor-pointer transition ${selectedEvent === event.id ? "border-primary" : ""}`}
                  onClick={() => setSelectedEvent(event.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{event.id}</p>
                        <p className="text-sm text-muted-foreground mt-1">{event.type}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{event.score}%</div>
                        <p className="text-xs text-muted-foreground">Risk Score</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detail Panel */}
            {selectedEvent && (
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {suspiciousEvents.find((e) => e.id === selectedEvent) && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Event ID</p>
                        <p className="font-bold">{selectedEvent}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Risk Score</p>
                        <p className="text-2xl font-bold">
                          {suspiciousEvents.find((e) => e.id === selectedEvent)?.score}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="font-bold">{suspiciousEvents.find((e) => e.id === selectedEvent)?.type}</p>
                      </div>
                      <Button size="lg" className="w-full" onClick={() => handleResolveEvent(selectedEvent)}>
                        Mark as Reviewed
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </RetailerLayout>
  )
}
