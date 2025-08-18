
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <SparklesIcon className="w-8 h-8 text-cyan-400 mr-3" />
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          Product Scout <span className="text-cyan-400">AI</span>
        </h1>
      </div>
    </header>
  );
};
