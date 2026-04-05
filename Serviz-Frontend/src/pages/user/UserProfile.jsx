import { useEffect, useState } from "react";
import api from "../../APIs/axios";
import toast from "react-hot-toast";
import {
  User, Mail, Phone, MapPin,
  Building, Shield, Loader
} from "lucide-react";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-6 py-6 border-b border-white/40 last:border-0 group/row">
    <div className="p-3 bg-white/50 rounded-2xl group-hover/row:bg-blue-500 group-hover/row:text-white transition-all duration-300 shadow-sm border border-white/60">
      <Icon size={20} className="group-hover/row:scale-110 transition-transform" />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</p>
      <p className="text-base text-slate-900 font-black tracking-tight">{value || "—"}</p>
    </div>
  </div>
);

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/user/profile")
      .then(({ data }) => setProfile(data))
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-10 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Personal Hub</h1>
        <div className="p-1 px-4 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-200">
          User Account
        </div>
      </div>

      {/* Profile card */}
      <div className="glass rounded-4xl border border-white/60 overflow-hidden shadow-2xl relative group">
        <div className="bg-linear-to-br from-blue-500 to-indigo-700 px-10 pt-12 pb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700" />
          <div className="flex flex-col sm:flex-row items-center gap-8 relative">
            <div className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-5xl font-black shadow-2xl border border-white/30 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              {profile.name?.[0]?.toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-4xl font-black text-white tracking-tight mb-2">{profile.name}</h2>
              <div className="flex items-center justify-center sm:justify-start gap-4">
                <span className="text-blue-100/80 font-bold flex items-center gap-2">
                  <Mail size={16} /> {profile.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Role badge */}
        <div className="px-10 -mt-8 relative">
          <span className="glass-dark border-blue-500/20 bg-slate-900 shadow-xl text-blue-400 text-[10px] font-black tracking-widest uppercase px-5 py-2.5 rounded-2xl flex items-center w-fit gap-2">
            <Shield size={14} />
            {profile.role}
          </span>
        </div>

        {/* Info Grid */}
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-x-12">
          <InfoRow icon={Mail} label="Email Address" value={profile.email} />
          <InfoRow icon={Phone} label="Phone Number" value={profile.phone} />
          <InfoRow icon={MapPin} label="Home Address" value={profile.address} />
          <InfoRow icon={Building} label="Current City" value={profile.city} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;