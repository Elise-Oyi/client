import { create } from "zustand";
import { useAuthStore } from "./authStore";

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

type CoursesState = {
  courses: Course[];
  currentCourse: Course | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchCourses: () => Promise<void>;
  fetchCourse: (id: string) => Promise<void>;
  createCourse: (courseData: FormData) => Promise<void>;
  updateCourse: (id: string, courseData: FormData) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  setCourses: (courses: Course[]) => void;
  setCurrentCourse: (course: Course | null) => void;
  clearError: () => void;
};

const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };
};

const getFormDataAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    ...(token && { "Authorization": `Bearer ${token}` })
  };
};

export const useCoursesStore = create<CoursesState>((set, get) => ({
  courses: [],
  currentCourse: null,
  loading: false,
  error: null,

  fetchCourses: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/courses", {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle token expiration
        if (response.status === 401) {
          useAuthStore.getState().logout();
          throw new Error("Your session has expired. Please log in again.");
        }
        
        throw new Error(errorData.error || "Failed to fetch courses");
      }

      const data = await response.json();
      set({ 
        courses: Array.isArray(data) ? data : (data.courses || []), 
        loading: false, 
        error: null 
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch courses",
        loading: false,
      });
      throw error;
    }
  },

  fetchCourse: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch course");
      }

      const data = await response.json();
      set({ 
        currentCourse: data.course || data, 
        loading: false, 
        error: null 
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch course",
        loading: false,
      });
      throw error;
    }
  },

  createCourse: async (courseData: FormData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: getFormDataAuthHeaders(),
        body: courseData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle token expiration
        if (response.status === 401) {
          useAuthStore.getState().logout();
          throw new Error("Your session has expired. Please log in again.");
        }
        
        throw new Error(errorData.error || "Failed to create course");
      }

      const data = await response.json();
      const newCourse = data.course || data;
      
      set((state) => ({
        courses: [...state.courses, newCourse],
        loading: false,
        error: null,
      }));

      return newCourse;
    } catch (error: any) {
      set({
        error: error.message || "Failed to create course",
        loading: false,
      });
      throw error;
    }
  },

  updateCourse: async (id: string, courseData: FormData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        body: courseData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update course");
      }

      const data = await response.json();
      const updatedCourse = data.course || data;
      
      set((state) => ({
        courses: state.courses.map((course) =>
          course._id === id ? updatedCourse : course
        ),
        currentCourse: state.currentCourse?._id === id ? updatedCourse : state.currentCourse,
        loading: false,
        error: null,
      }));

      return updatedCourse;
    } catch (error: any) {
      set({
        error: error.message || "Failed to update course",
        loading: false,
      });
      throw error;
    }
  },

  deleteCourse: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete course");
      }

      set((state) => ({
        courses: state.courses.filter((course) => course._id !== id),
        currentCourse: state.currentCourse?._id === id ? null : state.currentCourse,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete course",
        loading: false,
      });
      throw error;
    }
  },

  setCourses: (courses) => set({ courses }),
  setCurrentCourse: (course) => set({ currentCourse: course }),
  clearError: () => set({ error: null }),
}));