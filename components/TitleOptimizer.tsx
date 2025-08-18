
import React from 'react';
import type { TitleSuggestion } from '../types';
import { Card } from './shared/Card';
import { Loader } from './shared/Loader';
import { SparklesIcon } from './icons/SparklesIcon';

interface TitleOptimizerProps {
  suggestions?: TitleSuggestion[];
  isLoading: boolean;
}

export const TitleOptimizer: React.FC<TitleOptimizerProps> = ({ suggestions, isLoading }) => {
  const content = () => {
    if (isLoading) {
      return <Loader message="Optimizing titles..." />;
    }
    if (!suggestions || suggestions.length === 0) {
      return <p className="text-slate-400 text-center py-4">No title suggestions available.</p>;
    }
    return (
      <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="bg-slate-800/50 p-4 rounded-lg">
            <p className="font-semibold text-cyan-300 mb-1">{suggestion.title}</p>
            <p className="text-sm text-slate-400">{suggestion.reasoning}</p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card title="AI Title Optimizer" icon={<SparklesIcon />}>
      {content()}
    </Card>
  );
};
