import { create } from "zustand";
import { useAuthStore } from "./authStore";

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

type LearnersState = {
  learners: Learner[];
  currentLearner: Learner | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchLearners: () => Promise<void>;
  fetchLearner: (id: string) => Promise<void>;
  createLearner: (learnerData: FormData) => Promise<void>;
  updateLearner: (id: string, learnerData: Partial<Learner>) => Promise<void>;
  deleteLearner: (id: string) => Promise<void>;
  setLearners: (learners: Learner[]) => void;
  setCurrentLearner: (learner: Learner | null) => void;
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

export const useLearnersStore = create<LearnersState>((set, get) => ({
  learners: [],
  currentLearner: null,
  loading: false,
  error: null,

  fetchLearners: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/learners", {
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
        
        throw new Error(errorData.error || "Failed to fetch learners");
      }

      const data = await response.json();
      console.log("Fetched learners:", data);
      set({ 
        learners: data.learners || data, 
        loading: false, 
        error: null 
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch learners",
        loading: false,
      });
      throw error;
    }
  },

  fetchLearner: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/learners/${id}`, {
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
        
        throw new Error(errorData.error || "Failed to fetch learner");
      }

      const data = await response.json();
      set({ 
        currentLearner: data.learner || data, 
        loading: false, 
        error: null 
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch learner",
        loading: false,
      });
      throw error;
    }
  },

  createLearner: async (learnerData: FormData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/learners", {
        method: "POST",
        headers: getFormDataAuthHeaders(),
        body: learnerData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle token expiration
        if (response.status === 401) {
          useAuthStore.getState().logout();
          throw new Error("Your session has expired. Please log in again.");
        }
        
        throw new Error(errorData.error || "Failed to create learner");
      }

      const data = await response.json();
      const newLearner = data.learner || data;
      
      set((state) => ({
        learners: [...state.learners, newLearner],
        loading: false,
        error: null,
      }));

      return newLearner;
    } catch (error: any) {
      set({
        error: error.message || "Failed to create learner",
        loading: false,
      });
      throw error;
    }
  },

  updateLearner: async (id: string, learnerData: Partial<Learner>) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/learners/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(learnerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle token expiration
        if (response.status === 401) {
          useAuthStore.getState().logout();
          throw new Error("Your session has expired. Please log in again.");
        }
        
        throw new Error(errorData.error || "Failed to update learner");
      }

      const data = await response.json();
      const updatedLearner = data.learner || data;
      
      set((state) => ({
        learners: state.learners.map((learner) =>
          learner._id === id ? updatedLearner : learner
        ),
        currentLearner: state.currentLearner?._id === id ? updatedLearner : state.currentLearner,
        loading: false,
        error: null,
      }));

      return updatedLearner;
    } catch (error: any) {
      set({
        error: error.message || "Failed to update learner",
        loading: false,
      });
      throw error;
    }
  },

  deleteLearner: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/learners/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle token expiration
        if (response.status === 401) {
          useAuthStore.getState().logout();
          throw new Error("Your session has expired. Please log in again.");
        }
        
        throw new Error(errorData.error || "Failed to delete learner");
      }

      set((state) => ({
        learners: state.learners.filter((learner) => learner._id !== id),
        currentLearner: state.currentLearner?._id === id ? null : state.currentLearner,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete learner",
        loading: false,
      });
      throw error;
    }
  },

  setLearners: (learners) => set({ learners }),
  setCurrentLearner: (learner) => set({ currentLearner: learner }),
  clearError: () => set({ error: null }),
}));