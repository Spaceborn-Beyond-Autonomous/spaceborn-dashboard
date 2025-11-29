"use client";

import { createContext, useState, useEffect, useContext, ReactNode, Dispatch, SetStateAction } from "react";
import { getAccessToken, clearTokens } from "@/lib/auth";
import { getCurrentUser } from "@/lib/api/users";
import { User } from "@/lib/types/users";
import { useRouter } from "next/navigation";

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  role: string;
  loading: boolean;
  refreshing: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

// Create context with default values matching the type
export const AuthContext = createContext<AuthContextType>({
  user: null,
  role: "",
  loading: true,
  refreshing: false,
  setUser: () => { },
  logout: () => { },
  refreshAuth: async () => { },
});

// Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchUser = async () => {
    const token = getAccessToken();

    if (!token) {
      setUser(null);
      setLoading(false);
      return false;
    }

    try {
      const data = await getCurrentUser();
      setUser(data ?? null);
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // If fetch fails (e.g., 401), clear tokens and user
      clearTokens();
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  // Initial load
  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    clearTokens();
    setUser(null);
    router.push('/login');
  };

  const refreshAuth = async () => {
    setRefreshing(true);
    try {
      await fetchUser();
    } finally {
      setRefreshing(false);
    }
  };

  // Derive role from user object to prevent sync issues
  const role = user?.role || "";

  return (
    <AuthContext.Provider value={{
      user,
      role,
      loading,
      refreshing,
      setUser,
      logout,
      refreshAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}