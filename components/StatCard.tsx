import React from 'react';
import { StatCardProps } from '../types';

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconColor, onClick, isActive }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white dark:bg-zinc-900 p-3 md:p-4 rounded-xl border shadow-lg shadow-zinc-900/10 dark:shadow-black/20 transition-all duration-300 
        ${onClick ? 'cursor-pointer hover:-translate-y-1 active:scale-[0.98]' : ''}
        ${isActive 
          ? 'border-primary-500 ring-1 ring-primary-500/50 bg-white/80 dark:bg-zinc-900/80' 
          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'}
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs md:text-sm font-bold mb-1 uppercase tracking-wider transition-colors ${isActive ? 'text-primary-500 dark:text-primary-400' : 'text-zinc-600 dark:text-zinc-500'}`}>
            {title}
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{value}</h3>
        </div>
        <div className={`p-2 md:p-3 rounded-xl border backdrop-blur-sm transition-colors ${isActive ? 'bg-zinc-100 dark:bg-zinc-950 border-primary-500/30' : iconColor}`}>
          <div className="scale-75 md:scale-90">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};