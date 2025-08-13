"use client";
import Button from "@/components/buttons/Button";
import Form, { Field } from "@/components/forms/Form";
import Search from "@/components/search/Search";
import { Plus, Trash2, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useCoursesStore } from "@/store/coursesStore";
import toast from "react-hot-toast";

type Course = {
  _id: string;
  name?: string;
  title?: string;
  description?: string;
  track?: {
    _id: string;
    name: string;
    price: number;
    instructor: string;
    duration: string;
    image: string;
    description: string;
  };
  image?: string;
  admin?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  price?: number;
  instructor?: string;
  duration?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  id?: string;
};

export default function CoursesPage() {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of courses per page

  // Get courses data and functions from store
  const {
    courses,
    loading,
    error,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    clearError
  } = useCoursesStore();

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses().catch((err) => {
      console.error("Failed to fetch courses:", err.message || "Unknown error");
    });
  }, [fetchCourses]);

  // Show error notifications
  useEffect(() => {
    if (error) {
      toast.error(typeof error === 'string' ? error : 'An error occurred');
      clearError();
    }
  }, [error, clearError]);

  const availableTracks = [
    { label: "Software Engineering", value: "Software Engineering" },
    { label: "Cloud Computing", value: "Cloud Computing" },
    { label: "Data Science", value: "Data Science" },
    { label: "UI/UX Design", value: "UI/UX Design" },
  ];

  const fields: Field[] = [
    {
      name: "name",
      label: "Title",
      type: "text",
      placeholder: "",
    },
    { 
      name: "track", 
      label: "Track", 
      type: "select", 
      placeholder: "",
      options: availableTracks
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
  ];

  const addButton = <Plus size={16} />;

  function handleSearch(value: string): void {
  }

  function handleAddCourse(): void {
    setShowModal(true);
  }

  async function handleFormSubmit(data: Record<string, string>) {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('track', data.track);
      formData.append('description', data.description);
      
      // Handle file upload
      if (data.picture && typeof data.picture === 'object' && 'name' in data.picture) {
        formData.append('image', data.picture as File);
      }

      const loadingToast = toast.loading("Creating course...");
      
      await createCourse(formData);
      
      toast.dismiss(loadingToast);
      toast.success("Course created successfully!");
      setShowModal(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create course";
      toast.error(errorMessage);
    }
  }

  function handleEditCourse(course: Course): void {
    setEditingCourse(course);
    setShowEditModal(true);
  }

  async function handleEditFormSubmit(data: Record<string, string>) {
    if (!editingCourse) return;
    
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('track', data.track);
      formData.append('description', data.description);
      
      // Handle file upload
      if (data.picture && typeof data.picture === 'object' && 'name' in data.picture) {
        formData.append('image', data.picture as File);
      }

      const loadingToast = toast.loading("Updating course...");
      
      await updateCourse(editingCourse._id, formData);
      
      toast.dismiss(loadingToast);
      toast.success("Course updated successfully!");
      setShowEditModal(false);
      setEditingCourse(null);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update course";
      toast.error(errorMessage);
    }
  }

  function handleDeleteCourse(course: Course): void {
    setDeletingCourse(course);
    setShowDeleteModal(true);
  }

  async function confirmDelete(): Promise<void> {
    if (!deletingCourse) return;
    
    try {
      const loadingToast = toast.loading("Deleting course...");
      
      await deleteCourse(deletingCourse._id);
      
      toast.dismiss(loadingToast);
      toast.success("Course deleted successfully!");
      setShowDeleteModal(false);
      setDeletingCourse(null);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete course";
      toast.error(errorMessage);
    }
  }

  function cancelDelete(): void {
    setShowDeleteModal(false);
    setDeletingCourse(null);
  }

  // Pagination calculations
  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = courses.slice(startIndex, endIndex);
  const showPagination = courses.length > itemsPerPage;

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Manage Courses</h1>
          <p className="text-gray-500 mt-2">Filter, sort, and access detailed courses</p>
        </div>
      </div>

      {/* Search and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <Search onSearch={handleSearch} placeholder="Search course" />
        <Button
          variant="primary"
          icon={addButton}
          onClick={handleAddCourse}
        >
          Add course
        </Button>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-500 uppercase tracking-wide border-b">
          <div className="col-span-4">COURSES</div>
          <div className="col-span-3">TRACKS</div>
          <div className="col-span-3">DATE JOINED</div>
          <div className="col-span-2"></div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              Loading courses...
            </div>
          ) : courses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No courses found. Create your first course!
            </div>
          ) : (
            currentCourses.filter(course => course && course._id).map((course, index) => (
            <div
              key={course._id}
              className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-100 transition-colors ${
                index % 2 === 1 ? "bg-gray-50" : "bg-white"
              }`}
            >
              {/* Course Name with Icon */}
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg">📚</span>
                </div>
                <span className="font-medium text-gray-900">{course?.name || course?.title || 'Untitled Course'}</span>
              </div>

              {/* Track */}
              <div className="col-span-3 flex items-center">
                <span className="text-gray-600">{course?.track?.name || 'N/A'}</span>
              </div>

              {/* Date Joined */}
              <div className="col-span-3 flex items-center">
                <span className="text-gray-600">
                  {course?.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="col-span-2 flex items-center justify-end gap-2">
                <button 
                  onClick={() => handleEditCourse(course)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button 
                  onClick={() => handleDeleteCourse(course)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
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
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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

      {/* Add Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col items-center pt-6">
            <Form
              title="Add New Course"
              fields={fields}
              onSubmit={handleFormSubmit}
              buttonLabel="Create Course"
              successMessage="Course added successfully"
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && editingCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col items-center pt-6">
            <Form
              title="Update Course"
              fields={fields}
              defaultValues={{
                name: editingCourse?.name || editingCourse?.title || "",
                track: editingCourse?.track?.name || "",
                description: editingCourse?.description || ""
              }}
              onSubmit={handleEditFormSubmit}
              buttonLabel="Update Course"
              successMessage="Course updated successfully"
              onClose={() => {
                setShowEditModal(false);
                setEditingCourse(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Delete Course</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &ldquo;{deletingCourse?.name || deletingCourse?.title || 'this course'}&rdquo;? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

