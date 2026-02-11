"use client";

import { useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Self-heal: if token exists in localStorage but not in cookies, set the cookie
  // so middleware doesn't lock users out
  useEffect(() => {
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token");
    if (!token) return;

    const hasCookie = document.cookie
      .split("; ")
      .some((c) => c.startsWith("accessToken="));
    if (!hasCookie) {
      document.cookie = `accessToken=${token}; path=/; max-age=86400; SameSite=Lax`;
    }
  }, []);

  return <AppLayout>{children}</AppLayout>;
}
