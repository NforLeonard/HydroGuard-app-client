import React, { useEffect, useState, useRef, useCallback } from 'react';
import { SendIcon, BotIcon, UserIcon, SparklesIcon, BarChart3Icon, RefreshCwIcon, AlertTriangleIcon, Shield, Droplets, Activity, CloudRain } from 'lucide-react';
import { sendMessage, analyzeWaterData, type ChatMessage as APIChatMessage } from '../services/chatService';
import { useWaterData, type Metric, type Sensor } from '../hooks/useWaterData';

type UIMessage = {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
};

export function ChatbotPage() {
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<UIMessage[]>([
        {
            id: '1',
            text: "🌊 Welcome to HydroGuard AI! I'm here to help you monitor water levels, assess flood risks, and analyze sensor data. How can I assist you today?",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);

    const { metrics, sensors } = useWaterData();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const chatContext = useRef<APIChatMessage[]>([
        {
            role: 'system',
            content: "I are HydroGuard AI, a water monitoring assistant. I help users with water level data, flood predictions, and sensor information. Keep responses concise and helpful."
        }
    ]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const handleSend = useCallback(async () => {
        if (!input.trim()) return;

        const userMsg: UIMessage = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        chatContext.current.push({ role: 'user', content: input });
        setInput('');
        setIsTyping(true);

        try {
            const aiResponse = await sendMessage(input, chatContext.current);

            const aiMsg: UIMessage = {
                id: (Date.now() + 1).toString(),
                text: aiResponse,
                sender: 'ai',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);
            chatContext.current.push({ role: 'assistant', content: aiResponse });

            if (chatContext.current.length > 20) {
                chatContext.current = [chatContext.current[0], ...chatContext.current.slice(-19)];
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMsg: UIMessage = {
                id: (Date.now() + 1).toString(),
                text: "⚠️ I'm having temporary connection issues. Please try again in a moment.",
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    }, [input]);

    const handleAnalyzeData = useCallback(async () => {
        if (isTyping) return;

        setIsTyping(true);
        try {
            const analysis = await analyzeWaterData(metrics, sensors);
            const analysisMsg: UIMessage = {
                id: Date.now().toString(),
                text: analysis,
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, analysisMsg]);
        } catch (error) {
            console.error('Analysis error:', error);
            const errorMsg: UIMessage = {
                id: Date.now().toString(),
                text: "❌ Couldn't analyze data at the moment. Please try again.",
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    }, [metrics, sensors, isTyping]);

    const handleSuggestionClick = useCallback((text: string) => {
        setInput(text);
        inputRef.current?.focus();
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }, [handleSend]);

    const clearChat = useCallback(() => {
        setMessages([{
            id: '1',
            text: "🌊 Welcome to HydroGuard AI! I'm here to help you monitor water levels, assess flood risks, and analyze sensor data. How can I assist you today?",
            sender: 'ai',
            timestamp: new Date()
        }]);
        chatContext.current = [chatContext.current[0]];
    }, []);

    const activeSensors = sensors.filter(s => s.status === 'active').length;
    const totalSensors = sensors.length;
    const avgWaterLevel = metrics.length > 0
        ? (metrics.reduce((sum, m) => sum + (m.value || 0), 0) / metrics.length).toFixed(1)
        : '0.0';

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-slate-800/80 backdrop-blur-md border-b border-indigo-500/20 px-6 py-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl blur-lg opacity-50 animate-pulse-slow"></div>
                            <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 p-3 rounded-xl shadow-lg shadow-indigo-500/30">
                                <BotIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">HydroBot AI Assistant</h1>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <p className="text-sm text-slate-400">Monitoring {activeSensors}/{totalSensors} sensors</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={clearChat}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-indigo-500/20 rounded-xl text-slate-300 hover:bg-slate-700/60 hover:border-indigo-500/40 transition-all duration-300 active:scale-95"
                        >
                            <RefreshCwIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Clear</span>
                        </button>
                        <button
                            onClick={handleAnalyzeData}
                            disabled={isTyping}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-95 shadow-lg shadow-indigo-500/30"
                        >
                            <BarChart3Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">Analyze</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 py-6 gap-6">
                {/* Main Chat Area */}
                <main className="flex-1 flex flex-col">
                    {/* Chat Container */}
                    <div className="flex-1 flex flex-col rounded-2xl overflow-hidden bg-slate-800/40 backdrop-blur-sm border border-indigo-500/20 shadow-xl">
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col justify-center items-center text-center px-6 py-12">
                                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-violet-600/20 rounded-2xl flex items-center justify-center mb-6 animate-float">
                                        <SparklesIcon className="w-10 h-10 text-indigo-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white mb-3">
                                        How can I help today?
                                    </h2>
                                    <p className="text-sm text-slate-400 mb-8 max-w-md">
                                        Ask me about water levels, sensor status, flood predictions, or emergency procedures.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex gap-3 animate-slide-up ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                                        >
                                            {message.sender === 'ai' && (
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                                    <BotIcon className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                            <div className={`flex flex-col max-w-[80%] ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-lg ${message.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/30' : 'bg-slate-800/80 backdrop-blur-sm text-slate-200 border border-indigo-500/20 rounded-tl-none'}`}>
                                                    {message.text}
                                                </div>
                                                <span className="text-[10px] text-slate-500 mt-1 px-1">
                                                    {message.timestamp.toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            {message.sender === 'user' && (
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center">
                                                    <UserIcon className="w-4 h-4 text-slate-300" />
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {isTyping && (
                                        <div className="flex gap-3 animate-slide-up">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                                <BotIcon className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="bg-slate-800/80 backdrop-blur-sm border border-indigo-500/20 px-4 py-3 rounded-2xl rounded-tl-none shadow-lg flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggestions */}
                        <div className="border-t border-indigo-500/20 p-4 bg-slate-800/60">
                            <div className="flex items-center gap-2 mb-3 px-2">
                                <SparklesIcon className="w-4 h-4 text-indigo-400" />
                                <span className="text-sm font-medium text-slate-300">Quick suggestions:</span>
                            </div>
                            <div className="flex flex-wrap gap-2 px-2">
                                {[
                                    { icon: '🌊', text: 'Current water levels?' },
                                    { icon: '⚠️', text: 'Flood risk assessment' },
                                    { icon: '📡', text: 'Sensor network status' },
                                    { icon: '🚨', text: 'Emergency procedures' },
                                    { icon: '🚨', text: 'Generate report' }
                                ].map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion.text)}
                                        className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-slate-800/80 text-slate-300 rounded-xl hover:bg-slate-700/80 transition-all duration-300 border border-indigo-500/20 active:scale-95"
                                    >
                                        <span>{suggestion.icon}</span>
                                        <span>{suggestion.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-indigo-500/20 p-4">
                            <div className="relative">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your message about water monitoring..."
                                    className="w-full bg-slate-800/80 border border-indigo-500/20 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-white placeholder:text-slate-500 text-sm"
                                    rows={2}
                                    disabled={isTyping}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isTyping}
                                    className="absolute right-2 bottom-2 p-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-95 shadow-lg shadow-indigo-500/30"
                                >
                                    <SendIcon className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="text-xs text-slate-500 mt-2 px-1">
                                Press Enter to send • Shift+Enter for new line
                            </div>
                        </div>
                    </div>
                </main>

                {/* Sidebar */}
                <aside className="w-80 space-y-6 hidden lg:block">
                    {/* System Status Card */}
                    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-indigo-500/20 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-white text-sm">System Status</h2>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${activeSensors === totalSensors ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                {activeSensors === totalSensors ? 'Optimal' : 'Attention'}
                            </div>
                        </div>

                        {/* Sensor Health */}
                        <div className="mb-6">
                            <div className="flex justify-between text-sm text-slate-400 mb-1">
                                <span>Sensor Health</span>
                                <span className="font-medium text-white">{activeSensors}/{totalSensors}</span>
                            </div>
                            <div className="w-full bg-slate-700/50 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-300 ${activeSensors === totalSensors ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-yellow-500 to-orange-500'}`}
                                    style={{ width: `${(activeSensors / totalSensors) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-xl p-3 border border-indigo-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Droplets className="w-4 h-4 text-indigo-400" />
                                    <div className="text-xs text-indigo-300">Water Level</div>
                                </div>
                                <div className="text-xl font-bold text-white">
                                    {avgWaterLevel}m
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-violet-500/20 to-violet-600/20 rounded-xl p-3 border border-violet-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity className="w-4 h-4 text-violet-400" />
                                    <div className="text-xs text-violet-300">Last Update</div>
                                </div>
                                <div className="text-sm font-medium text-white">
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Sensors */}
                    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-indigo-500/20 shadow-xl">
                        <h2 className="font-semibold text-white text-sm mb-4">Active Sensors</h2>
                        <div className="space-y-3">
                            {sensors.slice(0, 3).map((sensor) => (
                                <div key={sensor.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${sensor.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                        <div>
                                            <div className="font-medium text-sm text-white">
                                                {sensor.name || `Sensor ${sensor.id}`}
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                {sensor.location || 'Unknown location'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs font-medium ${sensor.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {sensor.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 shadow-xl shadow-indigo-500/30">
                        <h2 className="font-semibold text-white text-sm mb-4">Quick Stats</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs opacity-90 text-indigo-200">Messages</div>
                                <div className="text-xl font-bold text-white">{messages.length}</div>
                            </div>
                            <div>
                                <div className="text-xs opacity-90 text-indigo-200">Uptime</div>
                                <div className="text-xl font-bold text-white">99.8%</div>
                            </div>
                            <div>
                                <div className="text-xs opacity-90 text-indigo-200">Response</div>
                                <div className="text-xl font-bold text-white">1.2s</div>
                            </div>
                            <div>
                                <div className="text-xs opacity-90 text-indigo-200">Flood Risk</div>
                                <div className="text-xl font-bold text-white">Low</div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Footer */}
            <footer className="border-t border-indigo-500/20 px-6 py-4 bg-slate-800/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto text-center text-xs text-slate-500">
                    <p>HydroGuard AI Water Monitoring System • All data is simulated for demonstration purposes</p>
                </div>
            </footer>

            <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% {
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
        </div>
    );
}