import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Check, X, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import ProviderProfileModal from "../../components/user/ProviderProfileModal";
import NewRequestModal from "../../components/user/NewRequestModal";

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
  const [OpenRequests, setOpenRequests] = useState([]);
  const [RecentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* -------- FETCH OPEN REQUESTS -------- */
  const fetchOpenRequests = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${baseURL}/api/user/open-req`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setOpenRequests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to load open requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${baseURL}/api/user/recent-bookings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setRecentBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to load open requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenRequests();
    fetchRecentBookings();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 pb-12">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-orange-400 via-purple-400 to-blue-500 text-white rounded-b-3xl shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-1">Welcome Back</h1>
              <p className="text-orange-100 text-lg">
                Manage your service requests
              </p>
              <p className="mt-3 text-orange-100/90">
                You have{" "}
                <span className="font-semibold">{OpenRequests.length}</span>{" "}
                open request{OpenRequests.length !== 1 ? "s" : ""}.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-10 space-y-8">
          {/* Create Request Card (short) */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 md:p-8 flex items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Need a Service?
              </h2>
              <p className="text-gray-600">
                Post a new request and connect with vetted service providers.
              </p>
            </div>

            <div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary px-5 py-3"
              >
                <Plus size={18} />
                Create Request
              </button>
            </div>
          </div>

          {/* Requests Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Open Requests
            </h2>

            {OpenRequests.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-xl text-gray-600 mb-4">No open requests</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {OpenRequests.map((req) => (
                  <RequestCard
                    key={req.id}
                    request={req}
                    refresh={fetchOpenRequests}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Recent Bookings
            </h2>

            {RecentBookings.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-xl text-gray-600">
                  No requests yet, create one to get started
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {RecentBookings.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between"
                  >
                    {/* Booking Info */}
                    <div>
                      <p className="text-sm text-gray-500">
                        Booked At: {new Date(req.bookedAt).toLocaleString()}
                      </p>

                      <p className="text-lg font-semibold text-gray-800 mt-2">
                        ₹ {req.price}
                      </p>

                      <span
                        className={`inline-block mt-3 px-3 py-1 text-sm rounded-full
                ${
                  req.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : req.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-5 flex gap-3">
                      {req.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleComplete(req.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                          >
                            Pay & Complete
                          </button>

                          <button
                            onClick={() => handleCancel(req.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {req.status === "COMPLETED" && (
                        <button
                          onClick={() => handleView(req.id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                        >
                          View / Rate
                        </button>
                      )}

                      {req.status === "CANCELLED" && (
                        <button
                          onClick={() => handleDelete(req.id)}
                          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <NewRequestModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchOpenRequests}
        />
      </div>
    </>
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
