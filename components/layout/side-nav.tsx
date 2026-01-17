"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
  ChevronRight,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

export function SideNav() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      icon: <User size={18} />,
      label: "Profile",
      path: "/profile",
    },
    {
      icon: <Home size={18} />,
      label: "Campus Info",
      path: "/campus-info",
    },
    {
      icon: <GraduationCap size={18} />,
      label: "Programs",
      path: "/academic-programs",
    },
    {
      icon: <Award size={18} />,
      label: "Scholarships",
      path: "/scholarships",
    },
    {
      icon: <ImageIcon size={18} />,
      label: "Gallery",
      path: "/gallery",
    },
    {
      icon: <Users size={18} />,
      label: "Candidates",
      path: "/candidates",
    },
    {
      icon: <BarChart3 size={18} />,
      label: "Statistics",
      path: "/statistics",
    },
    {
      icon: <Settings size={18} />,
      label: "Settings",
      path: "/settings",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "https://www.gradabroad.net/login/university";
  };

  return (
    <aside className="fixed left-0 top-16 w-60 h-[calc(100vh-64px)] flex flex-col justify-between bg-white border-r z-30">
      <nav className="p-3 space-y-1">
        <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Menu
        </p>
        {navItems.map((item, index) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={index}
              href={item.path}
              className={cn(
                "px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all duration-200 group",
                isActive
                  ? "bg-purple-50 text-purple-700 font-medium"
                  : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  isActive
                    ? "bg-purple-100 text-purple-700"
                    : "bg-slate-100 text-gray-500 group-hover:bg-slate-200"
                )}
              >
                {item.icon}
              </div>
              <span className="flex-1 text-sm">{item.label}</span>
              {isActive && (
                <ChevronRight size={16} className="text-purple-400" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t">
        <button
          type="button"
          className="w-full px-3 py-2.5 rounded-lg flex items-center gap-3 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
          onClick={handleLogout}
        >
          <div className="p-1.5 rounded-md bg-slate-100 text-gray-500 group-hover:bg-red-100 group-hover:text-red-500 transition-colors">
            <LogOut size={18} />
          </div>
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
