import { useEffect, useState } from "react";
import api from "../../APIs/axios";
import toast from "react-hot-toast";
import { BookOpen, IndianRupee, Clock, Star, Filter, User , MapPin } from "lucide-react";

const statusColors = {
  SCHEDULED: "bg-blue-100 text-blue-700 border border-blue-200",
  COMPLETED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  CANCELLED: "bg-slate-100 text-slate-700 border border-slate-200",
};

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    api
      .get("/provider/bookings")
      .then(({ data }) => {
        const sorted = data.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
        setBookings(sorted);
      })
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-[3px] border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const totalEarnings = bookings
    .filter((b) => b.status === "COMPLETED")
    .reduce((sum, b) => sum + (b.bid?.price || 0), 0);

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Active Bookings</h1>
          <p className="text-slate-500 mt-1 font-medium">History of your service deliveries</p>
        </div>

        {/* Filter Overlay-like UI */}
        <div className="flex flex-wrap bg-slate-100/50 backdrop-blur-sm rounded-2xl p-1 border border-slate-200/50 shadow-sm w-fit">
          {["ALL", "SCHEDULED", "COMPLETED", "CANCELLED"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all ${
                filter === s
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Earnings summary */}
      {totalEarnings > 0 && (
        <div className="glass rounded-4xl border-2 border-emerald-500/20 bg-emerald-50/30 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-50/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
          <div className="relative">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-1">
              Revenue Breakdown
            </p>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">Total Earnings</h2>
          </div>
          <div className="flex items-center gap-3 bg-white/60 px-8 py-5 rounded-[2rem] border border-white/80 shadow-sm relative group/btn">
            <div className="p-2.5 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/30 group-hover/btn:scale-110 transition-transform">
              <IndianRupee size={24} className="text-white" />
            </div>
            <span className="text-4xl font-black text-slate-900 tracking-tighter">
              {totalEarnings.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="glass rounded-[2.5rem] border border-white/50 flex flex-col items-center justify-center py-24 text-slate-400 shadow-sm">
          <div className="bg-slate-50 p-6 rounded-3xl mb-4">
            <BookOpen size={48} className="text-slate-300" />
          </div>
          <p className="font-bold text-slate-500">No bookings found for this filter</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="glass rounded-4xl border border-white/50 p-8 hover:bg-white/40 transition-all duration-300 shadow-sm group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-5">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-purple-700 transition-colors uppercase">
                      {(b.serviceType || b.request?.serviceType || "Service").replace("_", " ")}
                    </h3>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm ${statusColors[b.status]}`}
                    >
                      {b.status}
                    </span>
                  </div>

                  {/* User info */}
                  <div className="flex items-center gap-4 p-4 bg-white/30 rounded-2xl border border-white/40 mb-6 w-fit h-20">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-200">
                      {b.user?.name?.[0]}
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-900 leading-tight">
                        {b.user?.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin size={14} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-500 truncate max-w-[150px]">
                          {b.user?.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 flex-wrap">
                    <div className="flex items-center gap-2 text-slate-900">
                      <div className="p-1.5 bg-emerald-100 rounded-lg">
                        <IndianRupee size={16} className="text-emerald-600" />
                      </div>
                      <span className="text-lg font-black">{b.bid?.price?.toLocaleString()}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                      Booked on -  {new Date(b.bookedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {b.status === "COMPLETED" && b.completedAt && (
                    <div className="mt-6 flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50 w-fit px-4 py-1.5 rounded-full border border-emerald-100">
                      Done on {new Date(b.completedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>

                {/* Earnings card-like badge */}
                {b.status === "COMPLETED" && (
                  <div className="glass-dark border-emerald-500/20 bg-emerald-900 p-6 rounded-3xl flex flex-col items-center justify-center min-w-[160px] shadow-lg shadow-emerald-900/10">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-2">Net Income</p>
                    <div className="flex items-center gap-1 text-white">
                      <IndianRupee size={16} className="text-emerald-400" />
                      <span className="text-2xl font-black">{b.bid?.price?.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderBookings;
