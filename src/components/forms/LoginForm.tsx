"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

type LoginFields = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>();

  const login = useAuthStore((s) => s.login);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginFields) => {
    setLoading(true);

    const loadingToast = toast.loading("Signing in...");

    try {
      await login(data);

      toast.dismiss(loadingToast);
      toast.success("Login successful! Welcome back!");

      // Navigate to dashboard
      router.push("/dashboard");
    } catch (err: unknown) {
      toast.dismiss(loadingToast);
      const errorMessage = err instanceof Error ? err.message : "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md bg-white p-8 space-y-2"
    >
      <h2 className="text-2xl font-bold text-center text-black mb-2">
        Admin Login
      </h2>
      <p className="text-gray-500 text-center text-sm mb-6 font-normal">
        Login to Manage and Access the Dashboard Effortlessly.
      </p>

      <div>
        <label className="block text-sm font-medium text-left text-gray-900 mb-2">
          Email
        </label>
        <input
          type="email"
          {...register("email", { required: true })}
          className="w-full border px-4 py-1 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500 placeholder-gray-500 shadow-sm"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">Email is required</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-left text-gray-900 mb-2">
          Password
        </label>
        <input
          type="password"
          {...register("password", { required: true })}
          className="w-full border border-gray-200 px-4 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500 placeholder-gray-500 shadow-sm"
        />
        {errors.password && (
          <span className="text-red-500 text-sm">Password is required</span>
        )}
      </div>

      <div className="text-blue-600 text-left">
        <a
          href="/reset-password"
          className="hover:underline cursor-pointer"
        >
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="text-center text-gray-500">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="text-blue-600 hover:underline">
          Signup
        </a>
      </div>
    </form>
  );
}
