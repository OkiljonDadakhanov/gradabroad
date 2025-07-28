"use client";

import type React from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LogOut,
  Home,
  GraduationCap,
  Award,
  Image,
  Users,
  BarChart,
  Settings,
  User,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path?: string;
  onClick?: () => void;
}

export function SideNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path?: string, onClick?: () => void) => {
    if (onClick) return onClick();
    if (path) router.push(path);
  };

  const navItems: NavItem[] = [
    {
      icon: <User size={20} />,
      label: "Profile",
      path: "/profile",
    },
    {
      icon: <Home size={20} />,
      label: "Information about campus",
      path: "/campus-info",
    },
    {
      icon: <GraduationCap size={20} />,
      label: "Academic programs",
      path: "/academic-programs",
    },
    {
      icon: <Award size={20} />,
      label: "Scholarships",
      path: "/scholarships",
    },
    {
      icon: <Image size={20} />,
      label: "Gallery",
      path: "/gallery",
    },
    {
      icon: <Users size={20} />,
      label: "Candidates",
      path: "/candidates",
    },
    {
      icon: <BarChart size={20} />,
      label: "Statistics",
      path: "/statistics",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      path: "/settings",
    },
  ];

  const logoutItem: NavItem = {
    icon: <LogOut size={20} />,
    label: "Logout",
    onClick: () => {
      localStorage.removeItem("accessToken");
      window.location.href = "https://www.gradabroad.net/login/university";
    },
  };

  return (
    <aside className="fixed left-0 top-[64px] w-60 h-[calc(100vh-64px)] flex flex-col justify-between bg-gray-50 border-r shadow-sm z-30">
      <nav className="p-4 space-y-2">
        {navItems.map((item, index) => {
          const isActive = pathname === item.path;
          return (
            <div
              key={index}
              className={cn(
                "p-3 rounded-md flex items-center gap-3 cursor-pointer transition-colors",
                isActive ? "bg-purple-100" : "hover:bg-red-100"
              )}
              onClick={() => handleNavigation(item.path, item.onClick)}
            >
              <div
                className={cn(
                  "p-1 rounded",
                  isActive ? "bg-purple-800 text-white" : "text-gray-500"
                )}
              >
                {item.icon}
              </div>
              <span
                className={cn(
                  isActive ? "font-medium text-purple-900" : "text-gray-600"
                )}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <div
          className="p-3 rounded-md flex items-center gap-3 cursor-pointer hover:bg-red-100 transition-colors"
          onClick={() => handleNavigation(undefined, logoutItem.onClick)}
        >
          <div className="p-1 rounded text-red-600">{logoutItem.icon}</div>
          <span className="text-red-700 font-medium">{logoutItem.label}</span>
        </div>
      </div>
    </aside>
  );
}
