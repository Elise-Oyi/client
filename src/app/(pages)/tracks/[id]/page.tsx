"use client";
import {
  ArrowUp,
  Calendar,
  Pencil,
  Star,
  Trash,
  UserRound,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Form, { Field } from "@/components/forms/Form";
import { useRouter, useParams } from "next/navigation";
import { useTracksStore } from "@/store/tracksStore";
import toast from "react-hot-toast";

function TracksCard() {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  const params = useParams();
  const trackId = params.id as string;
  
  const {
    currentTrack,
    loading,
    error,
    fetchTrack,
    updateTrack,
    deleteTrack,
    clearError,
  } = useTracksStore();

  // Fetch track data when component mounts
  useEffect(() => {
    if (trackId) {
      fetchTrack(trackId).catch((err) => {
        console.error("Failed to fetch track:", err.message || "Unknown error");
      });
    }
  }, [trackId, fetchTrack]);

  // Show error notifications
  useEffect(() => {
    if (error) {
      toast.error(typeof error === 'string' ? error : 'An error occurred');
      clearError();
    }
  }, [error, clearError]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading track...</span>
      </div>
    );
  }

  if (!currentTrack) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Track not found.</p>
      </div>
    );
  }

  const {
    name,
    title,
    price,
    description,
    duration,
    instructor,
    image,
  } = currentTrack;

  const fields: Field[] = [
    {
      name: "title",
      label: "Track Name",
      type: "text",
      placeholder: "Enter track name",
      defaultValue: name || title || "",
    },
    { 
      name: "price", 
      label: "Price", 
      type: "text", 
      placeholder: "Enter price",
      defaultValue: price?.toString() || "",
    },
    {
      name: "duration",
      label: "Duration",
      type: "text",
      placeholder: "Enter duration",
      defaultValue: duration || "",
    },
    {
      name: "instructor",
      label: "Instructor",
      type: "text",
      placeholder: "Enter instructor name",
      defaultValue: instructor || "",
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
      placeholder: "Enter track description",
      defaultValue: description || "",
    },
  ];

  async function handleFormSubmit(data: Record<string, any>) {
    try {
      const formData = new FormData();
      formData.append('name', data.title || '');
      formData.append('price', data.price || '');
      formData.append('duration', data.duration || '');
      formData.append('instructor', data.instructor || '');
      formData.append('description', data.description || '');

      // Handle file upload
      if (data.picture && data.picture[0]) {
        formData.append('image', data.picture[0]);
      }

      const loadingToast = toast.loading("Updating track...");
      
      await updateTrack(trackId, formData);
      
      toast.dismiss(loadingToast);
      toast.success("Track updated successfully!");
      setShowModal(false);
      
      // Refresh the track data
      await fetchTrack(trackId);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update track";
      toast.error(errorMessage);
    }
  }

  function handleEditTrack(): void {
    setShowModal(true);
  }

  async function handleDeleteTrack(): Promise<void> {
    if (window.confirm("Are you sure you want to delete this track?")) {
      try {
        const loadingToast = toast.loading("Deleting track...");
        
        await deleteTrack(trackId);
        
        toast.dismiss(loadingToast);
        toast.success("Track deleted successfully!");
        
        // Navigate back to tracks page
        router.push('/tracks');
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete track";
        toast.error(errorMessage);
      }
    }
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
            src={image || '/tracks/track1.svg'}
            alt={name || title || 'Track'}
            fill
            className="rounded-b-none mb-4"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        <div className="px-6 py-3 bg-white rounded-b-3xl flex flex-col gap-2">
          {/* Title */}
          <div className="text-gray-900 font-bold text-3xl">{name || title || 'Untitled Track'}</div>

          {/* Duration and Teacher */}
          <div className="flex flex-row flex-between items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <div className="text-gray-600 text-sm flex flex-row items-center gap-2">
                <Calendar color="#1f1e1e" size={16} />
                <span className="text-md text-gray-500 font-normal">
                  {duration || 'Duration not specified'}
                </span>
              </div>
              <div className="flex flex-row items-center gap-2">
                <UserRound size={16} color="#1a1c1e" />
                <span className="text-sm text-gray-500 font-normal">
                  {instructor || 'Instructor not specified'}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="text-black px-3 py-1 text-xl font-semibold">
              {price ? `$${price}` : 'Price not set'}
            </div>
          </div>

          {/* Categories and Rating */}
          <div className="flex flex-row items-center gap-2 flex-wrap mt-2 flex-between  justify-between">
            <div className="">
              {(currentTrack?.category || []).map((item: string, index: number) => (
                <span
                  key={index}
                  className={`px-3 py-1 text-xs font-semibold rounded-full mr-2 ${
                    categoryColors[item] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>

            <span className="px-3 py-1 text-xs font-semibold rounded-full text-gray-800 flex items-center gap-1">
              {Array.from({ length: Math.ceil(currentTrack?.rating || 0) }).map((_, i) => (
                <Star key={i} color="#f5d60a" />
              ))}
              <span className="text-orange-600 text-xs bg-red-50 px-4 py-1 rounded-full">
                {currentTrack?.rating || 0}/5.0
              </span>
            </span>

            {/* Description */}
            <div className="text-gray-800 text-md mt-6">{description || 'No description available'}</div>
          </div>
          <div className="flex flex-row items-center justify-end mt-4 gap-2">
            <div
              className="bg-gray-50 p-6 text-blue-300 cursor-pointer hover:bg-blue-50 transition-colors"
              onClick={handleEditTrack}
              title="Edit track"
            >
              <Pencil />
            </div>
            <div 
              className="bg-gray-50 p-6 text-red-500 cursor-pointer hover:bg-red-50 transition-colors"
              onClick={handleDeleteTrack}
              title="Delete track"
            >
              <Trash />
            </div>
          </div>
        </div>

        {/* Modal for adding a new track can be implemented here */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col items-center pt-6">
              <Form
                title="Edit Track"
                fields={fields}
                onSubmit={handleFormSubmit}
                buttonLabel="Update Track"
                successMessage="Track updated successfully"
                onClose={() => setShowModal(false)}
                defaultValues={{
                  title: name || title || "",
                  price: price?.toString() || "",
                  duration: duration || "",
                  instructor: instructor || "",
                  description: description || "",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default TracksCard;
