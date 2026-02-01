import React, { useEffect, useState } from "react";
import axios from "axios";
import { Check, X } from "lucide-react";
import toast from "react-hot-toast";

const RequestCard = ({ request, refresh }) => {
  const [bids, setBids] = useState([]);
  const [loadingBids, setLoadingBids] = useState(false);

  const fetchBids = async () => {
    try {
      setLoadingBids(true);

      const res = await axios.get(
        `/api/user/requests/${request.id}/bids`,
        { withCredentials: true }
      );

      setBids(res.data);
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
        `/api/user/bids/${bidId}/accept`,
        {},
        { withCredentials: true }
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
        { withCredentials: true }
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
              className="flex items-center justify-between border rounded-lg p-3"
            >
              <div>
                <p className="font-medium">{bid.providerName}</p>
                <p className="text-sm text-gray-500">
                  ₹{bid.amount} • {bid.message}
                </p>
              </div>

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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;