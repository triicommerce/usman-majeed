
import React from 'react';

interface CardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg h-full flex flex-col">
      <div className="flex items-center p-4 border-b border-slate-700">
        <span className="text-cyan-400 mr-3">{icon}</span>
        <h3 className="font-semibold text-slate-200 text-lg">{title}</h3>
      </div>
      <div className="p-4 flex-grow">
        {children}
      </div>
    </div>
  );
};
