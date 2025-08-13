"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";

export type Field = {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "tel"
    | "url"
    | "textarea"
    | "select"
    | "file";
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  accept?: string;
  defaultValue?: string;
};

type AuthFormProps = {
  title: string;
  description?: string;
  fields: Field[];
  onSubmit: (data: Record<string, string>) => Promise<void>;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  buttonLabel?: string;
  footer?: React.ReactNode;
  onClose?: () => void;
  defaultValues?: Record<string, string>;
};

export default function AuthForm({
  title,
  description,
  fields,
  onSubmit,
  loadingMessage = "Processing...",
  successMessage = "Success!",
  errorMessage = "An error occurred.",
  buttonLabel = "Submit",
  footer,
  onClose,
  defaultValues = {},
}: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Record<string, string>>({
    defaultValues,
  });

  const [loading, setLoading] = useState(false);

  const handleFormSubmit: SubmitHandler<Record<string, string>> = async (
    data
  ) => {
    const toastId = toast.loading(loadingMessage);
    setLoading(true);
    try {
      await onSubmit(data);
      toast.dismiss(toastId);
      toast.success(successMessage);
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err.message || errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="w-full max-w-sm px-6 pt-1 pb-4 space-y-2"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1">
          <h2 className="text-2xl text-center text-black">{title}</h2>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 ml-4"
          >
            <X size={20} />
          </button>
        )}
      </div>
      {description && (
        <p className="text-gray-500 text-center text-sm mb-4">{description}</p>
      )}

      {fields.map(
        ({ name, label, type, required, placeholder, options, accept }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {label}
            </label>

            {type === "textarea" ? (
              <textarea
                {...register(name, { required })}
                placeholder={placeholder}
                className="w-full border px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400 shadow-sm"
              />
            ) : type === "select" && options ? (
              <select
                {...register(name, { required })}
                className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400 shadow-sm"
              >
                <option value="">Select {label}</option>
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : type === "file" ? (
              <input
                type="file"
                {...register(name, { required })}
                accept={accept}
                className="w-full border px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400 shadow-sm"
              />
            ) : (
              <input
                type={type}
                {...register(name, { required })}
                placeholder={placeholder}
                className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400 shadow-sm"
              />
            )}

            {errors[name] && (
              <span className="text-red-500 text-sm">{label} is required</span>
            )}
          </div>
        )
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-sky-800 text-white py-2 mb-6 mt-4 rounded-md hover:bg-sky-700 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Please wait..." : buttonLabel}
      </button>

      {footer && <div className="text-center text-sm">{footer}</div>}
    </form>
  );
}
