import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import ProviderProfileModal from "../components/ProviderProfileModal";

/* ---------------- STATUS BADGE ---------------- */
const StatusBadge = ({ status }) => {
  const styles = {
    OPEN: "bg-yellow-100 text-yellow-700",
    ASSIGNED: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${styles[status]}`}>
      {status}
    </span>
  );
};

/* ---------------- DASHBOARD ---------------- */
const UserDashboard = () => {
  const { baseURL } = useContext(AppContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -------- FETCH OPEN REQUESTS -------- */
  const fetchOpenRequests = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${baseURL}/api/user/open-req`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setRequests(res.data);
    } catch (err) {
      toast.error("Failed to load open requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenRequests();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Open Requests</h1>

      {requests.length === 0 && (
        <p className="text-gray-500">No open requests</p>
      )}

      {requests.map((req) => (
        <RequestCard key={req.id} request={req} refresh={fetchOpenRequests} />
      ))}
    </div>
  );
};

const RequestCard = ({ request, refresh }) => {
  const { baseURL } = useContext(AppContext);
  const [bids, setBids] = useState([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const fetchBids = async () => {
    try {
      setLoadingBids(true);

      const res = await axios.get(
        `${baseURL}/api/user/requests/${request.id}/bids`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = res.data;
      const bidsArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.bids)
          ? data.bids
          : [];

      setBids(bidsArray);
    } catch (err) {
      toast.error("Failed to load bids");
    } finally {
      setLoadingBids(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, [request.id]);

  /* -------- ACCEPT / REJECT -------- */
  const handleAccept = async (bidId) => {
    try {
      await axios.post(
        `${baseURL}/api/user/requests/${request.id}/select-bid/${bidId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success("Bid accepted");
      refresh();
    } catch {
      toast.error("Failed to accept bid");
    }
  };

  const handleReject = async (bidId) => {
    try {
      await axios.post(
        `/api/user/bids/${bidId}/reject`,
        {},
        { withCredentials: true },
      );

      toast.success("Bid rejected");
      fetchBids();
    } catch {
      toast.error("Failed to reject bid");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 space-y-4">
      {/* REQUEST INFO */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">{request.serviceType}</h3>
          <p className="text-sm text-gray-500">
            {request.address}, {request.city}
          </p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {/* BIDS */}
      <div>
        <h4 className="font-medium mb-2">Bids</h4>

        {loadingBids && <p>Loading bids...</p>}

        {bids.length === 0 && (
          <p className="text-sm text-gray-500">No bids yet</p>
        )}

        <div className="space-y-3">
          {bids.map((bid) => (
            <div
              key={bid.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between border rounded-lg p-3 gap-3"
            >
              {/* LEFT */}
              <div className="space-y-1">
                <p className="font-medium">
                  Provider Name:
                  <button
                    onClick={() => setSelectedProvider(bid.providerId)}
                    className="ml-1 text-blue-600 hover:underline font-normal"
                  >
                    {bid.providerName}
                  </button>
                </p>

                <p className="text-sm text-gray-600">₹{bid.price}</p>

                <p className="text-sm text-gray-500">{bid.message}</p>

                <p className="text-xs text-gray-400">
                  {new Date(bid.createdAt).toLocaleString()}
                </p>
              </div>

              {/* RIGHT */}
              {bid.status === "PENDING" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(bid.id)}
                    className="btn-primary"
                  >
                    <Check size={16} /> Accept
                  </button>

                  <button
                    onClick={() => handleReject(bid.id)}
                    className="btn-danger"
                  >
                    <X size={16} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <ProviderProfileModal
        providerId={selectedProvider}
        open={Boolean(selectedProvider)}
        onClose={() => setSelectedProvider(null)}
      />
    </div>
  );
};

export default UserDashboard;
