import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/LoginPage";
import UserDashboard from "./pages/user/UserDashboard";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import Unauthorized from "./pages/Unauthorized";
import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/SignUpPage";
import LoadingState from "./components/LoadingState";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/loading" element={<LoadingState />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* USER ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            {/* <Route path="/user/requests" element={<MyRequests />} /> */}
          </Route>
        </Route>

        {/* PROVIDER ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["PROVIDER"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/provider/dashboard" element={<ProviderDashboard />} />
            {/* <Route path="/provider/jobs" element={<AvailableJobs />} /> */}
          </Route>
        </Route>


        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
