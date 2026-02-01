import React, { useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { HomePage } from './pages/HomePage';
import { ChatbotPage } from './pages/ChatbotPage';
import { Navigation } from './components/Navigation';

export function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard' | 'chat'>('home');
  return <div className="min-h-screen bg-[#f8fafc]">
    {currentPage === 'home' && <HomePage />}
    {currentPage === 'dashboard' && <Dashboard />}
    {currentPage === 'chat' && <ChatbotPage />}


    <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
  </div>;
}