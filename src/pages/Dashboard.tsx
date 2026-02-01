import React from 'react';
import { useWaterData } from '../hooks/useWaterData';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import { Header } from '../components/Header';
import { MetricCardsSection } from '../components/MetricCardsSection';
import { WaterLevelChart } from '../components/WaterLevelChart';
import { SensorGrid } from '../components/SensorGrid';
import { HistoricalChart } from '../components/HistoricalChart';
import { Loader2Icon } from 'lucide-react';
export function Dashboard() {
  const {
    metrics,
    sensors,
    realtimeData,
    historicalData,
    refreshData
  } = useWaterData();
  const {
    containerRef,
    isRefreshing,
    pullDistance,
    threshold
  } = usePullToRefresh(refreshData);
  return <div ref={containerRef} className="h-screen overflow-y-auto bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative pb-20">
      {/* Pull to refresh indicator */}
      <div className="absolute left-0 right-0 flex justify-center pointer-events-none z-20 transition-transform duration-200" style={{
      top: -40,
      transform: `translateY(${pullDistance > 0 ? pullDistance : isRefreshing ? threshold : 0}px)`
    }}>
        <div className="bg-slate-800/90 backdrop-blur-md rounded-full p-2 shadow-lg shadow-indigo-500/30 border border-indigo-500/20">
          <Loader2Icon className={`w-5 h-5 text-indigo-400 ${isRefreshing ? 'animate-spin' : ''}`} style={{
          transform: `rotate(${pullDistance * 2}deg)`
        }} />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pb-8 min-h-screen">
        <Header />

        <main className="space-y-6 mt-2">
          <section className="animate-fade-in-up" style={{
          animationDelay: '0.1s'
        }}>
            <MetricCardsSection metrics={metrics} />
          </section>

          <section className="animate-fade-in-up" style={{
          animationDelay: '0.2s'
        }}>
            <WaterLevelChart data={realtimeData} />
          </section>

          <section className="animate-fade-in-up" style={{
          animationDelay: '0.3s'
        }}>
            <div className="flex justify-between items-end mb-3 px-1">
              <h2 className="text-lg font-bold text-white">Sensor Status</h2>
              <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                View All
              </button>
            </div>
            <SensorGrid sensors={sensors} />
          </section>

          <section className="animate-fade-in-up" style={{
          animationDelay: '0.4s'
        }}>
            <HistoricalChart data={historicalData} />
          </section>
        </main>

        <footer className="mt-12 text-center text-xs text-slate-500 pb-4 animate-fade-in-up" style={{
        animationDelay: '0.5s'
      }}>
          <p>Last updated: {new Date().toLocaleTimeString()}</p>
          <p className="mt-1">System v2.4.0 • Connected</p>
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
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>;
}