import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";

const BidModal = ({ request, onClose, onSuccess }) => {
  const { baseURL } = useContext(AppContext);

  const [form, setForm] = useState({
    price: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  if (!request) return null;

  const submitBid = async () => {
    if (loading) return;

    const price = Number(form.price);

    if (!price || price <= 0) {
      toast.error("Enter a valid bid price");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${baseURL}/api/provider/bid`,
        {
          requestId: request.id,
          price,
          message: form.message,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Bid submitted successfully");
      onClose();
      onSuccess();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to submit bid"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-1">Place a Bid</h2>
        <p className="text-sm text-gray-500 mb-4">
          {request.serviceType} • {request.city}
        </p>

        <input
          type="number"
          min="1"
          placeholder="Price"
          className="w-full border rounded-lg p-2 mb-3"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <textarea
          placeholder="Message (optional)"
          className="w-full border rounded-lg p-2 mb-4"
          rows={3}
          value={form.message}
          onChange={(e) =>
            setForm({ ...form, message: e.target.value })
          }
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={submitBid}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Bid"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BidModal;
