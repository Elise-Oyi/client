import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import Image from "next/image";

export default function ResetPasswordPage() {
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
      <ResetPasswordForm />
    </div>
  );
}