import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../APIs/axios";
import toast from "react-hot-toast";
import {
  BookOpen,
  IndianRupee,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Filter,
  CreditCard,
} from "lucide-react";

const statusColors = {
  SCHEDULED: "bg-blue-100 text-blue-700 border border-blue-200",
  COMPLETED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  CANCELLED: "bg-slate-100 text-slate-700 border border-slate-200",
};

const RatingModal = ({ booking, onClose, onSubmit }) => {
  const [score, setScore] = useState(5);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ bookingId: booking.id, score, review });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="glass rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl border border-white/50">
        <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
          Rate experience
        </h3>
        <p className="text-slate-500 font-medium mb-8">
          How was {booking.provider.name}'s service?
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Star rating */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScore(s)}
                  className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    size={40}
                    className={
                      s <= score
                        ? "text-orange-500 fill-orange-500"
                        : "text-slate-200"
                    }
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
              {score === 5 ? "Excellent!" : score === 4 ? "Very Good" : score === 3 ? "Good" : score === 2 ? "Fair" : "Poor"}
            </p>
          </div>

          {/* Review */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Your feedback <span className="text-slate-400 font-medium">(optional)</span>
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              placeholder="Tell others what you liked..."
              className="input p-5 shadow-sm min-h-[120px]"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl border border-slate-200 text-sm font-black text-slate-500 hover:bg-slate-50 transition-colors uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 py-4 text-sm uppercase tracking-widest"
            >
              {loading ? "Sending..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [ratingModal, setRatingModal] = useState(null);
  const [completing, setCompleting] = useState(null);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/user/bookings");
      const sorted = data.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
      setBookings(sorted);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleRatingSubmit = async (ratingData) => {
    try {
      await api.post("/user/rating", ratingData);
      toast.success("Review submitted!");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  };

  const filtered =
    filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-[3px] border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="space-y-10">
      {ratingModal && (
        <RatingModal
          booking={ratingModal}
          onClose={() => setRatingModal(null)}
          onSubmit={handleRatingSubmit}
        />
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Bookings</h1>
          <p className="text-slate-500 mt-1 font-medium">History of your service bookings</p>
        </div>
        
        {/* Filter Overlay-like UI */}
        <div className="flex flex-wrap bg-slate-100/50 backdrop-blur-sm rounded-2xl p-1 border border-slate-200/50 shadow-sm">
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

      {filtered.length === 0 ? (
        <div className="glass rounded-[2.5rem] border border-white/50 flex flex-col items-center justify-center py-24 text-slate-400 shadow-sm">
          <div className="bg-slate-50 p-6 rounded-3xl mb-4">
            <BookOpen size={48} className="text-slate-300" />
          </div>
          <p className="font-bold text-slate-500">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="glass rounded-4xl border border-white/50 p-6 hover:bg-white/40 transition-all duration-300 shadow-sm group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-3 flex-wrap mb-4">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-purple-700 transition-colors uppercase">
                      {(b.serviceType || b.request?.serviceType || "Service").replace("_", " ")}
                    </h3>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm ${statusColors[b.status]}`}
                    >
                      {b.status}
                    </span>
                  </div>

                  {/* Provider */}
                  <div className="flex items-center gap-4 p-4 bg-white/30 rounded-2xl border border-white/40 mb-4 w-fit">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-orange-200">
                      {b.provider.name[0]}
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-900 leading-tight">
                        {b.provider.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Star
                          size={14}
                          className="text-orange-500 fill-orange-500"
                        />
                        <span className="text-xs font-bold text-slate-500">
                          {b.provider.avgRating?.toFixed(1) || "New Provider"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-2 text-slate-900">
                      <div className="p-1.5 bg-emerald-100 rounded-lg">
                        <IndianRupee size={16} className="text-emerald-600" />
                      </div>
                      <span className="text-lg font-black">{b.bid.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <Clock size={16} className="text-blue-600" />
                      </div>
                      <span className="text-sm font-bold">{b.bid.estimatedTimeInHours}h estimated</span>
                    </div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                      Booked on - {new Date(b.bookedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                  {b.status === "SCHEDULED" && (
                    <button
                      onClick={() => navigate(`/user/bookings/${b.id}/payment`)}
                      className="btn-primary py-3 px-8 text-xs uppercase tracking-widest shadow-purple-200/50"
                    >
                      <CreditCard size={18} className="mr-2" /> Pay & Complete
                    </button>
                  )}
                  {b.status === "COMPLETED" && (
                    <button
                      onClick={() => setRatingModal(b)}
                      className="flex items-center justify-center gap-2 text-xs font-black text-orange-600 bg-orange-50 hover:bg-orange-100 px-8 py-3 rounded-2xl transition-all duration-300 uppercase tracking-widest border border-orange-100"
                    >
                      <Star size={18} /> Rate Experience
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings;
