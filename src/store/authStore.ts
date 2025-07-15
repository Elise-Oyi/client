import {create} from 'zustand';

type AuthState = {
    user: string | {email: string; name: string} | null;
    token: string | null;
    setUser: (user: string | {email: string; name: string} | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    setUser: (user) => set({user}),
    setToken: (token) => set({token}),
    logout: () => set({user: null, token: null})
}));