import { X } from "lucide-react";
import { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";

const initialForm = {
  serviceType: "",
  address: "",
  city: "",
  description: "",
};

const NewRequestModal = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
    const { baseURL } = useContext(AppContext);
  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { serviceType, address, city, description } = form;

    if (!serviceType || !address || !city || !description) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${baseURL}/api/user/create`,
        { serviceType, address, city, description },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success("Request created successfully");
      setForm(initialForm);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-request-title"
        className="relative bg-white w-full max-w-lg rounded-xl shadow-xl p-6 ring-1 ring-black/5"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 id="new-request-title" className="text-lg font-semibold flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 via-purple-400 to-blue-500 inline-block" />
            New Service Request
          </h2>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Type Select */}
          <label className="block text-sm font-medium text-gray-700">Service Type</label>
          <select
            name="serviceType"
            value={form.serviceType}
            onChange={handleChange}
            className="input"
          >
            <option value="" disabled>
              Select a service
            </option>
            <option>plumber</option>
            <option>electrician</option>
            <option>carpenter</option>
            <option>technician</option>
            <option>painter</option>
            <option>cleaner</option>
            <option>Lock smith</option>
            <option>appliance repair technician</option>
          </select>

          <input
            type="text"
            name="address"
            placeholder="Full Address"
            value={form.address}
            onChange={handleChange}
            className="input"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* City Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <select name="city" value={form.city} onChange={handleChange} className="input">
                <option value="" disabled>
                  Select a city
                </option>
                <option>New Delhi</option>
                <option>Mumbai</option>
                <option>Bengaluru</option>
                <option>Kolkata</option>
                <option>Chennai</option>
                <option>Hyderabad</option>
                <option>Pune</option>
                <option>Ahmedabad</option>
                <option>Surat</option>
                <option>Jaipur</option>
                <option>Lucknow</option>
                <option>Kanpur</option>
                <option>Nagpur</option>
                <option>Indore</option>
                <option>Bhopal</option>
                <option>Patna</option>
                <option>Vadodara</option>
                <option>Ludhiana</option>
                <option>Agra</option>
                <option>Nashik</option>
                <option>Varanasi</option>
                <option>Srinagar</option>
                <option>Thiruvananthapuram</option>
                <option>Kochi</option>
                <option>Coimbatore</option>
                <option>Madurai</option>
                <option>Ranchi</option>
                <option>Dehradun</option>
                <option>Guwahati</option>
                <option>Mangalore</option>
              </select>
            </div>

            </div>

          <textarea
            name="description"
            placeholder="Describe the issue"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="input resize-none"
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary px-4 py-2">
              Cancel
            </button>

            <button type="submit" disabled={loading} className="btn-primary px-4 py-2 disabled:opacity-60">
              {loading ? "Submitting..." : "Create Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRequestModal;
