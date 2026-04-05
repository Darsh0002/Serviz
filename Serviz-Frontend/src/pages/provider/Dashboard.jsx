import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../APIs/axios";
import {
  ClipboardList, BookOpen, CheckCircle,
  IndianRupee, ArrowRight, AlertCircle, Star, MapPin
} from "lucide-react";

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="glass rounded-3xl p-6 flex items-center gap-5 hover:scale-[1.02] transition-all duration-300 border border-white/50 shadow-sm">
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
  SCHEDULED: "bg-blue-100 text-blue-700 border border-blue-200",
  COMPLETED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  CANCELLED: "bg-slate-100 text-slate-700 border border-slate-200",
};

const Dashboard = () => {
  const { user } = useAuth();
  const [openRequests, setOpenRequests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          api.get("/provider/requests"),
          api.get("/provider/bookings"),
          api.get("/provider/profile"),
        ]);

        if (results[0].status === 'fulfilled') {
          const sorted = results[0].value.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setOpenRequests(sorted);
        }

        if (results[1].status === 'fulfilled') {
          const sorted = results[1].value.data.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
          setBookings(sorted);
        }

        if (results[2].status === 'fulfilled') {
          setProfile(results[2].value.data);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalEarnings = bookings
    .filter((b) => b.status === "COMPLETED")
    .reduce((sum, b) => sum + (b.bid?.price || 0), 0);

  const stats = [
    {
      label: "Open Requests",
      value: openRequests.length,
      icon: ClipboardList,
    },
    {
      label: "Active Bookings",
      value: bookings.filter((b) => b.status === "SCHEDULED").length,
      icon: BookOpen,
    },
    {
      label: "Completed Jobs",
      value: bookings.filter((b) => b.status === "COMPLETED").length,
      icon: CheckCircle,
    },
    {
      label: "Total Earnings",
      value: `₹${totalEarnings.toLocaleString()}`,
      icon: IndianRupee,
    },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-[3px] border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Provider Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium">{user?.email}</p>
        </div>
        {profile && (
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl px-5 py-3 shadow-sm">
            <div className="bg-orange-100 p-2 rounded-xl">
              <Star size={18} className="text-orange-500 fill-orange-500" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">
                {profile.avgRating?.toFixed(1) || "New"}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Rating</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Open Requests */}
      <div className="glass rounded-[2rem] overflow-hidden border border-white/50 shadow-sm">
        <div className="flex items-center justify-between p-8 border-b border-slate-100/50 bg-white/30">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Open Requests Near You</h2>
          <Link to="/provider/requests"
            className="text-sm font-bold text-purple-600 hover:text-orange-600 transition-colors flex items-center gap-1.5 group">
            View all <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {openRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="bg-slate-50 p-6 rounded-3xl mb-4">
              <AlertCircle size={48} className="text-slate-300" />
            </div>
            <p className="font-semibold text-slate-500">No open requests in your area</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100/50">
            {openRequests.slice(0, 5).map((req) => (
              <div key={req.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-white/40 transition-all duration-300 gap-4 group">
                <div className="space-y-1">
                  <p className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors capitalize">
                    {req.user?.name} requested {req.serviceType.replace("_", " ")}
                  </p>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {req.city}</span>
                    <span>•</span>
                    <span>{new Date(req.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {req.description && (
                    <p className="text-sm text-slate-600 mt-2 font-medium line-clamp-1 max-w-xl">
                      {req.description}
                    </p>
                  )}
                </div>
                <Link to="/provider/requests"
                  className="btn-primary py-2 px-6 text-xs whitespace-nowrap shadow-purple-200/50">
                  Place Bid
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Bookings */}
      <div className="glass rounded-[2rem] overflow-hidden border border-white/50 shadow-sm">
        <div className="flex items-center justify-between p-8 border-b border-slate-100/50 bg-white/30">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Bookings</h2>
          <Link to="/provider/bookings"
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
              <div key={b.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-white/40 transition-all duration-300 gap-4">
                <div className="space-y-1">
                  <p className="text-lg font-bold text-slate-900 capitalize">
                    {b.user?.name}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-300">•</span>
                    <p className="text-sm font-black text-slate-900">₹{b.bid?.price?.toLocaleString()}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-sm ${statusColors[b.status]}`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;