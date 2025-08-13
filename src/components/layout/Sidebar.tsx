"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BookA,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  Users,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Loader from "../ui/Loader";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  
  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { name: "Invoices", href: "/invoices", icon: <ReceiptText size={20} /> },
    { name: "Learners", href: "/learners", icon: <Users size={20} /> },
    { name: "Tracks", href: "/tracks", icon: <GraduationCap size={20} /> },
    { name: "Courses", href: "/courses", icon: <GraduationCap size={20} /> },
    { name: "Report", href: "/report", icon: <BookA size={20} /> },
  ];

  const { user, logout } = useAuthStore();

   // Hydration guard
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // Wait for client hydration before rendering
  if (!hydrated) return null;

  if (!user) {
    return <Loader />;
  }
  // const [user, setUser] = React.useState(null);

  // React.useEffect(() => {
  //   const unsub = useAuthStore.subscribe((state) => {
  //     setUser(state.user);
  //   });
  //   setUser(useAuthStore.getState().user); // set initial state

  //   return () => unsub();
  // }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) {
    return <Loader />; // or a spinner
  }

  return (
    <div className="w-64 bg-sky-800 text-white h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-3 pb-8">
        <div className=" p-6 bg-white rounded-sm flex items-center justify-center">
          <Image
            src="/logo-medium.png"
            alt="Logo"
            width={80}
            height={80}
            priority
            className="rounded"
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-sm transition-colors ${
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? "bg-sky-100 text-sky-900"
                    : "text-blue-100 hover:bg-sky-100 hover:text-sky-900"
                }`}
              >
                <span className="text-sm bg">{item.icon}</span>
                <span className="font-normal">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Admin Profile Section */}
      <div className="p-4 border-t border-blue-500">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            A
          </div>
          <div>
            <p className="font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-blue-200">{user?.email}</p>
          </div>
          <div className="">
            <button onClick={handleLogout} className="cursor-pointer hover:text-blue-300 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
