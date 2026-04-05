import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Wrench, LogOut, User, LayoutDashboard, ClipboardList, BookOpen, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

const userLinks = [
  { to: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/user/requests", label: "My Requests", icon: ClipboardList },
  { to: "/user/bookings", label: "Bookings", icon: BookOpen },
  { to: "/user/profile", label: "Profile", icon: User },
];

const providerLinks = [
  { to: "/provider/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/provider/requests", label: "Open Requests", icon: ClipboardList },
  { to: "/provider/bookings", label: "Bookings", icon: BookOpen },
  { to: "/provider/profile", label: "Profile", icon: User },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const links = user?.role === "USER" ? userLinks : providerLinks;

  const handleLogout = () => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[200px]">
        <p className="text-sm font-black text-slate-900 leading-tight">Are you sure you want to log out ?</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              logout();
              toast.success("Logged out successfully");
              navigate("/");
            }}
            className="flex-1 px-3 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all shadow-md shadow-red-200"
          >
            Logout
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 px-3 py-2 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: "top-center",
    });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user?.role === "USER" ? "/user/dashboard" : "/provider/dashboard"}
            className="flex items-center gap-2 group">
            <div className="bg-linear-to-br from-orange-500 via-purple-500 to-blue-600 p-1.5 rounded-lg group-hover:shadow-lg transition-all">
              <Wrench className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Serviz</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? "bg-linear-to-r from-orange-500/10 via-purple-500/10 to-blue-600/10 text-purple-700 border border-purple-200/50"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}>
                  <Icon size={18} className={active ? "text-purple-600" : ""} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-slate-900">{user?.email?.split('@')[0]}</span>
              <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                user?.role === "USER"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}>
                {user?.role}
              </span>
            </div>
            <button onClick={handleLogout}
              className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex gap-2 pb-3 overflow-x-auto no-scrollbar">
          {links.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  active
                    ? "bg-linear-to-r from-orange-500 via-purple-500 to-blue-600 text-white shadow-md shadow-purple-200"
                    : "bg-white border border-slate-100 text-slate-600 shadow-sm"
                }`}>
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;