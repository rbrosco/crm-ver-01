import React from 'react';
import { StatCardProps } from '../types';

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconColor, onClick, isActive }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-zinc-900 p-4 md:p-6 rounded-2xl border shadow-lg shadow-black/20 transition-all duration-300 
        ${onClick ? 'cursor-pointer hover:-translate-y-1 active:scale-[0.98]' : ''}
        ${isActive 
          ? 'border-primary-500 ring-1 ring-primary-500/50 bg-zinc-900/80' 
          : 'border-zinc-800 hover:border-zinc-700'}
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs md:text-base font-bold mb-1 md:mb-2 uppercase tracking-wider transition-colors ${isActive ? 'text-primary-400' : 'text-zinc-500'}`}>
            {title}
          </p>
          {/* Increased size from text-4xl to text-5xl for Desktop */}
          <h3 className="text-4xl md:text-5xl font-bold text-zinc-100 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 md:p-5 rounded-2xl border backdrop-blur-sm transition-colors ${isActive ? 'bg-zinc-950 border-primary-500/30' : iconColor}`}>
          <div className="scale-90 md:scale-110">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};