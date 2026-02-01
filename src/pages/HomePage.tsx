import React, { useState } from 'react';
import { MessageSquareIcon, PhoneIcon, MailIcon, MapPinIcon, ShieldCheckIcon, ActivityIcon, BellIcon, SendIcon, BotIcon } from 'lucide-react';
export function HomePage() {
  const [chatMessage, setChatMessage] = useState('');
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pb-24">
    {/* Hero Section */}
    <div className="bg-gradient-to-b from-indigo-900/40 to-transparent pb-8 pt-4 px-4 rounded-b-[2rem] backdrop-blur-sm border-b border-indigo-800/30">
      <div className="max-w-md mx-auto flex flex-col items-center text-center animate-fade-in-up">
        <div className="w-48 h-48 mb-6 relative animate-float">
          <div className="absolute inset-0 bg-indigo-500/30 rounded-full animate-pulse-slow opacity-50 blur-2xl"></div>
          <div className="absolute inset-0 bg-violet-500/20 rounded-full animate-pulse-slower opacity-40 blur-3xl"></div>
          <img src="/IMG-20260113-WA0024.jpg" alt="HydroGuard AI Logo" className="w-full h-full object-cover rounded-full shadow-2xl shadow-indigo-500/50 relative z-10 border-4 border-indigo-500/30" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in-up" style={{
          animationDelay: '0.1s'
        }}>
          HydroGuard AI
        </h1>
        <p className="text-slate-300 text-sm max-w-[280px] leading-relaxed animate-fade-in-up" style={{
          animationDelay: '0.2s'
        }}>
          Advanced flood monitoring and early warning system powered by
          artificial intelligence.
        </p>
      </div>
    </div>

    <div className="max-w-md mx-auto px-4 mt-6 space-y-6">
      {/* About Section */}
      <section className="bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl border border-indigo-500/20 shadow-xl animate-fade-in-up" style={{
        animationDelay: '0.3s'
      }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
            <ShieldCheckIcon className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">About System</h2>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          HydroGuard provides real-time water level monitoring and predictive
          flood analysis to keep communities safe. Our AI-driven sensors
          detect rising water levels instantly and send alerts before disaster
          strikes.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[{
            icon: ActivityIcon,
            label: 'Real-time',
            delay: '0.4s'
          }, {
            icon: BellIcon,
            label: 'Alerts',
            delay: '0.5s'
          }, {
            icon: BotIcon,
            label: 'AI Analysis',
            delay: '0.6s'
          }].map((item, i) => <div key={i} className="bg-slate-900/50 p-3 rounded-xl flex flex-col items-center gap-2 text-center border border-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 animate-fade-in-up" style={{
            animationDelay: item.delay
          }}>
            <item.icon className="w-5 h-5 text-indigo-400" />
            <span className="text-[10px] font-medium text-slate-300">
              {item.label}
            </span>
          </div>)}
        </div>
      </section>

      {/* AI Chatbot Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-violet-700 p-5 rounded-2xl shadow-2xl shadow-indigo-500/30 text-white relative overflow-hidden animate-fade-in-up" style={{
        animationDelay: '0.7s'
      }}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-400/20 rounded-full blur-xl -ml-8 -mb-8 animate-pulse-slower"></div>

        <div className="flex items-center gap-2 mb-4 relative z-10">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
            <BotIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">HydroGuard Assistant</h2>
            <p className="text-xs text-indigo-100">
              Ask about water levels or safety
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 mb-3 border border-white/10">
          <p className="text-sm text-white/90">
            👋 Hi! I can help you check current flood risks or report an
            issue. How can I help today?
          </p>
        </div>

        <div className="relative">
          <input type="text" placeholder="Type your question..." value={chatMessage} onChange={e => setChatMessage(e.target.value)} className="w-full bg-white/90 text-slate-900 placeholder:text-slate-500 text-sm py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all" />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 hover:scale-105 transition-all active:scale-95">
            <SendIcon className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl border border-indigo-500/20 shadow-xl animate-fade-in-up" style={{
        animationDelay: '0.8s'
      }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
            <PhoneIcon className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">Contact Us</h2>
        </div>

        <div className="space-y-3">
          {[{
            icon: MailIcon,
            label: 'Email',
            value: 'support@hydroguard.ai'
          }, {
            icon: PhoneIcon,
            label: 'Emergency',
            value: '+237 671204674'
          }, {
            icon: MapPinIcon,
            label: 'HQ',
            value: 'Bamenda 1 Upstation Mezam Division'
          }].map((item, i) => <div key={i} className="flex items-center gap-3 p-3 hover:bg-slate-700/50 rounded-xl transition-all duration-300 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-slate-900/50 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all duration-300 border border-indigo-500/10">
              <item.icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                {item.label}
              </p>
              <p className="text-sm text-slate-200 font-medium">
                {item.value}
              </p>
            </div>
          </div>)}
        </div>
      </section>

      <footer className="text-center py-6 animate-fade-in-up" style={{
        animationDelay: '0.9s'
      }}>
        <p className="text-xs text-slate-500">
          © 2026 HydroGuard AI Systems
        </p>
      </footer>
    </div>

    <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes pulse-slower {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 4s ease-in-out infinite;
        }
      `}</style>
  </div>;
}