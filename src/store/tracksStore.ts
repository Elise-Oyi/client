import { create } from "zustand";
import { useAuthStore } from "./authStore";

type Track = {
  _id: string;
  name?: string;
  title?: string;
  description?: string;
  price?: number;
  instructor?: string;
  duration?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  admin?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  value?: string;
  category?: string[];
  rating?: number;
  totalRatings?: number;
  level?: string;
};

type Rating = {
  _id: string;
  userId: string;
  trackId: string;
  rating: number;
  comment?: string;
  createdAt?: string;
};

type TracksState = {
  tracks: Track[];
  currentTrack: Track | null;
  trackRatings: Rating[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchTracks: () => Promise<void>;
  fetchTrack: (id: string) => Promise<void>;
  createTrack: (trackData: FormData) => Promise<void>;
  updateTrack: (id: string, trackData: FormData) => Promise<void>;
  deleteTrack: (id: string) => Promise<void>;
  fetchTrackRatings: (id: string) => Promise<void>;
  rateTrack: (id: string, ratingData: { rating: number; comment?: string }) => Promise<void>;
  setTracks: (tracks: Track[]) => void;
  setCurrentTrack: (track: Track | null) => void;
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

export const useTracksStore = create<TracksState>((set, get) => ({
  tracks: [],
  currentTrack: null,
  trackRatings: [],
  loading: false,
  error: null,

  fetchTracks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/tracks", {
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
        
        throw new Error(errorData.error || "Failed to fetch tracks");
      }

      const data = await response.json();
      console.log("Fetched tracks:", data);
      set({ 
        tracks: Array.isArray(data) ? data : (data.tracks || []), 
        loading: false, 
        error: null 
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch tracks",
        loading: false,
      });
      throw error;
    }
  },

  fetchTrack: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/tracks/${id}`, {
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
        
        throw new Error(errorData.error || "Failed to fetch track");
      }

      const data = await response.json();
      set({ 
        currentTrack: data.track || data, 
        loading: false, 
        error: null 
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch track",
        loading: false,
      });
      throw error;
    }
  },

  createTrack: async (trackData: FormData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/tracks", {
        method: "POST",
        headers: getFormDataAuthHeaders(),
        body: trackData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle token expiration
        if (response.status === 401) {
          useAuthStore.getState().logout();
          throw new Error("Your session has expired. Please log in again.");
        }
        
        throw new Error(errorData.error || "Failed to create track");
      }

      const data = await response.json();
      const newTrack = data.track || data;
      
      set((state) => ({
        tracks: [...state.tracks, newTrack],
        loading: false,
        error: null,
      }));

      return newTrack;
    } catch (error: any) {
      set({
        error: error.message || "Failed to create track",
        loading: false,
      });
      throw error;
    }
  },

  updateTrack: async (id: string, trackData: FormData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/tracks/${id}`, {
        method: "PUT",
        headers: getFormDataAuthHeaders(),
        body: trackData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle token expiration
        if (response.status === 401) {
          useAuthStore.getState().logout();
          throw new Error("Your session has expired. Please log in again.");
        }
        
        throw new Error(errorData.error || "Failed to update track");
      }

      const data = await response.json();
      const updatedTrack = data.track || data;
      
      set((state) => ({
        tracks: state.tracks.map((track) =>
          track._id === id ? updatedTrack : track
        ),
        currentTrack: state.currentTrack?._id === id ? updatedTrack : state.currentTrack,
        loading: false,
        error: null,
      }));

      return updatedTrack;
    } catch (error: any) {
      set({
        error: error.message || "Failed to update track",
        loading: false,
      });
      throw error;
    }
  },

  deleteTrack: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/tracks/${id}`, {
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
        
        throw new Error(errorData.error || "Failed to delete track");
      }

      set((state) => ({
        tracks: state.tracks.filter((track) => track._id !== id),
        currentTrack: state.currentTrack?._id === id ? null : state.currentTrack,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete track",
        loading: false,
      });
      throw error;
    }
  },

  fetchTrackRatings: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/tracks/${id}/ratings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch track ratings");
      }

      const data = await response.json();
      set({ 
        trackRatings: data.ratings || data, 
        loading: false, 
        error: null 
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch track ratings",
        loading: false,
      });
      throw error;
    }
  },

  rateTrack: async (id: string, ratingData: { rating: number; comment?: string }) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/tracks/${id}/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to rate track");
      }

      const data = await response.json();
      
      // Update the track's rating in the list if it's returned
      if (data.track) {
        set((state) => ({
          tracks: state.tracks.map((track) =>
            track._id === id ? { ...track, rating: data.track.rating, totalRatings: data.track.totalRatings } : track
          ),
          currentTrack: state.currentTrack?._id === id 
            ? { ...state.currentTrack, rating: data.track.rating, totalRatings: data.track.totalRatings }
            : state.currentTrack,
          loading: false,
          error: null,
        }));
      } else {
        set({ loading: false, error: null });
      }

      return data;
    } catch (error: any) {
      set({
        error: error.message || "Failed to rate track",
        loading: false,
      });
      throw error;
    }
  },

  setTracks: (tracks) => set({ tracks }),
  setCurrentTrack: (track) => set({ currentTrack: track }),
  clearError: () => set({ error: null }),
}));