import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/LoginPage";
import UserDashboard from "./pages/UserDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import Unauthorized from "./pages/Unauthorized";
import LandingPage from "./pages/LandingPage";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* USER ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
        </Route>

        {/* PROVIDER ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["PROVIDER"]} />}>
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
