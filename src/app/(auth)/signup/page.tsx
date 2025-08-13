
import Image from "next/image";
import SignupForm from "@/components/forms/SignupForm";

export default function SignupPage() {
  return (
    <div className="bg-white p-10 rounded-lg shadow-lg w-full text-center">
      <Image
        src="/logo-medium.png"
        alt="Logo"
        width={80}
        height={80}
        className="mx-auto mb-6"
      />
      <SignupForm />
    </div>
  );
}
