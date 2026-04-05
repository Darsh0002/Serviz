import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Mail, Lock, Wrench, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../APIs/axios";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      console.log("Login response:", data); // Debug log
      if (!data.jwt) {
        throw new Error("No token received from server");
      }
      login(data.jwt);
      toast.success("Welcome back!");

      // Redirect based on role decoded in AuthContext
      const decoded = JSON.parse(atob(data.jwt.split(".")[1]));
      navigate(decoded.role === "USER" ? "/user/dashboard" : "/provider/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      console.error("Response status:", err.response?.status);
      console.error("Response data:", err.response?.data);
      toast.error(err.response?.data?.message || err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden relative">
      {/* Decorative background blobs for mobile */}
      <div className="lg:hidden absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="lg:hidden absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-orange-500 via-purple-500 to-blue-600 flex-col justify-between p-16 relative overflow-hidden">
        {/* Decorative elements in left panel */}
        <div className="absolute top-0 right-0 p-20 opacity-10">
          <Wrench className="w-96 h-96 text-white rotate-12" />
        </div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl border border-white/30 shadow-lg">
            <Wrench className="text-white" size={28} />
          </div>
          <span className="text-white text-3xl font-black tracking-tight">Serviz</span>
        </div>

        <div className="relative z-10">
          <h1 className="text-6xl font-black text-white leading-tight mb-6 tracking-tighter">
            Services,<br />on demand.
          </h1>
          <p className="text-white/80 text-xl font-medium max-w-md leading-relaxed">
            Connect with skilled professionals in your city — fast, reliable, transparent. Join 50k+ happy users.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4">
          {["Electrician", "Plumber", "Carpenter", "Painter"].map((s) => (
            <div key={s} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-white text-sm font-bold shadow-sm hover:bg-white/20 transition-all cursor-default">
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="bg-linear-to-br from-orange-500 via-purple-500 to-blue-600 p-2 rounded-xl shadow-lg">
              <Wrench className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">Serviz</span>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 font-medium">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Email address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  required
                  className="input pl-12 shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-end ml-1">
                <label className="text-sm font-bold text-slate-700">
                  Password
                </label>
                <Link to="#" className="text-xs font-bold text-purple-600 hover:text-orange-600 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="input pl-12 pr-12 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base shadow-purple-200"
            >
              {loading ? (
                <div className="w-6 h-6 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign in <ArrowRight size={20} className="ml-1" /></>
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 mt-10 text-sm font-medium">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-600 font-black hover:text-orange-600 transition-colors underline decoration-2 underline-offset-4">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;