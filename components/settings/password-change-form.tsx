"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { fetchWithAuth } from "@/lib/fetchWithAuth"
import { useTranslations } from "@/lib/i18n"

export function PasswordChangeForm() {
  const { toast } = useToast()
  const t = useTranslations("settings")
  const tCommon = useTranslations("common")
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.oldPassword) {
      newErrors.oldPassword = t("oldPassword") + " required"
    }

    if (!formData.newPassword) {
      newErrors.newPassword = t("newPassword") + " required"
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = t("passwordRequirements")
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("confirmPassword") + " required"
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t("passwordMismatch")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const res = await fetchWithAuth("/api/settings/password/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          old_password: formData.oldPassword,
          new_password: formData.newPassword,
          confirm_password: formData.confirmPassword,
        }),
      })

      if (res.ok) {
        toast({
          title: tCommon("success"),
          description: t("passwordUpdated"),
          variant: "success",
        })
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        const data = await res.json()
        if (data.old_password) {
          setErrors({ oldPassword: data.old_password[0] || t("invalidOldPassword") })
        } else if (data.new_password) {
          setErrors({ newPassword: data.new_password[0] })
        } else if (data.confirm_password) {
          setErrors({ confirmPassword: data.confirm_password[0] })
        } else {
          toast({
            title: tCommon("error"),
            description: data.detail || tCommon("error"),
            variant: "destructive",
          })
        }
      }
    } catch (err) {
      toast({
        title: tCommon("error"),
        description: tCommon("error"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{t("changePassword")}</h3>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <Label htmlFor="oldPassword">
            {t("oldPassword")} <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="oldPassword"
              name="oldPassword"
              type={showOldPassword ? "text" : "password"}
              value={formData.oldPassword}
              onChange={handleChange}
              className="mt-1 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.oldPassword && <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>}
        </div>

        <div>
          <Label htmlFor="newPassword">
            {t("newPassword")} <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="newPassword"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleChange}
              className="mt-1 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
        </div>

        <div>
          <Label htmlFor="confirmPassword">
            {t("confirmPassword")} <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        <Button type="submit" className="bg-purple-900 hover:bg-purple-800" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {tCommon("loading")}
            </>
          ) : (
            tCommon("save")
          )}
        </Button>
      </form>
    </div>
  )
}
