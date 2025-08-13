"use client";

import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type SignupFields = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  contact: string;
};

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFields>({
    defaultValues: {
      contact: "+233241333224",
    },
  });

  const [loading, setLoading] = useState(false);
  const signup = useAuthStore((s) => s.signup);
  const router = useRouter();
  const pwd = watch("password");

  const onSubmit = async (data: SignupFields) => {
    const { ...signupData } = data;
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    const loadingToast = toast.loading("Creating your account...");
    console.log(signupData, "signupData");
    try {
      await signup(signupData);

      toast.dismiss(loadingToast);
      toast.success("Account created successfully! Welcome!");

      router.push("/otp");
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(err?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md bg-white p-6 space-y-2"
    >
      <h2 className="text-2xl font-bold text-center text-black">
        Admin Sign up
      </h2>
      <p className="text-gray-500 text-sm font-normal text-center">
        Create Your Account to Manage and Access the Dashboard Effortlessly.
      </p>

      {/* First Name */}
      <div>
        <label className="block text-sm font-medium text-left text-gray-900">
          First name
        </label>
        <input
          {...register("firstName", { required: true })}
          className="mt-1 w-full border px-3 py-1 rounded-lg border-gray-200 shadow-sm focus:outline-none focus:ring text-gray-500"
        />
        {errors.firstName && (
          <span className="text-red-500 text-sm">Required</span>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-sm font-medium text-left text-gray-900">
          Last name
        </label>
        <input
          {...register("lastName", { required: true })}
          className="mt-1 w-full border px-3 py-1 rounded-lg border-gray-200 shadow-sm focus:outline-none focus:ring text-gray-500"
        />
        {errors.lastName && (
          <span className="text-red-500 text-sm">Required</span>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-left text-gray-900">
          Email
        </label>
        <input
          type="email"
          {...register("email", { required: true })}
          className="mt-1 w-full border px-3 py-1 rounded-lg border-gray-200 shadow-sm focus:outline-none focus:ring text-gray-500"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">Email is required</span>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-left text-gray-900">
          Password
        </label>
        <input
          type="password"
          {...register("password", { required: true, minLength: 8 })}
          className="mt-1 w-full border px-3 py-1 rounded-lg border-gray-200 shadow-sm focus:outline-none focus:ring text-gray-500"
        />
        {errors.password && (
          <span className="text-red-500 text-sm">Min 8 characters</span>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-left text-gray-900">
          Confirm password
        </label>
        <input
          type="password"
          {...register("confirmPassword", {
            required: true,
            validate: (v) => v === pwd || "Passwords do not match",
          })}
          className="mt-1 w-full border px-3 py-1 rounded-lg border-gray-200 shadow-sm focus:outline-none focus:ring text-gray-500"
        />
        {errors.confirmPassword && (
          <span className="text-red-500 text-sm">
            {String(errors.confirmPassword.message)}
          </span>
        )}
      </div>
      <input type="hidden" {...register("contact")} value="+233241333224" />

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-800 font-semibold text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        {loading ? "Creating account..." : "Sign up"}
      </button>

      {/* Switch back to login */}
      <div className="text-center text-gray-900">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Login
        </a>
      </div>
    </form>
  );
}
