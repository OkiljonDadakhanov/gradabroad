"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { PasswordChangeForm } from "./password-change-form"
import { NotificationSettings } from "./notification-settings"
import { LanguageSettings } from "./language-settings"

export function SettingsSection() {
  const [activeTab, setActiveTab] = useState("password")

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-purple-900">Settings</h2>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="password" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-purple-100 mb-6">
            <TabsTrigger value="password" className="data-[state=active]:bg-purple-700 data-[state=active]:text-white">
              Password
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger value="language" className="data-[state=active]:bg-purple-700 data-[state=active]:text-white">
              Language
            </TabsTrigger>
          </TabsList>

          <TabsContent value="password">
            <PasswordChangeForm />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="language">
            <LanguageSettings />
          </TabsContent>
        </Tabs>
      </Card>
    </>
  )
}
