import React from "react";
import {
  Wrench,
  Sparkles,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (user != null) {
      const role = user.role;

      if (role === "USER") navigate("/user/dashboard");
      else if (role === "PROVIDER") navigate("/provider/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-orange-300 selection:text-orange-900">
      {/* Navbar - Added Glassmorphism and Sticky */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-linear-to-br from-orange-500 via-purple-500 to-blue-600 p-1.5 rounded-lg">
              <Wrench className="text-white w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Serviz
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-orange-600 transition-colors">
              Find Services
            </a>
            <a href="#" className="hover:text-orange-600 transition-colors">
              Become a Provider
            </a>
          </div>
          <div className="space-x-3 flex items-center">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2.5 bg-linear-to-r from-orange-500 to-blue-600 text-white text-sm font-semibold rounded-full hover:shadow-lg shadow-orange-300 transition-all active:scale-95"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Improved Typography and Spacing */}
      <section className="relative overflow-hidden max-w-7xl mx-auto px-6 py-20 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Decorative background blob */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-linear-to-br from-orange-400 via-purple-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r from-orange-50 to-blue-50 border border-orange-200 text-orange-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3 h-3" />
            Top Rated Professionals
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
            Home services, <br />
            <span className="bg-linear-to-r from-orange-500 via-purple-500 to-blue-600 bg-clip-text text-transparent">reimagined.</span>
          </h2>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-lg">
            Book verified experts for repairs, cleaning, and maintenance.
            Transparent pricing and guaranteed quality, delivered to your
            doorstep.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button className="group px-8 py-4 bg-linear-to-r from-orange-500 via-purple-500 to-blue-600 text-white font-bold rounded-2xl hover:shadow-xl shadow-orange-300 transition-all flex items-center justify-center gap-2">
              Book a Service
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:border-orange-200 hover:bg-orange-50/50 transition-all shadow-sm">
              Explore All
            </button>
          </div>

          <div className="mt-10 flex items-center gap-6 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 10k+
              Verified Pros
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Insurance
              Covered
            </div>
          </div>
        </div>

        <div className="relative flex justify-center group">
          <div className="absolute inset-0 bg-linear-to-br from-orange-300 via-purple-300 to-blue-300 rounded-full filter blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <img
            src="https://illustrations.popsy.co/indigo/worker.svg"
            alt="services"
            className="relative w-full max-w-md transform transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </section>

      {/* Features - Modernized Cards */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-100">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h3 className="text-3xl font-bold text-slate-900">
            Why thousands trust Serviz
          </h3>
          <p className="mt-4 text-slate-500">
            We've built the most reliable ecosystem for local professionals and
            homeowners.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <Feature
            icon={<ShieldCheck />}
            title="Verified Providers"
            desc="Rigorous background checks for every pro."
          />
          <Feature
            icon={<MapPin />}
            title="Local Experts"
            desc="Find the best talent right in your neighborhood."
          />
          <Feature
            icon={<Sparkles />}
            title="Guaranteed Quality"
            desc="If you're not happy, we'll make it right."
          />
          <Feature
            icon={<Wrench />}
            title="24/7 Support"
            desc="We're here to help you, anytime, anywhere."
          />
        </div>
      </section>

      {/* CTA Section - Gradient and Radius */}
      <section className="px-6 mb-20">
        <div className="max-w-6xl mx-auto bg-linear-to-br from-orange-500 via-purple-500 to-blue-600 rounded-[2.5rem] overflow-hidden relative">
          <div className="absolute top-0 right-0 p-20 opacity-10">
            <Wrench className="w-64 h-64 text-white rotate-12" />
          </div>
          <div className="relative px-8 py-16 md:py-24 text-center max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Ready to cross those tasks <br className="hidden md:block" /> off
              your to-do list?
            </h3>
            <p className="mt-6 text-white/90 text-lg opacity-90">
              Join 50,000+ happy customers who simplify their lives with Serviz.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-lg">
                Get Started Now
              </button>
              <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/20 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-slate-200 p-1 rounded">
              <Wrench className="text-slate-600 w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900">Serviz</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Serviz Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-orange-600">
              Privacy
            </a>
            <a href="#" className="hover:text-orange-600">
              Terms
            </a>
            <a href="#" className="hover:text-orange-600">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="group p-8 bg-white rounded-3xl border border-slate-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100 transition-all duration-300">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-orange-50 to-blue-50 text-orange-600 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-blue-600 group-hover:text-white transition-all duration-300">
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <h4 className="font-bold text-xl text-slate-900 tracking-tight">
        {title}
      </h4>
      <p className="mt-3 text-slate-500 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}
