import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../APIs/axios";
import toast from "react-hot-toast";
import { MapPin, Building, FileText, Wrench, ArrowRight, ArrowLeft } from "lucide-react";

const SERVICE_TYPES = [
  "ELECTRICIAN", "PLUMBER", "CARPENTER",
  "PAINTER", "CLEANER", "AC_TECHNICIAN"
];

const CreateRequest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    serviceType: "ELECTRICIAN",
    address: "",
    city: "",
    description: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/user/request", form);
      toast.success("Service request created!");
      navigate("/user/requests");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-purple-600 mb-6 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Dashboard
        </button>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">New Service Request</h1>
        <p className="text-slate-500 font-medium mt-2">
          Describe what you need — providers in your city will place bids
        </p>
      </div>

      <div className="glass rounded-4xl border border-white/50 p-8 sm:p-12 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Service Type */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Service type
            </label>
            <div className="relative group">
              <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
              <select
                name="serviceType"
                value={form.serviceType}
                onChange={handleChange}
                className="input pl-12 pr-10 shadow-sm appearance-none cursor-pointer"
              >
                {SERVICE_TYPES.map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ArrowRight size={16} className="rotate-90" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Describe the problem
            </label>
            <div className="relative group">
              <FileText className="absolute left-4 top-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="E.g. Ceiling fan stopped working, needs inspection and repair..."
                required
                className="input pl-12 shadow-sm min-h-[120px]"
              />
            </div>
          </div>

          {/* Address + City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Address</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street / Area"
                  required
                  className="input pl-12 shadow-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">City</label>
              <div className="relative group">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Surat"
                  required
                  className="input pl-12 shadow-sm"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-base shadow-purple-200 mt-4"
          >
            {loading ? (
              <div className="w-6 h-6 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Submit Request <ArrowRight size={20} className="ml-1" /></>
            )}
          </button>
        </form>
      </div>
    </div>

  );
};

export default CreateRequest;