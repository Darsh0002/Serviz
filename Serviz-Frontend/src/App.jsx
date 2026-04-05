import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Placeholders — we'll build these next
import UserDashboard from "./pages/user/UserDashboard";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import UnauthorizedPage from "./pages/auth/Unauthorized";
import LandingPage from "./pages/shared/LandingPage";

const App = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={12}
            toastOptions={{
              duration: 4000,
              style: {
                background: "#fff",
                color: "#333",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                fontSize: "14px",
                fontWeight: "500",
                padding: "16px",
              },
              success: {
                style: {
                  background: "#f0fdf4",
                  color: "#166534",
                  border: "1px solid #bbf7d0",
                },
                iconTheme: {
                  primary: "#16a34a",
                  secondary: "#f0fdf4",
                },
              },
              error: {
                style: {
                  background: "#fef2f2",
                  color: "#7f1d1d",
                  border: "1px solid #fecaca",
                },
                iconTheme: {
                  primary: "#dc2626",
                  secondary: "#fef2f2",
                },
              },
              loading: {
                style: {
                  background: "#eff6ff",
                  color: "#1e40af",
                  border: "1px solid #bfdbfe",
                },
                iconTheme: {
                  primary: "#2563eb",
                  secondary: "#eff6ff",
                },
              },
            }}
          />
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* User routes */}
          <Route
            path="/user/*"
            element={
              <ProtectedRoute role="USER">
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Provider routes */}
          <Route
            path="/provider/*"
            element={
              <ProtectedRoute role="PROVIDER">
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
    </AuthProvider>
  );
};

export default App;
