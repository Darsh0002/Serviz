import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../APIs/axios";
import toast from "react-hot-toast";
import { Star, Clock, ArrowLeft, CheckCircle, AlertCircle, IndianRupee, MessageCircle, ChevronRight } from "lucide-react";

const RequestBids = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bidsRes, reqRes] = await Promise.all([
          api.get(`/user/request/${requestId}/bids`),
          api.get("/user/all-requests"),
        ]);
        setBids(bidsRes.data);
        setRequest(reqRes.data.find((r) => r.id === Number(requestId)));
      } catch {
        toast.error("Failed to load bids");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [requestId]);

  const handleAccept = async (bidId, providerName) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[240px]">
        <div>
          <p className="text-sm font-black text-slate-900 leading-tight">Accept {providerName}'s bid?</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Other bids will be rejected</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              setAccepting(bidId);
              try {
                await api.post(`/user/requests/${requestId}/accept-bid/${bidId}`);
                toast.success("Successfully booked!");
                navigate("/user/bookings");
              } catch (err) {
                toast.error(err.response?.data?.message || "Failed to accept bid");
              } finally {
                setAccepting(null);
              }
            }}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
          >
            Accept
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 px-3 py-2 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 6000 });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-10 h-10 border-[3px] border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex flex-col gap-6">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-purple-600 transition-colors w-fit group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Bids Received</h1>
            {request && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                  {request.serviceType.replace("_", " ")}
                </span>
                <span className="text-slate-400 font-bold">•</span>
                <span className="text-sm font-bold text-slate-500">{request.city}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 bg-slate-100/50 px-5 py-2.5 rounded-2xl border border-slate-200/50">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Bids</span>
            <span className="text-lg font-black text-slate-900">{bids.length}</span>
          </div>
        </div>
      </div>

      {bids.length === 0 ? (
        <div className="glass rounded-[2.5rem] border border-white/50 flex flex-col items-center justify-center py-24 text-slate-400 shadow-sm">
          <div className="bg-slate-50 p-6 rounded-3xl mb-4">
            <AlertCircle size={48} className="text-slate-200" />
          </div>
          <p className="font-bold text-slate-500">No bids yet</p>
          <p className="text-xs mt-2 uppercase tracking-widest font-black text-slate-300">Providers in your city will bid soon</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bids.map((bid) => (
            <div key={bid.id}
              className={`glass rounded-4xl border p-8 hover:bg-white/40 transition-all duration-300 shadow-sm group ${
                bid.status === "ACCEPTED" ? "border-emerald-500/20 bg-emerald-50/20" : "border-white/50"
              }`}>
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                {/* Header Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-purple-200">
                      {bid.provider.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-purple-700 transition-colors tracking-tight capitalize">
                          {bid.provider.name}
                        </h3>
                        {bid.status === "ACCEPTED" && (
                          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                            <CheckCircle size={14} /> Accepted
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={12} className={star <= Math.round(bid.provider.avgRating || 0) ? "text-orange-500 fill-orange-500" : "text-slate-200"} />
                          ))}
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                          {bid.provider.avgRating?.toFixed(1) || "New"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  {bid.message && (
                    <div className="flex gap-3 p-5 bg-white/30 rounded-3xl border border-white/40 mb-6 relative">
                      <MessageCircle className="text-purple-400 shrink-0 mt-1" size={20} />
                      <p className="text-slate-600 font-medium leading-relaxed italic">
                        "{bid.message}"
                      </p>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="flex items-center gap-8 flex-wrap">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Fee</span>
                      <div className="flex items-center gap-1 text-slate-900">
                        <IndianRupee size={18} className="text-emerald-500" />
                        <span className="text-2xl font-black tracking-tight">{bid.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Time</span>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Clock size={18} className="text-purple-500" />
                        <span className="text-lg font-bold tracking-tight">{bid.estimatedTimeInHours} Hours</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status/ActionButton */}
                <div className="shrink-0 flex items-center lg:items-start">
                  {bid.status === "PENDING" && request?.status === "OPEN" ? (
                    <button
                      onClick={() => handleAccept(bid.id, bid.provider.name)}
                      disabled={accepting === bid.id}
                      className="btn-primary py-4 px-10 text-xs w-full lg:w-auto shadow-purple-200/50 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                      {accepting === bid.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <><CheckCircle size={18} /> Accept Bid</>
                      )}
                    </button>
                  ) : bid.status === "REJECTED" ? (
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 bg-slate-50 px-5 py-2 rounded-xl border border-slate-100">
                      Rejected
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestBids;