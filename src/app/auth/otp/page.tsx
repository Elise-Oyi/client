import OTPForm from "@/components/forms/OTPForm";
import Image from "next/image";

export default function OTPPage() {
  return (
    <div className="relative h-screen w-screen">
      {/* Fullscreen Background Image */}
      <Image
        src="/auth-bg.png"
        alt="OTP background"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />

      {/* Form Container */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full text-center">
          <Image
            src="/logo-medium.png"
            alt="Logo"
            width={80}
            height={80}
            className="mx-auto mb-6"
          />
          <OTPForm />
        </div>
      </div>
    </div>
  );
}