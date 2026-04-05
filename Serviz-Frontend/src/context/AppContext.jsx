import { createContext } from "react";
import { useAuth } from "./AuthContext";

export const AppContext = createContext({ baseURL: "", user: null });

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const baseURL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BASE_URL || "http://localhost:5000";

  return (
    <AppContext.Provider value={{ baseURL, user }}>
      {children}
    </AppContext.Provider>
  );
};
