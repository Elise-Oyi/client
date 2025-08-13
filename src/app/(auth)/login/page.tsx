
"use client";

import Image from "next/image";
import LoginForm from "@/components/forms/LoginForm";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, initializeAuth } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (mounted && user) {
      router.replace("/dashboard");
    }
  }, [mounted, user, router]);

  if (!mounted) {
    return (
      <div className="bg-white p-10 rounded-lg shadow-lg w-full text-center">
        <Image
          src="/logo-medium.png"
          alt="Logo"
          width={80}
          height={80}
          priority
          className="mx-auto mb-6"
        />
        <div className="animate-pulse h-8 bg-gray-200 rounded mb-4"></div>
        <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="bg-white p-10 rounded-lg shadow-lg w-full text-center">
      <Image
        src="/logo-medium.png"
        alt="Logo"
        width={80}
        height={80}
        priority
        className="mx-auto mb-6"
      />
      <LoginForm />
    </div>
  );
}
