"use client";
import Sidebar from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/ui/Loader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, initializeAuth } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth from localStorage
    initializeAuth();
    setIsLoading(false);
  }, [initializeAuth]);

  useEffect(() => {
    // Check authentication after loading
    if (!isLoading && (!user || !token)) {
      router.push('/login');
      return;
    }
  }, [user, token, router, isLoading]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  // Show loading while redirecting
  if (!user || !token) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto p-8">
        {children}
      </div>
    </div>
  );
}
