"use client";

import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SignupFields = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function SignupForm() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SignupFields>();

    const [loading, setLoading] = useState(false);
    const setUser = useAuthStore((s) => s.setUser);
    const setToken = useAuthStore((s) => s.setToken);
    const router = useRouter();
    const pwd = watch("password");

    const onSubmit = async (data: SignupFields) => {
        setLoading(true);
        try {
            const res = await api.post("/auth/register", data); // adjust endpoint if needed
            const { token, user } = res.data;
            setToken(token);
            setUser(user);
            router.push("/dashboard");
        } catch (err: any) {
            alert(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md bg-white p-6 space-y-2"
        >
            <h2 className="text-2xl font-bold text-center text-black">Admin Sign up</h2>
            <p className="text-gray-600 text-sm">
                Create Your Account to Manage and Access the Dashboard Effortlessly.
            </p>

            {/*  First name */}
            <div className="">
                <label className="block text-sm font-medium text-left text-gray-600">First name</label>
                <input
                    {...register("firstName", { required: true })}
                    className="mt-1 w-full border px-3 py-1 rounded-lg shadow-md focus:outline-none focus:ring"
                />
                {errors.firstName && (
                    <span className="text-red-500 text-sm">Required</span>
                )}
            </div>

            {/*  Last name */}

              <div className="">
                <label className="block text-sm font-medium text-left text-gray-600">Last name</label>
                <input
                    {...register("lastName", { required: true })}
                    className="mt-1 w-full border px-3 py-1 rounded-lg shadow-md focus:outline-none focus:ring"
                />
                {errors.lastName && (
                    <span className="text-red-500 text-sm">Required</span>
                )}
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-left text-gray-600">Email</label>
                <input
                    type="email"
                    {...register("email", { required: true })}
                    className="mt-1 w-full border px-3 py-1 rounded-lg shadow-md focus:outline-none focus:ring"
                />
                {errors.email && (
                    <span className="text-red-500 text-sm">Email is required</span>
                )}
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-medium text-left text-gray-600">Password</label>
                <input
                    type="password"
                    {...register("password", { required: true, minLength: 6 })}
                    className="mt-1 w-full border px-3 py-1 rounded-lg shadow-md focus:outline-none focus:ring"
                />
                {errors.password && (
                    <span className="text-red-500 text-sm">
                        Min 6 characters
                    </span>
                )}
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block text-sm font-medium text-left text-gray-600">
                    Confirm password
                </label>
                <input
                    type="password"
                    {...register("confirmPassword", {
                        required: true,
                        validate: (v) => v === pwd || "Passwords do not match",
                    })}
                    className="mt-1 w-full border px-3 py-1 rounded-lg shadow-md focus:outline-none focus:ring"
                />
                {errors.confirmPassword && (
                    <span className="text-red-500 text-sm">
                        {String(errors.confirmPassword.message)}
                    </span>
                )}
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
                {loading ? "Creating account..." : "Sign up"}
            </button>

            {/* Switch back to login */}
            <div className="text-center text-gray-500">
                Already have an account?{" "}
                <a href="/auth/login" className="text-blue-600 hover:underline">
                    Login
                </a>
            </div>
        </form>
    );
}
