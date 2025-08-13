"use client";
import {
  ArrowUp,
  Calendar,
  Pencil,
  Star,
  Trash,
  UserRound,
} from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import Form, { Field } from "@/components/forms/Form";

const { useRouter } = require("next/navigation");

const track = {
  id: "1",
  title: "Software Engineering",
  price: "$180",
  duration: "3 months",
  category: ["NodeJs", "ReactJs"],
  description:
    "Learn full-stack development with Node.js and React.js. Learn full-stack development with Node.js and React.js. Learn full-stack development with Node.js and React.js. Learn full-stack development with Node.js and React.js.Learn full-stack development with Node.js and React.js. Learn full-stack development with Node.js and React.js. Learn full-stack development with Node.js and React.js. Learn full-stack development with Node.js and React.js.",
  image: "/tracks/track1.svg",
  teacher: "John Doe",
  teacherImage: <UserRound size={16} color="#1a1c1e" />,
  star: 4.9,
};

const {
  title,
  price,
  description,
  duration,
  category,
  image,
  teacher,
  teacherImage,
  star,
} = track;

function TracksCard() {
  const [showModal, setShowModal] = useState(false);

  const fields: Field[] = [
    {
      name: "title",
      label: "Track Name",
      type: "text",
      placeholder: "",
    },
    { name: "value", label: "Price", type: "text", placeholder: "" },
    {
      name: "duration",
      label: "Duration",
      type: "text",
      placeholder: "",
    },
    {
      name: "instructor",
      label: "Instructor",
      type: "text",
      placeholder: "",
    },
    {
      name: "picture",
      label: "Picture",
      type: "file",
      placeholder: "",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "",
    },
    // Add more fields as needed
  ];

  async function handleFormSubmit(data: Record<string, string>) {
    console.log("Form Submitted", data);
    setShowModal(false);
  }

  function handleEditTrack(): void {
    setShowModal(true);

    console.log("here track");
  }

  const categoryColors: { [key: string]: string } = {
    NodeJs: "bg-blue-100 text-blue-800",
    ReactJs: "bg-green-100 text-green-800",
    Azure: "bg-yellow-100 text-yellow-800",
    AWS: "bg-purple-100 text-purple-800",
    Python: "bg-red-100 text-yellow-800",
    Figma: "bg-orange-100 text-purple-800",
    Sketch: "bg-blue-100 text-green-800",
  };

  return (
    <>
      {/* Title */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Manage Tracks
            </h1>
            <p className="text-gray-500 mt-2">
              Filter, sort, and access detailed tracks.
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden bg-white hover:shadow-sm transition-shadow duration-300 cursor-pointer mt-7 w-full max-w-4xl mx-auto">
        <div className="relative w-full h-64 md:h-80 rounded-none overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="rounded-b-none mb-4"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        <div className="px-6 py-3 bg-white rounded-b-3xl flex flex-col gap-2">
          {/* Title */}
          <div className="text-gray-900 font-bold text-3xl">{title}</div>

          {/* Duration and Teacher */}
          <div className="flex flex-row flex-between items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <div className="text-gray-600 text-sm flex flex-row items-center gap-2">
                <Calendar color="#1f1e1e" size={16} />
                <span className="text-md text-gray-500 font-normal">
                  {duration}
                </span>
              </div>
              <div className="flex flex-row items-center gap-2">
                {teacherImage}
                <span className="text-sm text-gray-500 font-normal">
                  {teacher}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="text-black px-3 py-1 text-xl font-semibold">
              {price}
            </div>
          </div>

          {/* Categories and Rating */}
          <div className="flex flex-row items-center gap-2 flex-wrap mt-2 flex-between  justify-between">
            <div className="">
              {category?.map((item, index) => (
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

            <span className="px-3 py-1 text-xs font-semibold rounded-full text-gray-800 flex items-center gap-1">
              {Array.from({ length: Math.ceil(star) }).map((_, i) => (
                <Star key={i} color="#f5d60a" />
              ))}
              <span className="text-orange-600 text-xs bg-red-50 px-4 py-1 rounded-full">
                {star}/5.0
              </span>
            </span>

            {/* Description */}
            <div className="text-gray-800 text-md mt-6">{description}</div>
          </div>
          <div className="flex flex-row items-center justify-end mt-4 gap-2">
            <div
              className="bg-gray-50 p-6 text-blue-300"
              onClick={handleEditTrack}
            >
              <Pencil />
            </div>
            <div className="bg-gray-50 p-6 text-gray-700">
              <Trash />
            </div>
          </div>
        </div>

        {/* Modal for adding a new track can be implemented here */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col items-center pt-6">
              <Form
                title="Add New Track"
                fields={fields}
                onSubmit={handleFormSubmit}
                buttonLabel="Create Track"
                successMessage="Track added successfully"
                onClose={() => setShowModal(false)}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default TracksCard;
