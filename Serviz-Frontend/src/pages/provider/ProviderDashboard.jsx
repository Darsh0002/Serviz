import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Dashboard from "./Dashboard";
import OpenRequests from "./OpenRequests";
import ProviderBookings from "./ProviderBookings";
import ProviderProfile from "./ProviderProfile";

const ProviderDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="requests" element={<OpenRequests />} />
            <Route path="bookings" element={<ProviderBookings />} />
            <Route path="profile" element={<ProviderProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default ProviderDashboard;