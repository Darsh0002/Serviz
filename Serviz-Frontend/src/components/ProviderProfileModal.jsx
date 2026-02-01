import { X, Star } from "lucide-react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";

const ProviderProfileModal = ({ providerId, open, onClose }) => {
  const { baseURL } = useContext(AppContext);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !providerId) return;

    const fetchProvider = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${baseURL}/api/user/providers/${providerId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setProvider(res.data);
      } catch {
        toast.error("Failed to load provider profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [providerId, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white w-full max-w-md rounded-xl p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Provider Profile</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {provider && (
          <div className="space-y-3">
            {/* NAME */}
            <p className="text-lg font-medium">
              {provider.user.name}
            </p>

            {/* SERVICE */}
            <p className="text-sm text-gray-600">
              Service: {provider.serviceType}
            </p>

            {/* RATING */}
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={16} />
              <span className="text-sm text-gray-700">
                {provider.avgRating.toFixed(1)} / 5
              </span>
            </div>

            {/* LOCATION */}
            <p className="text-sm text-gray-600">
              City: {provider.user.city}
            </p>

            <p className="text-sm text-gray-600">
              Address: {provider.user.address}
            </p>

            {/* CONTACT */}
            <p className="text-sm text-gray-600">
              Phone: {provider.user.phone}
            </p>

            <p className="text-sm text-gray-600">
              Email: {provider.user.email}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderProfileModal;
