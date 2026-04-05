import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Dashboard from "./Dashboard";
import MyRequests from "./MyRequests";
import CreateRequest from "./CreateRequest";
import RequestBids from "./RequestBids";
import UserBookings from "./UserBookings";
import UserProfile from "./UserProfile";
import Payment from "./Payment";

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="requests" element={<MyRequests />} />
            <Route path="requests/new" element={<CreateRequest />} />
            <Route path="requests/:requestId/bids" element={<RequestBids />} />
            <Route path="bookings" element={<UserBookings />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="bookings/:bookingId/payment" element={<Payment />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;