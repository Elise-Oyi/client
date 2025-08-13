"use client";
import Button from "@/components/buttons/Button";
import TracksCard from "@/components/cards/tracksCard";
import Form, { Field } from "@/components/forms/Form";
import Search from "@/components/search/Search";
import { Plus, UserRound, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useTracksStore } from "@/store/tracksStore";
import toast from "react-hot-toast";

export default function TracksPage() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // Get tracks data and functions from store
  const {
    tracks,
    loading,
    error,
    fetchTracks,
    createTrack,
    clearError
  } = useTracksStore();

  // Fetch tracks on component mount
  useEffect(() => {
    fetchTracks().catch((err) => {
      console.error("Failed to fetch tracks:", err.message || "Unknown error");
    });
  }, [fetchTracks]);

  // Log tracks data when it changes
  useEffect(() => {
    console.log("Tracks in component:", tracks);
  }, [tracks]);

  // Show error notifications
  useEffect(() => {
    if (error) {
      toast.error(typeof error === 'string' ? error : 'An error occurred');
      clearError();
    }
  }, [error, clearError]);

  const fields: Field[] = [
    {
      name: "title",
      label: "Track Name",
      type: "text",
      placeholder: "Enter track name",
    },
    { 
      name: "price", 
      label: "Price", 
      type: "text", 
      placeholder: "Enter price (e.g., 180)" 
    },
    {
      name: "duration",
      label: "Duration",
      type: "text",
      placeholder: "Enter duration (e.g., 3 months)",
    },
    {
      name: "instructor",
      label: "Instructor",
      type: "text",
      placeholder: "Enter instructor name",
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
    },
  ];

  const addButton = <Plus size={16} />;

  function handleSearch(value: string): void {
    // TODO: Implement search functionality
  }

  function handleAddTrack(): void {
    setShowModal(true);
  }

  const handleTrackClick = (trackId: string) => {
    if (trackId) {
      router.push(`/tracks/${trackId}`);
    }
  };

  async function handleFormSubmit(data: Record<string, string>) {
    try {
      const formData = new FormData();
      formData.append('title', data.title || '');
      formData.append('price', data.price || '');
      formData.append('duration', data.duration || '');
      formData.append('instructor', data.instructor || '');
      formData.append('description', data.description || '');

      // Handle file upload
      if (typeof data.picture === 'object' && 'name' in data.picture) {
        formData.append('picture', data.picture as File);
      }

      const loadingToast = toast.loading("Creating track...");
      
      await createTrack(formData);
      
      toast.dismiss(loadingToast);
      toast.success("Track created successfully!");
      setShowModal(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create track";
      toast.error(errorMessage);
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        {/* Header/Navbar */}
        <div className="bg-gray-50  ">
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
          <div className="">
            {/* Tracks Section */}
            <div className="flex flex-row justify-between items-center mt-10 gap-2">
              <Search onSearch={handleSearch} placeholder="Search Track" />
              <Button
                variant="primary"
                icon={addButton}
                onClick={handleAddTrack}
              >
                Add Track
              </Button>
            </div>
            <div className="mt-6">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading tracks...</span>
                </div>
              ) : tracks.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500">No tracks found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {tracks.map((track, index) => (
                    <TracksCard
                      key={track._id || index}
                      title={track?.title || track?.name}
                      price={track?.price ? `$${track.price}` : (track?.value || 'N/A')}
                      description={track?.description}
                      duration={track?.duration}
                      category={track?.category || []}
                      image={track?.image || '/tracks/track1.svg'}
                      teacher={track?.instructor || 'N/A'}
                      teacherImage={<UserRound size={16} color="#1a1c1e" />}
                      onClick={() => handleTrackClick(track?._id || '')}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* {Charts} */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10"></div>
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
      </div>
    </div>
  );
}

