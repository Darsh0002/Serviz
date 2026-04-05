import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../APIs/axios";
import toast from "react-hot-toast";
import { Plus, ChevronRight, AlertCircle, X , MapPin   } from "lucide-react";

const statusColors = {
  OPEN: "bg-blue-100 text-blue-700 border border-blue-200",
  ASSIGNED: "bg-purple-100 text-purple-700 border border-purple-200",
  COMPLETED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  CANCELLED: "bg-slate-100 text-slate-700 border border-slate-200",
};

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get("/user/all-requests");
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRequests(sorted);
    } catch {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleCancel = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[200px]">
        <p className="text-sm font-black text-slate-900 leading-tight">Cancel this request?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              setCancelling(id);
              try {
                await api.put(`/user/request/${id}/cancel`);
                toast.success("Request cancelled");
                fetchRequests();
              } catch (err) {
                toast.error(err.response?.data?.message || "Failed to cancel");
              } finally {
                setCancelling(null);
              }
            }}
            className="flex-1 px-3 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all shadow-md shadow-red-200"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 px-3 py-2 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all"
          >
            No
          </button>
        </div>
      </div>
    ), { duration: 6000 });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-[3px] border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Requests</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage and track your service requests</p>
        </div>
        <Link to="/user/requests/new"
          className="btn-primary py-3 px-6 shadow-purple-200/50">
          <Plus size={18} className="mr-1.5" /> New Request
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="glass rounded-[2.5rem] border border-white/50 flex flex-col items-center justify-center py-24 text-slate-400 shadow-sm">
          <div className="bg-slate-50 p-6 rounded-3xl mb-4">
            <AlertCircle size={48} className="text-slate-300" />
          </div>
          <p className="font-bold text-slate-500">No requests found yet</p>
          <Link to="/user/requests/new" className="mt-4 text-sm font-black text-purple-600 hover:text-orange-600 transition-colors uppercase tracking-widest">
            Create your first request
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id}
              className="glass rounded-[2rem] border border-white/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-white/40 transition-all duration-300 shadow-sm group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight capitalize group-hover:text-purple-700 transition-colors">
                    {(req.serviceType || "Service").replace("_", " ")}
                  </h3>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm ${statusColors[req.status]}`}>
                    {req.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600 font-medium line-clamp-1 max-w-2xl mb-2">{req.description}</p>
                <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><MapPin size={12} /> {req.city}</span>
                  <span className="text-slate-200">|</span>
                  <span>Created on - {new Date(req.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-6 sm:mt-0 ml-0 sm:ml-8 shrink-0">
                {req.status === "OPEN" && (
                  <>
                    <Link to={`/user/requests/${req.id}/bids`}
                      className="text-sm font-black text-purple-600 hover:text-orange-600 transition-colors flex items-center gap-1.5 group/btn">
                      View Bids <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                    <div className="w-[1px] h-6 bg-slate-200/50" />
                    <button
                      onClick={() => handleCancel(req.id)}
                      disabled={cancelling === req.id}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300">
                      <X size={20} />
                    </button>
                  </>
                )}
                {req.status === "ASSIGNED" && (
                  <button
                    onClick={() => handleCancel(req.id)}
                    disabled={cancelling === req.id}
                    className="text-xs font-black text-red-500 hover:text-red-700 uppercase tracking-widest bg-red-50 px-4 py-2 rounded-xl transition-colors">
                    Cancel Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequests;