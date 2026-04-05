import { useEffect, useState } from "react";
import api from "../../APIs/axios";
import toast from "react-hot-toast";
import {
  MapPin, Clock, FileText,
  IndianRupee, Send, AlertCircle, X
} from "lucide-react";

const BidModal = ({ request, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    requestId: request.id,
    price: "",
    estimatedTimeInHours: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="glass rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl border border-white/50">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Place Bid</h3>
          <button onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 rounded-xl transition-all duration-300">
            <X size={24} />
          </button>
        </div>

        {/* Request summary */}
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-5 mb-8 border border-white/60 shadow-sm">
          <p className="text-lg font-black text-slate-900 capitalize mb-1">
            {request.serviceType.replace("_", " ")}
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <MapPin size={12} /> {request.city}
          </div>
          {request.description && (
            <p className="text-sm text-slate-600 mt-3 font-medium line-clamp-2 leading-relaxed italic">
              "{request.description}"
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Price */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Your price (₹)
            </label>
            <div className="relative group">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="500"
                required
                min={1}
                className="input pl-12 shadow-sm font-black text-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Estimated time */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Time (hours)
              </label>
              <div className="relative group">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                <input
                  type="number"
                  name="estimatedTimeInHours"
                  value={form.estimatedTimeInHours}
                  onChange={handleChange}
                  placeholder="2"
                  required
                  min={1}
                  className="input pl-12 shadow-sm font-bold"
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Message <span className="text-slate-400 font-medium">(optional)</span>
            </label>
            <div className="relative group">
              <FileText className="absolute left-4 top-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={3}
                placeholder="Enter your message"
                className="input pl-12 shadow-sm text-sm font-medium resize-none"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-4 rounded-2xl border border-slate-200 text-sm font-black text-slate-500 hover:bg-slate-50 transition-colors uppercase tracking-widest">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="btn-primary flex-1 py-4 text-sm uppercase tracking-widest">
              {loading ? (
                <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Send size={18} className="mr-2" /> Send Bid</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const OpenRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidModal, setBidModal] = useState(null);

  useEffect(() => {
    api.get("/provider/requests")
      .then(({ data }) => {
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRequests(sorted);
      })
      .catch(() => toast.error("Failed to load requests"))
      .finally(() => setLoading(false));
  }, []);

  const handleBidSubmit = async (form) => {
    try {
      await api.post("/provider/bid", {
        ...form,
        price: Number(form.price),
        estimatedTimeInHours: Number(form.estimatedTimeInHours),
      });
      toast.success("Bid placed successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place bid");
      throw err;
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10">
      {bidModal && (
        <BidModal
          request={bidModal}
          onClose={() => setBidModal(null)}
          onSubmit={handleBidSubmit}
        />
      )}

      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Open Requests</h1>
        <p className="text-slate-500 mt-1 font-medium">
          Matching your service type in <span className="text-purple-600 font-bold">{requests[0]?.city || "your city"}</span>
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="glass rounded-[2.5rem] border border-white/50 flex flex-col items-center justify-center py-24 text-slate-400 shadow-sm">
          <div className="bg-slate-50 p-6 rounded-3xl mb-4">
            <AlertCircle size={48} className="text-slate-300" />
          </div>
          <p className="font-bold text-slate-500">No open requests in your area</p>
          <p className="text-sm mt-1 uppercase tracking-widest font-black text-slate-300">Check back later</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id}
              className="glass rounded-4xl border border-white/50 p-8 hover:bg-white/40 transition-all duration-300 shadow-sm group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-4">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-purple-700 transition-colors capitalize">
                      {req.serviceType.replace("_", " ")}
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
                      OPEN
                    </span>
                  </div>

                  {req.description && (
                    <p className="text-base text-slate-600 font-medium mb-6 leading-relaxed max-w-3xl">
                      {req.description}
                    </p>
                  )}

                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-2 text-slate-500 font-bold">
                      <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                        <MapPin size={16} />
                      </div>
                      <span className="text-sm">{req.address}, {req.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 font-bold">
                      <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                        <Clock size={16} />
                      </div>
                      <span className="text-xs uppercase tracking-widest">Requested on - {new Date(req.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setBidModal(req)}
                  className="btn-primary py-4 px-10 text-xs uppercase tracking-widest shadow-purple-200/50 shrink-0">
                  <Send size={18} className="mr-2" /> Place Bid
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OpenRequests;