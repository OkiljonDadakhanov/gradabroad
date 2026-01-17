"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and redirect to profile
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.push("/profile");
    }
  }, [router]);

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Welcome to Graduate in Korea</h1>
        <p className="text-lg mb-6 text-gray-600">Your university dashboard</p>
      </div>
    </AppLayout>
  );
}
