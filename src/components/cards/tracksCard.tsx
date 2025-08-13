import { ArrowUp, Calendar } from "lucide-react";
import React from "react";

import Image from "next/image";

function TracksCard({
  title,
  price,
  description,
  duration,
  category,
  image,
  teacher,
  teacherImage,
  onClick,
}: {
  title: string;
  price: string;
  description?: string;
  duration: string;
  category: string[];
  image: string;
  teacher?: string;
  teacherImage?: any;
  onClick?: () => void;
}) {
  const categoryColors: { [key: string]: string } = {
    NodeJs: "bg-blue-100 text-blue-800",
    ReactJs: "bg-green-100 text-green-800",
    Azure: "bg-yellow-100 text-yellow-800",
    AWS: "bg-purple-100 text-purple-800",
    Python: "bg-red-100 text-yellow-800",
    Figma: "bg-orange-100 text-purple-800",
    Sketch: "bg-blue-100 text-green-800"
  };

  return (
    <div className="w-full rounded-3xl overflow-hidden bg-white hover:shadow-sm transition-shadow duration-300 cursor-pointer"
    onClick={onClick} >
      <div className="relative w-full h-48 md:h-60 rounded-none overflow-hidden">
        <h2>Tracks</h2>
        <div className="absolute top-2 right-2 text-black px-3 py-1 text-sm rounded-full shadow">
          {price && (
            <div className="absolute top-2 right-2 z-20 bg-gray-100 text-black px-3 py-1 text-sm rounded-full shadow font-semibold">
              {price}
            </div>
          )}{" "}
        </div>{" "}
        <Image
          src={image}
          alt={title}
          fill
          className="rounded-b-none mb-4"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      <div className="px-4 py-3 bg-white rounded-b-3xl flex flex-col gap-2">
        <div className="text-gray-900 font-bold text-lg">{title}</div>
        {description && (
          <p className="text-gray-800 text-sm mb-2">
            {description.length > 150 
              ? (
                  <>
                    {description.substring(0, 150)}...{" "}
                    <span className="text-blue-600 cursor-pointer hover:underline">Read more</span>
                  </>
                )
              : description
            }
          </p>
        )}
        <div className="text-gray-600 text-sm flex flex-row items-center gap-2">
          <Calendar color="#1f1e1e" size={16} />
          <span className="text-md text-gray-500 font-normal">{duration}</span>
        </div>
        <div className="flex flex-row items-center gap-2">
          {teacherImage}
          <span className="text-sm text-gray-500 font-normal">{teacher}</span>
        </div>
        <div className="flex flex-row items-center gap-2 flex-wrap mt-2">
          {category.map((item, index) => (
            <span
              key={index}
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                categoryColors[item] || "bg-gray-100 text-gray-800"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
        <div className="flex flex-row items-center justify-between"></div>
      </div>
    </div>
  );
}

export default TracksCard;
