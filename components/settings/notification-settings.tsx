"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { fetchWithAuth } from "@/lib/fetchWithAuth"

type NotificationPrefs = {
  email: boolean
  app_updates: boolean
  payments: boolean
  marketing: boolean
  system: boolean
}

type ToggleKey =
  | "emailNotifications"
  | "applicationUpdates"
  | "paymentReminders"
  | "marketingEmails"
  | "systemUpdates"

const TOGGLE_TO_FIELD: Record<ToggleKey, keyof NotificationPrefs> = {
  emailNotifications: "email",
  applicationUpdates: "app_updates",
  paymentReminders: "payments",
  marketingEmails: "marketing",
  systemUpdates: "system",
}

export function NotificationSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<Record<ToggleKey, boolean>>({
    emailNotifications: false,
    applicationUpdates: false,
    paymentReminders: false,
    marketingEmails: false,
    systemUpdates: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const loadPrefs = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const res = await fetchWithAuth("/api/settings/notifications/")
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`)
      }
      const data: NotificationPrefs = await res.json()
      setSettings({
        emailNotifications: !!data.email,
        applicationUpdates: !!data.app_updates,
        paymentReminders: !!data.payments,
        marketingEmails: !!data.marketing,
        systemUpdates: !!data.system,
      })
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Failed to load notification settings"
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPrefs()
  }, [loadPrefs])

  const handleToggle = async (setting: ToggleKey) => {
    const prev = settings[setting]
    const next = !prev
    const field = TOGGLE_TO_FIELD[setting]

    setSettings((s) => ({ ...s, [setting]: next }))

    try {
      const res = await fetchWithAuth("/api/settings/notifications/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: next }),
      })
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`)
      }
    } catch (err) {
      setSettings((s) => ({ ...s, [setting]: prev }))
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to update notification setting.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Notification Settings</h3>

      <div className="space-y-6 max-w-md">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-6 w-11 rounded-full" />
              </div>
            ))}
          </div>
        ) : loadError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700 mb-3">
              Could not load notification settings. {loadError}
            </p>
            <Button
              onClick={loadPrefs}
              variant="outline"
              size="sm"
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications" className="text-base font-medium">
                  Email Notifications
                </Label>
                <p className="text-sm text-gray-500">Receive email notifications</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle("emailNotifications")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="applicationUpdates" className="text-base font-medium">
                  Application Updates
                </Label>
                <p className="text-sm text-gray-500">Get notified about application status changes</p>
              </div>
              <Switch
                id="applicationUpdates"
                checked={settings.applicationUpdates}
                onCheckedChange={() => handleToggle("applicationUpdates")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="paymentReminders" className="text-base font-medium">
                  Payment Reminders
                </Label>
                <p className="text-sm text-gray-500">Receive reminders about upcoming payments</p>
              </div>
              <Switch
                id="paymentReminders"
                checked={settings.paymentReminders}
                onCheckedChange={() => handleToggle("paymentReminders")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketingEmails" className="text-base font-medium">
                  Marketing Emails
                </Label>
                <p className="text-sm text-gray-500">Receive promotional emails and newsletters</p>
              </div>
              <Switch
                id="marketingEmails"
                checked={settings.marketingEmails}
                onCheckedChange={() => handleToggle("marketingEmails")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="systemUpdates" className="text-base font-medium">
                  System Updates
                </Label>
                <p className="text-sm text-gray-500">Get notified about system updates and maintenance</p>
              </div>
              <Switch
                id="systemUpdates"
                checked={settings.systemUpdates}
                onCheckedChange={() => handleToggle("systemUpdates")}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
