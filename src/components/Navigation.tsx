import React from 'react';
import { HomeIcon, LayoutDashboardIcon, MessageSquareIcon, SettingsIcon } from 'lucide-react';

type PageType = 'home' | 'dashboard' | 'chat' | 'settings';

type NavigationProps = {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
};

export function Navigation({
  currentPage,
  onNavigate
}: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-indigo-500/20 px-6 py-2 z-50 safe-area-bottom shadow-[0_-4px_12px_-2px_rgba(99,102,241,0.15)]">
      <div className="max-w-md mx-auto flex justify-around items-end">
        {/* Home Button */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 active:scale-95 relative ${currentPage === 'home' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-400'}`}
          aria-label="Home"
        >
          {currentPage === 'home' && (
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-400 rounded-full animate-slide-in"></span>
          )}
          <HomeIcon
            className={`w-6 h-6 transition-all duration-300 ${currentPage === 'home' ? 'fill-current/20 stroke-[2.5px] scale-110' : 'stroke-2'}`}
          />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        {/* Chat Button */}
        <button
          onClick={() => onNavigate('chat')}
          className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 active:scale-95 relative ${currentPage === 'chat' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-400'}`}
          aria-label="Chat"
        >
          {currentPage === 'chat' && (
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-400 rounded-full animate-slide-in"></span>
          )}
          <div className={`relative transition-transform duration-300 ${currentPage === 'chat' ? 'scale-110' : ''}`}>
            <MessageSquareIcon
              className={`w-6 h-6 transition-all duration-300 ${currentPage === 'chat' ? 'fill-current/20 stroke-[2.5px]' : 'stroke-2'}`}
            />
            {currentPage !== 'chat' && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
            )}
          </div>
          <span className="text-[10px] font-medium">Chat</span>
        </button>

        {/* Dashboard Button */}
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 active:scale-95 relative ${currentPage === 'dashboard' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-400'}`}
          aria-label="Dashboard"
        >
          {currentPage === 'dashboard' && (
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-400 rounded-full animate-slide-in"></span>
          )}
          <LayoutDashboardIcon
            className={`w-6 h-6 transition-all duration-300 ${currentPage === 'dashboard' ? 'fill-current/20 stroke-[2.5px] scale-110' : 'stroke-2'}`}
          />
          <span className="text-[10px] font-medium">Dashboard</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => onNavigate('settings')}
          className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 active:scale-95 relative ${currentPage === 'settings' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-400'}`}
          aria-label="Settings"
        >
          {currentPage === 'settings' && (
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-400 rounded-full animate-slide-in"></span>
          )}
          <div className="relative">
            <SettingsIcon
              className={`w-6 h-6 transition-all duration-300 ${currentPage === 'settings' ? 'fill-current/20 stroke-[2.5px] scale-110' : 'stroke-2'}`}
            />
            {/* Optional: Show indicator if settings were recently changed */}
            {localStorage.getItem('waterDetectorSettings') && currentPage !== 'settings' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
            )}
          </div>
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 2rem;
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </nav>
  );
}