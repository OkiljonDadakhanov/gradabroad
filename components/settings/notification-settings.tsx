"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function NotificationSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    applicationUpdates: true,
    paymentReminders: true,
    marketingEmails: false,
    systemUpdates: true,
  })

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting],
    })
  }

  const handleSave = () => {
    // In a real app, this would call an API to save the settings
    toast({
      title: "Settings saved",
      description: "Your notification settings have been updated.",
      variant: "success",
    })
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Notification Settings</h3>

      <div className="space-y-6 max-w-md">
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

        <Button onClick={handleSave} className="bg-purple-900 hover:bg-purple-800">
          Save Changes
        </Button>
      </div>
    </div>
  )
}
