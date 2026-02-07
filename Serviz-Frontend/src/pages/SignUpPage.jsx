import React, { useState, useContext } from "react";
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Building2,
  Wrench,
  ArrowLeft,
  Eye,
  EyeOff,
  Briefcase,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const { baseURL } = useContext(AppContext);
  const navigate = useNavigate();

  const [role, setRole] = useState("USER"); // Default role
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    password: "",
    serviceType: "", // Only for Providers
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare payload based on requirements
    const payload = { ...formData, role };
    if (role === "USER") delete payload.serviceType;

    try {
      if (role === "USER")
        await axios.post(`${baseURL}/api/auth/signup/user`, payload);
      else if (role === "PROVIDER")
        await axios.post(`${baseURL}/api/auth/signup/provider`, payload);

      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-3xl opacity-50" />
      </div>

      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm"
      >
        <ArrowLeft size={18} /> Back to Home
      </button>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="flex justify-center mb-4">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
            <Wrench className="text-white w-6 h-6" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900">
          Create your account
        </h2>

        {/* Role Selector Tabs */}
        <div className="mt-6 flex p-1 bg-slate-100 rounded-xl max-w-xs mx-auto">
          <button
            onClick={() => setRole("USER")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
              role === "USER"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <User size={16} /> User
          </button>
          <button
            onClick={() => setRole("PROVIDER")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
              role === "PROVIDER"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Briefcase size={16} /> Provider
          </button>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-10 px-6 shadow-xl border border-slate-100 sm:rounded-3xl sm:px-12">
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            onSubmit={handleSignup}
          >
            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/30"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  // type="email"
                  required
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/30"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  required
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/30"
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>

            {/* City Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                City
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  id="city"
                  required
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/30 appearance-none"
                >
                  <option value="">Select City</option>
                  <option>Delhi</option>
                  <option>Mumbai</option>
                  <option>Bengaluru</option>
                  <option>Kolkata</option>
                  <option>Chennai</option>
                  <option>Hyderabad</option>
                  <option>Pune</option>
                  <option>Ahmedabad</option>
                  <option>Surat</option>
                  <option>Jaipur</option>
                  <option>Vadodara</option>
                </select>
              </div>
            </div>

            {/* Service Type (Conditional) */}
            {role === "PROVIDER" && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Service Type
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Wrench className="h-5 w-5 text-slate-400" />
                  </div>
                  <select
                    id="serviceType"
                    required
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/30 appearance-none"
                  >
                    <option value="">Select Service</option>
                    <option>Plumber</option>
                    <option>Electrician</option>
                    <option>Carpenter</option>
                    <option>Technician</option>
                    <option>Painter</option>
                    <option>Cleaner</option>
                    <option>Lock smith</option>
                    <option>Appliance repair technician</option>
                  </select>
                </div>
              </div>
            )}

            {/* Address */}
            <div
              className={role === "USER" ? "md:col-span-1" : "md:col-span-2"}
            >
              <label className="block text-sm font-semibold text-slate-700">
                Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="address"
                  type="text"
                  required
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/30"
                  placeholder="123 Street Name"
                />
              </div>
            </div>

            {/* Password */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  onChange={handleChange}
                  className="block w-full pl-11 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/30"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="md:col-span-2 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading
                  ? "Creating Account..."
                  : `Sign Up as ${role === "USER" ? "User" : "Provider"}`}
              </button>
            </div>
          </form>
        </div>
      </div>
      <p className="mt-8 text-center text-sm text-slate-600 font-medium">
        Already a Member?{" "}
        <Link
          to="/login"
          className="text-indigo-600 hover:text-indigo-500 font-bold transition-colors"
        >
          Login Here
        </Link>
      </p>
    </div>
  );
}
