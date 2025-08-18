
import React from 'react';
import type { MarketplaceProduct } from '../types';
import { Card } from './shared/Card';
import { Loader } from './shared/Loader';
import { GlobeIcon } from './icons/GlobeIcon';

interface MarketplaceResultsProps {
  results?: MarketplaceProduct[];
  isLoading: boolean;
}

const getFavicon = (source: string) => {
    try {
        const url = new URL(source.startsWith('http') ? source : `https://www.${source.toLowerCase().split(' ')[0]}.com`);
        return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`;
    } catch (e) {
        return '';
    }
}

export const MarketplaceResults: React.FC<MarketplaceResultsProps> = ({ results, isLoading }) => {
  const content = () => {
    if (isLoading) {
      return <Loader message="Scanning marketplaces..." />;
    }
    if (!results || results.length === 0) {
      return <p className="text-slate-400 text-center py-4">No marketplace results found.</p>;
    }
    return (
      <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {results.map((product, index) => (
          <li key={index} className="bg-slate-800/50 p-3 rounded-lg flex items-start space-x-3 transition-colors hover:bg-slate-700/50">
            <img src={getFavicon(product.source)} alt={`${product.source} favicon`} className="w-5 h-5 mt-1 flex-shrink-0" />
            <div className="flex-grow">
                <a href={product.url} target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-cyan-400 transition line-clamp-2">
                    {product.title}
                </a>
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {product.source}
                </span>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card title="Marketplace Scan" icon={<GlobeIcon />}>
      {content()}
    </Card>
  );
};
