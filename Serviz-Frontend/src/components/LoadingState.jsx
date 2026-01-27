import React from 'react';
import { Wrench, MapPin, Home, PenTool, Loader2 } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      {/* Container for the Animated Logo */}
      <div className="relative w-48 h-48 flex items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 via-purple-500 to-blue-600 shadow-2xl overflow-hidden">
        
        {/* Animated Background Shimmer */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

        {/* The "S" Path Approximation & Icons */}
        <div className="relative w-full h-full p-6 flex flex-col items-center justify-between">
          
          {/* Top Icon: Wrench (Maintenance) */}
          <div className="self-end animate-bounce delay-75">
            <Wrench className="text-white w-10 h-10 rotate-45" />
          </div>

          {/* Middle Icons: Location & Home */}
          <div className="flex justify-around w-full items-center">
             <div className="animate-pulse delay-150">
              <Home className="text-white w-12 h-12" />
            </div>
            <div className="animate-bounce delay-300">
              <MapPin className="text-white/90 fill-white/20 w-8 h-8" />
            </div>
          </div>

          {/* Bottom Icon: Pen (Planning) */}
          <div className="self-start animate-pulse delay-500">
            <PenTool className="text-white w-10 h-10 -rotate-12" />
          </div>

        </div>
      </div>

      {/* Loading Text */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-slate-600 font-medium tracking-widest uppercase text-sm">
            Loading...
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-linear-to-r from-orange-400 to-blue-500 animate-[loading_3s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Tailwind Custom Keyframes (Add these to tailwind.config.js or a <style> tag) */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes loading {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 50%; margin-left: 25%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingState;