import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../APIs/axios";
import {
  ClipboardList, BookOpen, CheckCircle, Clock,
  Plus, ArrowRight, AlertCircle, User, CreditCard
} from "lucide-react";

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="glass rounded-4xl p-6 flex items-center gap-5 hover:scale-[1.02] transition-all duration-300 border border-white/50 shadow-sm">
    <div className={`p-4 rounded-2xl bg-linear-to-br from-orange-500 via-purple-500 to-blue-600 shadow-lg shadow-purple-200/50`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
    </div>
  </div>
);

const statusColors = {
  OPEN: "bg-orange-100 text-orange-700 border border-orange-200",
  ASSIGNED: "bg-blue-100 text-blue-700 border border-blue-200",
  COMPLETED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  CANCELLED: "bg-slate-100 text-slate-700 border border-slate-200",
};

const Dashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, bookRes] = await Promise.all([
          api.get("/user/all-requests"),
          api.get("/user/bookings"),
        ]);
        const sortedRequests = reqRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const sortedBookings = bookRes.data.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
        setRequests(sortedRequests);
        setBookings(sortedBookings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      label: "Total Requests",
      value: requests.length,
      icon: ClipboardList,
    },
    {
      label: "Open Requests",
      value: requests.filter((r) => r.status === "OPEN").length,
      icon: Clock,
    },
    {
      label: "Active Bookings",
      value: bookings.filter((b) => b.status === "SCHEDULED").length,
      icon: BookOpen,
    },
    {
      label: "Completed",
      value: bookings.filter((b) => b.status === "COMPLETED").length,
      icon: CheckCircle,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-[3px] border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Welcome back 👋
          </h1>
          <p className="text-slate-500 mt-1 font-medium">{user?.email}</p>
        </div>
        <Link to="/user/requests/new"
          className="btn-primary w-full sm:w-auto shadow-purple-200/50">
          <Plus size={20} />
          New Request
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Recent Requests */}
      <div className="glass rounded-4xl overflow-hidden border border-white/50 shadow-sm">
        <div className="flex items-center justify-between p-8 border-b border-slate-100/50 bg-white/30">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Requests</h2>
          <Link to="/user/requests"
            className="text-sm font-bold text-purple-600 hover:text-orange-600 transition-colors flex items-center gap-1.5 group">
            View all <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="bg-slate-50 p-6 rounded-3xl mb-4">
              <AlertCircle size={48} className="text-slate-300" />
            </div>
            <p className="font-semibold text-slate-500">No requests yet</p>
            <Link to="/user/requests/new"
              className="mt-4 text-sm font-bold text-purple-600 hover:underline">
              Create your first request
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100/50">
            {requests.slice(0, 5).map((req) => (
              <div key={req.id} className="p-6 hover:bg-white/40 transition-all duration-300 space-y-4 group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors capitalize">
                      {req.serviceType.replace("_", " ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${statusColors[req.status]}`}>
                      {req.status}
                    </span>
                    {req.status === "OPEN" && (
                      <Link to={`/user/requests/${req.id}/bids`}
                        className="btn-secondary py-1.5 px-4 text-xs">
                        View Bids
                      </Link>
                    )}
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {req.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-xl">
                      <Plus size={14} className="text-slate-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                      <p className="text-sm font-bold text-slate-700 mt-0.5">
                        {req.address}, {req.city}
                      </p>
                    </div>
                  </div>
                  {req.assignedProvider && (
                    <div className="flex items-start gap-3">
                      <div className="bg-emerald-50 p-2 rounded-xl">
                        <CheckCircle size={14} className="text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Provider</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-700">{req.assignedProvider.name}</p>
                          {req.assignedProvider.avgRating > 0 && (
                            <span className="bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0.5 rounded-md font-black">
                              ⭐ {req.assignedProvider.avgRating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6 pt-2 border-t border-slate-100/30">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500">
                      Created on - {new Date(req.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Bookings */}
      <div className="glass rounded-[2rem] overflow-hidden border border-white/50 shadow-sm">
        <div className="flex items-center justify-between p-8 border-b border-slate-100/50 bg-white/30">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Bookings</h2>
          <Link to="/user/bookings"
            className="text-sm font-bold text-purple-600 hover:text-orange-600 transition-colors flex items-center gap-1.5 group">
            View all <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="bg-slate-50 p-6 rounded-3xl mb-4">
              <BookOpen size={48} className="text-slate-300" />
            </div>
            <p className="font-semibold text-slate-500">No bookings yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100/50">
            {bookings.slice(0, 5).map((b) => (
              <div key={b.id} className="p-6 hover:bg-white/40 transition-all duration-300 space-y-4 group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors capitalize">
                      {b.bid.serviceRequest.serviceType.replace("_", " ")}
                    </p>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${statusColors[b.status]}`}>
                    {b.status}
                  </span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {b.bid.serviceRequest.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-50 p-2 rounded-xl">
                      <User size={14} className="text-purple-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Provider</p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-700">{b.provider.name}</p>
                        {b.provider.avgRating > 0 && (
                          <span className="bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0.5 rounded-md font-black">
                            ⭐ {b.provider.avgRating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded-xl">
                      <CreditCard size={14} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">₹{b.bid.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-orange-50 p-2 rounded-xl">
                      <Clock size={14} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</p>
                      <p className="text-sm font-bold text-slate-700 mt-0.5">{b.bid.estimatedTimeInHours} Hours</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2 border-t border-slate-100/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500">
                      Booked on - {new Date(b.bookedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;