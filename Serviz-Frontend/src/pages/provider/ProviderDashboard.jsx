import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import BidModal from "../../components/provider/BidModal";

const ProviderDashboard = () => {
  const { baseURL } = useContext(AppContext);

  const [openRequests, setOpenRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchOpenRequests = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${baseURL}/api/provider/requests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setOpenRequests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenRequests();
  }, []);

  const openBidModal = (req) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 via-purple-400 to-blue-500 text-white rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-orange-100">
            You have{" "}
            <span className="font-semibold">{openRequests.length}</span>{" "}
            open request{openRequests.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Requests */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Open Requests
        </h2>

        {openRequests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-xl text-gray-600">No open requests</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {req.serviceType}
                  </h3>

                  <p className="text-sm text-gray-500 mb-2">
                    {req.city} • {req.address}
                  </p>

                  <p className="text-gray-700 mb-3 line-clamp-3">
                    {req.description}
                  </p>

                  <div className="text-sm text-gray-600">
                    Requested by{" "}
                    <span className="font-medium text-gray-800">
                      {req.userName}
                    </span>
                  </div>

                  <div className="text-xs text-gray-400 mt-1">
                    Posted on{" "}
                    {new Date(req.createdAt).toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => openBidModal(req)}
                  className="mt-5 w-full py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                  Place Bid
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bid Modal */}
      {isModalOpen && (
        <BidModal
          request={selectedRequest}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchOpenRequests}
        />
      )}
    </div>
  );
};

export default ProviderDashboard;
