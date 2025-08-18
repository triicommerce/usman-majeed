
import React from 'react';
import { CompetitionInfo, CompetitionLevel } from '../types';
import { Card } from './shared/Card';
import { Loader } from './shared/Loader';
import { UsersIcon } from './icons/UsersIcon';
import { LinkIcon } from './icons/LinkIcon';

interface CompetitionAnalyzerProps {
  info?: CompetitionInfo;
  isLoading: boolean;
}

const levelColorClasses = {
  [CompetitionLevel.LOW]: 'bg-green-500/20 text-green-300 border-green-500/30',
  [CompetitionLevel.MEDIUM]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  [CompetitionLevel.HIGH]: 'bg-red-500/20 text-red-300 border-red-500/30',
  [CompetitionLevel.UNKNOWN]: 'bg-slate-600/20 text-slate-300 border-slate-600/30',
};

export const CompetitionAnalyzer: React.FC<CompetitionAnalyzerProps> = ({ info, isLoading }) => {
  const content = () => {
    if (isLoading) {
      return <Loader message="Analyzing competition..." />;
    }
    if (!info) {
      return <p className="text-slate-400 text-center py-4">No competition analysis available.</p>;
    }
    return (
      <div className="space-y-4">
        <div className="text-center">
          <span className={`px-4 py-1 text-sm font-bold rounded-full border ${levelColorClasses[info.level]}`}>
            {info.level} Competition
          </span>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed max-h-48 overflow-y-auto pr-2">{info.analysis}</p>
        {info.sources && info.sources.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Sources</h4>
            <ul className="space-y-1">
              {info.sources.map((source, index) => (
                <li key={index}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                    <LinkIcon className="w-3 h-3 mr-2 flex-shrink-0" />
                    <span className="truncate">{source.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card title="Competition Analysis" icon={<UsersIcon />}>
      {content()}
    </Card>
  );
};
