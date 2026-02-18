
import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  sub: string;
  color: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, sub, color }) => (
  <div 
    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 transition-all hover:scale-105 hover:bg-slate-800"
    style={{ borderTop: `4px solid ${color}` }}
  >
    <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</div>
    <div className="text-3xl font-bold tracking-tight mb-1" style={{ color }}>{value}</div>
    <div className="text-slate-500 text-xs">{sub}</div>
  </div>
);
