"use client"

import type React from "react"

import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LogOut,
  Home,
  GraduationCap,
  Award,
  Image,
  Users,
  Megaphone,
  CreditCard,
  FileText,
  BarChart,
  Settings,
  User,
} from "lucide-react"

interface NavItem {
  icon: React.ReactNode
  label: string
  path: string
}

export function SideNav() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      icon: <User size={20} />,
      label: "Profile",
      path: "/",
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
      icon: <Megaphone size={20} />,
      label: "Sponsored content",
      path: "/sponsored-content",
    },
    {
      icon: <CreditCard size={20} />,
      label: "Billing and Payments",
      path: "/billing",
    },
    {
      icon: <FileText size={20} />,
      label: "Document types",
      path: "/document-types",
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
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <aside className="w-60 p-4 bg-gray-50 min-h-[calc(100vh-64px)] relative">
      <nav className="space-y-2">
        {navItems.map((item, index) => {
          const isActive = pathname === item.path
          return (
            <div
              key={index}
              className={cn(
                "p-3 rounded-md flex items-center gap-3 cursor-pointer",
                isActive ? "bg-purple-100" : "hover:bg-gray-100",
              )}
              onClick={() => handleNavigation(item.path)}
            >
              <div className={cn("p-1 rounded", isActive ? "bg-purple-800 text-white" : "text-gray-500")}>
                {item.icon}
              </div>
              <span className={cn(isActive ? "font-medium text-purple-900" : "text-gray-600")}>{item.label}</span>
            </div>
          )
        })}
      </nav>

      <div className="absolute bottom-4 left-4 text-red-500 flex items-center gap-2 cursor-pointer">
        <LogOut size={20} />
        <span>Logout</span>
      </div>
    </aside>
  )
}

