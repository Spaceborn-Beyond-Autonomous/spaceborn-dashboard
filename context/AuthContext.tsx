"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { getAccessToken, clearTokens } from "@/lib/auth";
import { getDashboard } from "@/lib/api/dashboard";

type User = { id: number; name: string; email: string };

export const AuthContext = createContext({
  user: null as User | null,
  role: "",
  loading: true,
  logout: () => { },
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

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    getDashboard().then((data) => {
      setUser(data.user ?? null);
      setRole(data.user?.role ?? "");
      setLoading(false);
    }).catch(() => {
      // If dashboard fetch fails, clear tokens and set loading to false
      clearTokens();
      setLoading(false);
    });
  }, []);

  function logout() {
    clearTokens();
    setUser(null);
    setRole("");
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
