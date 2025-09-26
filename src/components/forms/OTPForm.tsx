"use client";

import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

interface OTPFormProps {
  email?: string;
}

export default function OTPForm({ email }: OTPFormProps) {

  const user = useAuthStore(s=>s.user)
  const otp = useAuthStore(s => s.otp);
    
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLoading(true);

    console.log(user,"user")
    
    const loadingToast = toast.loading("Verifying OTP...");
    if (!user) {
      toast.error("Invalid or missing user details.");
      setLoading(false);
      return;
    }
    const token = user.verificationToken 
    
    try {
      await otp(data);
      
      toast.dismiss(loadingToast);
      toast.success("OTP verified successfully!");
      
      router.push("/dashboard");
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    const loadingToast = toast.loading("Resending OTP...");
    
    try {
      await api.post("/resend-otp", { email });
      
      toast.dismiss(loadingToast);
      toast.success("OTP resent successfully! Check your email.");
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black mb-2">OTP verification</h2>
        <p className="text-gray-600 text-sm">
          Enter the verification code we sent to your<br />
          {user?.email}
        </p>
        {/* <p className="text-green-300 text-sm text-wrap font-medium">
          Token<br />
          {user?.verificationToken}
        </p> */}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-left text-gray-700 mb-1">Code</label>
          <input
            type="text"
            placeholder="12345"
            {...register("token", { required: true })}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          />
          {errors.token && <span className="text-red-500 text-sm">Token is required</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <div className="text-center text-gray-500 text-sm">
          Didn&apos;t you receive the OTP?{" "}
          <button
            type="button"
            onClick={handleResendOTP}
            className="text-blue-600 hover:underline"
          >
            Resend OTP
          </button>
        </div>
      </form>
    </div>
  );
}