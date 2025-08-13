import { ArrowUp } from "lucide-react";
import React from "react";

function StatsCard({
  title,
  value,
  icon,
  change,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: number;
}) {
  return (
    <div className="bg-white rounded-lg px-6 py-6 shadow-md flex flex-col gap-2">
      <div className="text-gray-900">{title}</div>
      <div className="flex flex-row items-center justify-between">
        <div className=" flex flex-col text-2xl font-semibold text-gray-800">
          {value}
          <div className="text-sm font-normal text-gray-600 flex flex-row items-center gap-1">
          <ArrowUp size={16} color="#119243" />
            {" "}
            <span className="text-green-600"> 
            {change}%</span> vs last month
          </div>
        </div>
        <div className="">{icon}</div>
      </div>
    </div>
  );
}

export default StatsCard;
