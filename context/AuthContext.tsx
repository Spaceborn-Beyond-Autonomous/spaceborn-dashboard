"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { getAccessToken, clearTokens } from "@/lib/auth";
import { getCurrentUser } from "@/lib/api/users";
import { User } from "@/lib/types/users";

export const AuthContext = createContext({
  user: null as User | null,
  role: "",
  loading: true,
  refreshing: false,  // New state
  logout: () => { },
  refreshAuth: async () => { },
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUser = async () => {
    const token = getAccessToken();
    console.log("AuthProvider: Retrieved token:", token);

    if (!token) {
      setUser(null);
      setRole("");
      setLoading(false);
      return false;
    }

    try {
      const data = await getCurrentUser();
      setUser(data ?? null);
      setRole(data?.role ?? "");
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      clearTokens();
      setUser(null);
      setRole("");
      setLoading(false);
      return false;
    }
  };

  // Initial load
  useEffect(() => {
    fetchUser();
  }, []);

  function logout() {
    clearTokens();
    setUser(null);
    setRole("");
  }

  async function refreshAuth() {
    console.log("AuthProvider: Refreshing auth");
    setRefreshing(true);
    try {
      await fetchUser();
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, refreshing, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
