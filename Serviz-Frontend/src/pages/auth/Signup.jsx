import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Mail, Lock, User, Phone, MapPin, Building, Wrench, Eye, EyeOff, ArrowRight } from "lucide-react";
import api from "../../APIs/axios";

const SERVICE_TYPES = ["ELECTRICIAN", "PLUMBER", "CARPENTER", "PAINTER", "CLEANER", "AC_TECHNICIAN"];

const InputField = ({ icon: Icon, label, name, type = "text", value, onChange, placeholder, required = true, children }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>
    <div className="relative group">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
      {children || (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="input pl-12 shadow-sm"
        />
      )}
    </div>
  </div>
);

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "",
    address: "", city: "", serviceType: "ELECTRICIAN",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = role === "USER" ? "/auth/signup/user" : "/auth/signup/provider";
      await api.post(endpoint, form);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-lg glass rounded-[2.5rem] border border-white/50 shadow-2xl p-10 relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-linear-to-br from-orange-500 via-purple-500 to-blue-600 p-2 rounded-xl shadow-lg">
            <Wrench className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">Serviz</span>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Create account</h2>
          <p className="text-slate-500 font-medium">Join thousands using Serviz across India</p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-slate-100/50 backdrop-blur-sm rounded-2xl p-1.5 mb-8 border border-slate-200/50">
          {["USER", "PROVIDER"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                role === r
                  ? "bg-white text-purple-700 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              }`}
            >
              {r === "USER" ? "I need a service" : "I provide services"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField icon={User} label="Full name" name="name" value={form.name}
            onChange={handleChange} placeholder="John Doe" />

          <InputField icon={Mail} label="Email address" name="email" type="email"
            value={form.email} onChange={handleChange} placeholder="you@example.com" />

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                required
                className="input pl-12 pr-12 shadow-sm"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <InputField icon={Phone} label="Phone number" name="phone" type="tel"
            value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />

          <div className="grid grid-cols-2 gap-4">
            <InputField icon={MapPin} label="Address" name="address"
              value={form.address} onChange={handleChange} placeholder="Street" />
            <InputField icon={Building} label="City" name="city"
              value={form.city} onChange={handleChange} placeholder="City" />
          </div>

          {/* Service Type — only for providers */}
          {role === "PROVIDER" && (
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
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ArrowRight size={16} className="text-slate-400 rotate-90" />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-base shadow-purple-200 mt-4"
          >
            {loading ? (
              <div className="w-6 h-6 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Create account <ArrowRight size={20} className="ml-1" /></>
            )}
          </button>
        </form>

        <p className="text-center text-slate-500 mt-8 text-sm font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-black hover:text-orange-600 transition-colors underline decoration-2 underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;