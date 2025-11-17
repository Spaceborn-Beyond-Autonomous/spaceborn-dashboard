"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { getAccessToken, clearTokens } from "@/lib/auth";
import { getCurrentUser } from "@/lib/api/users";
import { User } from "@/lib/types/users";


export const AuthContext = createContext({
  user: null as User | null,
  role: "",
  loading: true,
  logout: () => { },
  refreshAuth: () => { },
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const token = getAccessToken();
    console.log("AuthProvider: Retrieved token:", token);
    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentUser().then((data) => {
      setUser(data ?? null);
      setRole(data.role ?? "");
      setLoading(false);
    }).catch(() => {
      // If dashboard fetch fails, clear tokens and set loading to false
      clearTokens();
      setLoading(false);
    });
  }, [refreshTrigger]);

  function logout() {
    clearTokens();
    setUser(null);
    setRole("");
  }

  function refreshAuth() {
    setRefreshTrigger(prev => prev + 1);
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
