"use client";

import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface NewPasswordFormProps {
  token?: string;
}

export default function NewPasswordForm({ token }: NewPasswordFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const password = watch("password");

  const onSubmit = async (data: any) => {
    setLoading(true);
    
    const loadingToast = toast.loading("Updating password...");
    
    try {
      await api.post("/set-new-password", { ...data, token });
      
      toast.dismiss(loadingToast);
      toast.success("Password updated successfully! You can now login.");
      
      router.push("/login");
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || "Password update failed");
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
          Create new password
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-left text-gray-700 mb-1">New password</label>
          <input
            type="password"
            {...register("password", { required: true, minLength: 6 })}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              Password is required and must be at least 6 characters
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-left text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", { 
              required: true,
              validate: (value) => value === password || "Passwords do not match"
            })}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword.message?.toString() || "Confirm password is required"}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
        >
          {loading ? "Updating..." : "Sign up"}
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