import { useEffect, useState } from "react";
import api from "../../APIs/axios";
import toast from "react-hot-toast";
import {
  Mail, Phone, MapPin, Building,
  Shield, Wrench, Star, Loader
} from "lucide-react";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-6 py-6 border-b border-white/40 last:border-0 group/row">
    <div className="p-3 bg-white/50 rounded-2xl group-hover/row:bg-purple-500 group-hover/row:text-white transition-all duration-300 shadow-sm border border-white/60">
      <Icon size={20} className="group-hover/row:scale-110 transition-transform" />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</p>
      <p className="text-base text-slate-900 font-black tracking-tight">{value || "—"}</p>
    </div>
  </div>
);

const ProviderProfile = () => {
  const [profile, setProfile] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/provider/profile");
        setProfile(data);
        const ratingsRes = await api.get("/provider/ratings");
        setRatings(ratingsRes.data);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-[3px] border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-10 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Provider Hub</h1>
        <div className="p-1 px-4 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200">
          Verified Account
        </div>
      </div>

      {/* Profile card */}
      <div className="glass rounded-4xl border border-white/60 overflow-hidden shadow-2xl relative group">
        <div className="bg-linear-to-br from-emerald-500 to-teal-700 px-10 pt-12 pb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700" />
          <div className="flex flex-col sm:flex-row items-center gap-8 relative">
            <div className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-5xl font-black shadow-2xl border border-white/30 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              {profile.name?.[0]?.toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-4xl font-black text-white tracking-tight mb-2">{profile.name}</h2>
              <div className="flex items-center justify-center sm:justify-start gap-4">
                <span className="text-emerald-100/80 font-bold flex items-center gap-2">
                  <Mail size={16} /> {profile.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Overlay */}
        <div className="px-10 -mt-8 flex gap-3 flex-wrap relative">
          <span className="glass-dark border-emerald-500/20 bg-emerald-900 shadow-xl text-emerald-400 text-[10px] font-black tracking-widest uppercase px-5 py-2.5 rounded-2xl">
            <Shield size={14} className="mr-2 inline" /> {profile.role}
          </span>
          <span className="glass border-white/60 bg-white/90 shadow-xl text-purple-700 text-[10px] font-black tracking-widest uppercase px-5 py-2.5 rounded-2xl">
            <Wrench size={14} className="mr-2 inline" /> {profile.serviceType?.replace("_", " ")}
          </span>
          <div className="glass border-orange-500/20 bg-white/90 shadow-xl px-5 py-2.5 rounded-2xl flex items-center gap-2">
            <Star size={14} className="fill-orange-500 text-orange-500" />
            <span className="text-slate-900 font-black text-xs leading-none">
              {profile.avgRating?.toFixed(1) || "N/A"}
            </span>
          </div>
        </div>

        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-x-12">
          <InfoRow icon={Mail} label="Contact Email" value={profile.email} />
          <InfoRow icon={Phone} label="Business Phone" value={profile.phone} />
          <InfoRow icon={MapPin} label="Service Address" value={profile.address} />
          <InfoRow icon={Building} label="Operating City" value={profile.city} />
        </div>
      </div>

      {/* Reviews */}
      <div className="glass rounded-4xl border border-white/60 shadow-xl">
        <div className="p-10 border-b border-white/40 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Public Experience</h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">
              Feedback from {ratings.length || 0} customer{ratings.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="bg-orange-50 p-3 rounded-2xl border border-orange-100">
            <Star size={24} className="text-orange-500 fill-orange-500" />
          </div>
        </div>
        
        {ratings.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No reviews yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/40">
            {ratings.map((r) => (
              <div key={r.id} className="p-10 hover:bg-white/20 transition-colors duration-300 group/review">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-black border border-slate-200 group-hover/review:bg-purple-100 group-hover/review:text-purple-600 group-hover/review:border-purple-200 transition-colors">
                      {r.user?.name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 leading-none">{r.user?.name || "Verified Customer"}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 bg-white/40 px-3 py-1.5 rounded-xl border border-white/60">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14}
                        className={s <= r.score
                          ? "text-orange-500 fill-orange-500"
                          : "text-slate-200"} />
                    ))}
                  </div>
                </div>
                {r.review && (
                  <div className="relative">
                    <div className="absolute -left-4 top-0 text-4xl text-slate-200 font-serif leading-none opacity-50">"</div>
                    <p className="text-lg text-slate-700 font-medium leading-relaxed italic pr-6 pl-2">
                      {r.review}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderProfile;