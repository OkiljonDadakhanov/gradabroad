"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchWithAuth, clearAuthCookie } from "@/lib/fetchWithAuth";
import { useTranslations } from "@/lib/i18n";
import { API_BASE } from "@/lib/constants";

interface UniversityData {
  name: string;
  email: string;
  logo_url: string | null;
}

export function UserDropdown() {
  const router = useRouter();
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const [university, setUniversity] = useState<UniversityData | null>(null);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const res = await fetchWithAuth(
          `${API_BASE}/api/auth/universities/me/`
        );
        if (res.ok) {
          const data = await res.json();
          setUniversity({
            name: data.university_name || "University",
            email: data.university_admission_email_address || data.university_admission_representetive_email || "",
            logo_url: data.logo_url || null,
          });
        }
      } catch (err) {
        console.error("Failed to fetch university data:", err);
      }
    };
    fetchUniversity();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("universityId");
    clearAuthCookie();
    window.location.href = "https://www.gradabroad.net/login/university";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors">
          {university?.logo_url ? (
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={university.logo_url}
                alt={university.name}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-medium text-sm">
              {university ? getInitials(university.name) : "U"}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 dark:bg-gray-900 dark:border-gray-800">
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {university?.name || "University"}
          </p>
          {university?.email && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{university.email}</p>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="cursor-pointer"
        >
          <User size={16} className="mr-2" />
          {t("profile")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/settings")}
          className="cursor-pointer"
        >
          <Settings size={16} className="mr-2" />
          {t("settings")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-rose-600 dark:text-rose-400 focus:text-rose-600 dark:focus:text-rose-400 focus:bg-rose-50 dark:focus:bg-rose-500/10"
        >
          <LogOut size={16} className="mr-2" />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
