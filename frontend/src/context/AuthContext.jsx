import React, { createContext, useContext, useEffect, useState } from "react";
import { loginApi, meApi, registerApi } from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("venus_token");
    if (!token) {
      setLoading(false);
      return;
    }
    meApi()
      .then((u) => setUser(u))
      .catch(() => {
        localStorage.removeItem("venus_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await loginApi({ email, password });
    localStorage.setItem("venus_token", data.access_token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const data = await registerApi(payload);
    localStorage.setItem("venus_token", data.access_token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("venus_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
