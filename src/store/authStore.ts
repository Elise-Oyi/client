import { create } from "zustand";

type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    contact?: string; 
    isVerified: boolean;
    verificationToken: string;
    verificationTokenExpiresAt?: string;
    lastLogin?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  initializeAuth: () => void;
  logout: () => void;

  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (info: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    contact: string;
  }) => Promise<void>;
  otp:(otpdata:{token:string})=> Promise<void>;
};

// Helper functions for localStorage
const getStoredAuth = () => {
  if (typeof window === 'undefined') return { user: null, token: null };
  
  try {
    const user = localStorage.getItem('auth-user');
    const token = localStorage.getItem('auth-token');
    return {
      user: user ? JSON.parse(user) : null,
      token: token || null
    };
  } catch {
    return { user: null, token: null };
  }
};

const setStoredAuth = (user: User | null, token: string | null) => {
  if (typeof window === 'undefined') return;
  
  if (user && token) {
    localStorage.setItem('auth-user', JSON.stringify(user));
    localStorage.setItem('auth-token', token);
  } else {
    localStorage.removeItem('auth-user');
    localStorage.removeItem('auth-token');
  }
};

export const useAuthStore = create<AuthState>((set, get) => {
  const { user: storedUser, token: storedToken } = getStoredAuth();
  
  return {
    user: storedUser,
    token: storedToken,
    loading: false,
    error: null,

    setUser: (user) => {
      set({ user });
      setStoredAuth(user, get().token);
    },
    
    setToken: (token) => {
      set({ token });
      setStoredAuth(get().user, token);
    },

    initializeAuth: () => {
      const { user, token } = getStoredAuth();
      set({ user, token });
    },

    logout: () => {
      set({ user: null, token: null, loading: false, error: null });
      setStoredAuth(null, null);
    },

    login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Login failed");
      }

      const result = await res.json();

      const userData = {
        id: result.user._id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
        contact: result.user.contact, 
        isVerified: result.user.isVerified,
        verificationToken: result.user.verificationToken,
        verificationTokenExpiresAt: result.user.verificationTokenExpiresAt,
        lastLogin: result.user.lastLogin,
        createdAt: result.user.createdAt,
        updatedAt: result.user.updatedAt,
      };
      
      set({
        user: userData,
        token: result.token,
        loading: false,
        error: null,
      });
      
      // Store in localStorage
      setStoredAuth(userData, result.token);

      return result; // Return the result for the component to use
    } catch (err: any) {
      set({
        error: err.message || "Login failed",
        loading: false,
      });
      throw err; // Re-throw to let the component handle it
    }
  },

  signup: async (info) => {
    set({ loading: true, error: null });

    console.log(info,"info")
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Signup failed");
      }

      const result = await res.json();

      const userData = {
        id: result.user._id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
        contact: result.user.contact,
        isVerified: result.user.isVerified,
        verificationToken: result.user.verificationToken,
        verificationTokenExpiresAt: result.user.verificationTokenExpiresAt,
        lastLogin: result.user.lastLogin,
        createdAt: result.user.createdAt,
        updatedAt: result.user.updatedAt,
      };

      set({
        user: userData,
        token: result.token,
        loading: false,
        error: null,
      });
      
      // Store in localStorage
      setStoredAuth(userData, result.token);

      return result; // Return the result for the component to use
    } catch (err: any) {
      set({
        error: err.message || "Signup failed",
        loading: false,
      });
      throw err; // Re-throw to let the component handle it
    }
  },

  otp: async (otpData) => {
    const token = useAuthStore.getState().token; 
    if (!token) {
      throw new Error("No token available. Please log in again.");
    }
    set({loading:true, error:null})
    console.log(otpData,"otpdata")
    try {
        const res = await fetch("/api/auth/otp",{
            method: "POST",
            headers: { "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}`
            },
            
            body: JSON.stringify(otpData),

        })

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "OTP failed");
          }
    
          const result = await res.json();

          const updatedUser = {
            ...get().user!,
            ...result.user
          };

          set({
            user: updatedUser,
            loading: false,
            error: null,
          });
          
          // Update localStorage with new user data
          setStoredAuth(updatedUser, get().token);
    
    } catch (error:any) {
        set({
            error: error.message || "OTP verification failed",
            loading: false,
          });
          throw error;
    }
  },
  };
});
