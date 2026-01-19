"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Home,
  GraduationCap,
  Award,
  ImageIcon,
  Users,
  BarChart3,
  Settings,
  User,
  Building2,
} from "lucide-react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { API_BASE } from "@/lib/constants";
import { ContactSupportModal } from "./contact-support-modal";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
  path: string;
}

export function SideNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const [universityName, setUniversityName] = useState<string>("");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetchWithAuth(
          `${API_BASE}/api/auth/universities/me/`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.university_name) {
            setUniversityName(data.university_name);
          }
        }
      } catch {}
    };
    fetchProfile();
  }, []);

  const navItems: NavItem[] = [
    { icon: User, labelKey: "profile", path: "/profile" },
    { icon: Home, labelKey: "campusInfo", path: "/campus-info" },
    { icon: GraduationCap, labelKey: "programs", path: "/academic-programs" },
    { icon: Award, labelKey: "scholarships", path: "/scholarships" },
    { icon: ImageIcon, labelKey: "gallery", path: "/gallery" },
    { icon: Users, labelKey: "candidates", path: "/candidates" },
    { icon: BarChart3, labelKey: "statistics", path: "/statistics" },
    { icon: Settings, labelKey: "settings", path: "/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("universityId");
    window.location.href = "https://www.gradabroad.net/login/university";
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-gray-950/50 flex flex-col z-50">
      {/* Profile */}
      <div className="p-6 text-center border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="relative w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-500/15 dark:to-purple-500/10 flex items-center justify-center shadow-inner">
          <Building2 className="h-8 w-8 text-purple-700 dark:text-purple-400" />
        </div>
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm uppercase tracking-wide leading-tight">
          {universityName ? universityName.toUpperCase() : "UNIVERSITY"}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">University Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 bg-white dark:bg-gray-900">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-sm"
                  : "text-gray-700 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-purple-300"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors shrink-0",
                  isActive ? "text-white" : "text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300"
                )}
              />
              <span className="truncate">{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Help Center */}
      <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-2 bg-white dark:bg-gray-900">
        <div className="rounded-md bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-800 dark:text-purple-300 text-xs p-3 shadow-sm">
          <p className="font-medium mb-1 flex items-center justify-between">
            Help Center
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-normal">24/7</span>
          </p>
          <p className="text-[11px] text-gray-600 dark:text-gray-400 mb-2 leading-tight">
            Need assistance with your dashboard?
          </p>
          <Button
            size="sm"
            className="w-full h-7 text-[11px] bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => setIsContactModalOpen(true)}
          >
            Contact Support
          </Button>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 mt-auto bg-white dark:bg-gray-900">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("logout")}
        </Button>
      </div>

      {/* Contact Support Modal */}
      <ContactSupportModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </aside>
  );
}
