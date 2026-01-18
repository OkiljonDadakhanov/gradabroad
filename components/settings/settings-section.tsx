"use client";

import { Card } from "@/components/ui/card";
import { PasswordChangeForm } from "./password-change-form";
import { useTranslations } from "@/lib/i18n";

export function SettingsSection() {
  const t = useTranslations("settings");

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-purple-900">{t("title")}</h2>
      </div>

      <Card className="p-6">
        <PasswordChangeForm />
      </Card>
    </>
  );
}
