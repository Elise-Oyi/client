"use client";

import React from "react";
import Image from "next/image";
import Sidebar from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/authStore";
import {
  ChartBarStacked,
  CircleDollarSign,
  ClipboardList,
  ReceiptText,
  UsersRound,
} from "lucide-react";
import Card from "@/components/statistics/Card";
import StatsCard from "@/components/statistics/Card";
import TracksCard from "@/components/cards/tracksCard";
import { Revenue } from "@/components/charts/revenue";
import Invoice from "@/components/charts/invoice";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  console.log(user, "user");

  const stats = [
    {
      title: "Total Learners",
      value: "12,450",
      icon: <UsersRound size={48} color="#119243" />,
      change: 12,
    },
    {
      title: "Revenue",
      value: "$ 12,450",
      icon: <CircleDollarSign size={48} color="#9d6f0b" />,
      change: 12,
    },
    {
      title: "Invoice",
      value: "100",
      icon: <ClipboardList size={48} color="#07346e" />,
      change: 2,
    },
  ];

  const tracks = [
    {
      title: "Software Engineering",
      value: "$180",
      duration: "3 months",
      category: ["NodeJs", "ReactJs"],
      image: "/tracks/track1.svg",
    },
    {
      title: "Cloud Computing",
      value: "$250",
      duration: "6 months",
      category: ["Azure", "AWS"],
      image: "/tracks/track2.svg",
    },
    {
      title: "Data Science",
      value: "$1000",
      duration: "3 months",
      category: ["Power BI", "Python"],
      image: "/tracks/track3.svg",
    },
    {
      title: "UI/UX Design",
      value: "$200",
      duration: "6 months",
      category: ["Figma", "Sketch"],
      image: "/tracks/track4.svg",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        {/* Header/Navbar */}
        <div className="bg-gray-50 p-6  ">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  Welcome Admin 👋{" "}
                </h1>
                <p className="text-gray-500 mt-2">
                  Track Activity,trends and popular destinations in real time
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            {/* Statistics card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
              {stats.map((stat, index) => (
                <StatsCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  change={stat.change}
                />
              ))}
            </div>

            {/* Tracks Section */}
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tracks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {tracks.map((track, index) => (
                <TracksCard
                  key={index}
                  title={track?.title}
                  price={track?.value}
                  duration={track?.duration}
                  category={track?.category}
                  image={track?.image}
                />
              ))}
              </div>
            </div>

            {/* {Charts} */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
              <Revenue />
              <Invoice />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
