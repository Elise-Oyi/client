"use client";
import Button from "@/components/buttons/Button";
import Form, { Field } from "@/components/forms/Form";
import Search from "@/components/search/Search";
import {
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Eye,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLearnersStore } from "@/store/learnersStore";
import toast from "react-hot-toast";

type Learner = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  contact?: string;
  description?: string;
  disabled?: boolean;
  location?: string;
  profileImage?: string;
  verificationToken?: string;
  verificationTokenExpiresAt?: string;
};

export default function LearnersPage() {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get learners data and functions from store
  const {
    learners,
    loading,
    error,
    fetchLearners,
    createLearner,
    updateLearner,
    deleteLearner,
    clearError,
  } = useLearnersStore();

  // Fetch learners on component mount
  useEffect(() => {
    fetchLearners().catch((err) => {
      console.error(
        "Failed to fetch learners:",
        err.message || "Unknown error"
      );
    });
  }, [fetchLearners]);

  // Show error notifications
  useEffect(() => {
    if (error) {
      toast.error(typeof error === "string" ? error : "An error occurred");
      clearError();
    }
  }, [error, clearError]);

  // Handle Escape key for modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (showViewModal) setShowViewModal(false);
        if (showModal) setShowModal(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [showViewModal, showModal]);

  // Pagination calculations
  const totalPages = Math.ceil(learners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLearners = learners.slice(startIndex, endIndex);
  const showPagination = learners.length > itemsPerPage;

  const fields: Field[] = [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "Enter first name",
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "Enter last name",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter email address",
    },
    {
      name: "contact",
      label: "Contact Number",
      type: "text",
      placeholder: "Enter phone number",
    },
    {
      name: "location",
      label: "Location",
      type: "text",
      placeholder: "Enter location",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter learner description",
    },
  ];

  const addButton = <Plus size={16} />;

  function handleSearch(value: string): void {
    // TODO: Implement search functionality
  }

  function handleAddLearner(): void {
    setShowModal(true);
  }

  function handleViewLearner(learner: Learner): void {
    setSelectedLearner(learner);
    setShowViewModal(true);
  }

  async function handleFormSubmit(data: Record<string, string>) {
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName || "");
      formData.append("lastName", data.lastName || "");
      formData.append("email", data.email || "");
      formData.append("contact", data.contact || "");
      formData.append("location", data.location || "");
      formData.append("description", data.description || "");
      formData.append("role", "learner"); // Default role

      const loadingToast = toast.loading("Creating learner...");

      await createLearner(formData);

      toast.dismiss(loadingToast);
      toast.success("Learner created successfully!");
      setShowModal(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create learner";
      toast.error(errorMessage);
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Manage learners
          </h1>
          <p className="text-gray-500 mt-2">
            Filter, sort, and access detailed learner profiles
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-end items-center mb-6">
        <Search onSearch={handleSearch} placeholder="Search learner" />
      </div>

      {/* Learners Table */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-500 uppercase tracking-wide border-b">
          <div className="col-span-4">LEARNERS</div>
          <div className="col-span-3">EMAIL</div>
          <div className="col-span-2">DATE JOINED</div>
          <div className="col-span-2">STATUS</div>
          <div className="col-span-1"></div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              Loading learners...
            </div>
          ) : learners.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No learners found.
            </div>
          ) : (
            currentLearners
              .filter((learner) => learner && learner._id)
              .map((learner, index) => (
                <div
                  key={learner._id}
                  className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-100 transition-colors ${
                    index % 2 === 1 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  {/* Learner Name with Avatar */}
                  <div className="col-span-4 flex items-center gap-3">
                    {learner.profileImage ? (
                      <img
                        src={learner.profileImage}
                        alt={
                          `${learner.firstName || ""} ${
                            learner.lastName || ""
                          }`.trim() || "User"
                        }
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                        {(learner.firstName || "U").charAt(0).toUpperCase()}
                        {(learner.lastName || "N").charAt(0).toUpperCase()}
                      </div>
                    )}

                    <span className="font-medium text-gray-900">
                      {`${learner.firstName || ""} ${
                        learner.lastName || ""
                      }`.trim() || "Unknown User"}
                    </span>
                  </div>

                  {/* Email */}
                  <div className="col-span-3 flex items-center">
                    <span className="text-gray-600">
                      {learner.email || "N/A"}
                    </span>
                  </div>

                  {/* Date Joined */}
                  <div className="col-span-2 flex items-center">
                    <span className="text-gray-600">
                      {learner.createdAt
                        ? new Date(learner.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        learner.isVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {learner.isVerified ? "Verified" : "Not Verified"}
                    </span>
                  </div>

                  {/* View Button */}
                  <div className="col-span-1 flex items-center justify-end cursor-pointer">
                    <button
                      onClick={() => handleViewLearner(learner)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Pagination - Only show if there are more items than itemsPerPage */}
      {showPagination && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-3 py-2 transition-colors shadow-sm rounded-lg ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-sky-700 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 px-4 py-2 transition-colors shadow-sm rounded-lg ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col items-center pt-6">
            <Form
              title="Add New Learner"
              fields={fields}
              onSubmit={handleFormSubmit}
              buttonLabel="Create Learner"
              successMessage="Learner added successfully"
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}

      {/* View Learner Modal */}
      {showViewModal && selectedLearner && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowViewModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Close Button */}
            <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                Learner Details
              </h2>
              <div className="flex items-center gap-3">
                {selectedLearner?.disabled && (
                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 font-medium">
                    Account Disabled
                  </span>
                )}
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 pb-6 bg-gray-50">
              {/* Profile Section */}
              <div className="flex flex-col items-center mb-6">
                {selectedLearner?.profileImage ? (
                  <img
                    src={selectedLearner.profileImage}
                    alt={
                      `${selectedLearner.firstName || ""} ${
                        selectedLearner.lastName || ""
                      }`.trim() || "User"
                    }
                    className="w-32 h-32 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-2xl mb-4">
                    {(selectedLearner?.firstName || "U")
                      .charAt(0)
                      .toUpperCase()}
                    {(selectedLearner?.lastName || "N").charAt(0).toUpperCase()}
                  </div>
                )}

                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {`${selectedLearner?.firstName || ""} ${
                    selectedLearner?.lastName || ""
                  }`.trim() || "Unknown User"}
                </h3>

                <p className="text-gray-600 text-sm">
                  {selectedLearner?.email || "No email"}
                </p>
              </div>

              {/* Details Section */}
              <div className="space-y-4 bg-white px-4 py-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Role</span>
                  <span className="text-gray-900 font-medium">
                    {selectedLearner?.role || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Contact</span>
                  <span className="text-gray-900 font-medium">
                    {selectedLearner?.contact || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Location</span>
                  <span className="text-gray-900 font-medium">
                    {selectedLearner?.location || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Verified</span>
                  <span
                    className={`text-sm px-2 py-1 rounded-full font-medium ${
                      selectedLearner?.isVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedLearner?.isVerified ? "Verified" : "Not Verified"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">
                    Account Status
                  </span>
                  <span
                    className={`text-sm px-2 py-1 rounded-full font-medium ${
                      selectedLearner?.disabled
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {selectedLearner?.disabled ? "Disabled" : "Active"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Date Joined</span>
                  <span className="text-gray-900 font-medium">
                    {selectedLearner?.createdAt
                      ? new Date(selectedLearner.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Last Login</span>
                  <span className="text-gray-900 font-medium">
                    {selectedLearner?.lastLogin
                      ? new Date(selectedLearner.lastLogin).toLocaleDateString()
                      : "Never"}
                  </span>
                </div>
                {selectedLearner?.description && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="font-medium text-gray-700 block mb-2">
                      Description
                    </span>
                    <p className="text-gray-900 text-sm leading-relaxed">
                      {selectedLearner.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
