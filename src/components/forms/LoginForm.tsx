"use client";

import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", data); // adapt to your endpoint
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md bg-white p-6  space-y-2"
    >
      <h2 className="text-2xl font-bold text-center text-black">Admin Login</h2>
      <p className="text-gray-600">Login to Manage and Access the Dashboard Effortlessly.</p>

      <div>
        <label className="block text-sm font-medium text-left text-gray-600">Email</label>
        <input
          type="email"
          {...register("email", { required: true })}
          className="mt-1 block w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
        />
        {errors.email && <span className="text-red-500 text-sm">Email is required</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-left text-gray-600">Password</label>
        <input
          type="password"
          {...register("password", { required: true })}
          className="mt-1 block w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
        />
        {errors.password && <span className="text-red-500 text-sm">Password is required</span>}
      </div>
      <div className="text-blue-600 text-left">
        <a href="/auth/reset-password" className="hover:underline cursor-pointer">forgot password?</a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      
      <div className="text-center text-gray-500">
        Don't have an account? <a href="/auth/signup" className="text-blue-600 hover:underline">Signup</a>
      </div>

    </form>
  );
}
