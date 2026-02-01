import React from 'react';
import { DropletsIcon, BellIcon, MenuIcon } from 'lucide-react';
export function Header() {
  return <header className="flex justify-between items-center py-4 sticky top-0 bg-gradient-to-b from-slate-900 to-transparent backdrop-blur-sm z-10 animate-fade-in-down">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-600/30 animate-pulse-slow">
          <DropletsIcon className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">
            AquaMonitor
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Station #402 • Online
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 rounded-full transition-all duration-300 relative active:scale-95">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
        </button>
        <button className="p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 rounded-full transition-all duration-300 active:scale-95">
          <MenuIcon className="w-5 h-5" />
        </button>
      </div>

      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out;
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </header>;
}