"use client";

import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ResetPasswordForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLoading(true);
    
    const loadingToast = toast.loading("Sending reset email...");
    
    try {
      await api.post("/reset-password", data);
      
      toast.dismiss(loadingToast);
      toast.success("Password reset email sent successfully! Check your inbox.");
      
      router.push("/login");
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black mb-2">Admin Reset Password</h2>
        <p className="text-gray-600 text-sm">
          Enter your email to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-left text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          />
          {errors.email && <span className="text-red-500 text-sm">Email is required</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
        >
          {loading ? "Sending..." : "Reset password"}
        </button>

        <div className="text-center text-gray-500 text-sm">
          Back to homepage,{" "}
          <button
            type="button"
            onClick={handleBackToLogin}
            className="text-blue-600 hover:underline"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}