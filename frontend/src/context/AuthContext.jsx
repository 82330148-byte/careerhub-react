import { createContext, useContext, useMemo, useState } from "react";
import { api, getErrorMessage } from "../services/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "careerhub_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  async function login(email, password) {
    try {
      const response = await api.post("/login", { email, password });
      setUser(response.data.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data.user));
      return response.data.user;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  function updateUser(nextUser) {
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  const value = useMemo(
    () => ({ user, loading: false, login, logout, updateUser }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
