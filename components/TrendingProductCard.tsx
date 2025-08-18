
import React from 'react';
import type { TrendingProduct } from '../types';

export const TrendingProductCard: React.FC<{ product: TrendingProduct }> = ({ product }) => {
    const { name, description, sourceMarketplace, imageUrl, ebayResaleAnalysis, trendScore } = product;

    const trendScoreClasses = {
        Hot: 'bg-red-500/20 text-red-300 border-red-500/30',
        High: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        Medium: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    };

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg flex flex-col h-full transition-shadow hover:shadow-cyan-500/20">
            <div className="relative">
                <img
                    src={imageUrl || 'https://via.placeholder.com/400x300'}
                    alt={name ?? 'Trending product'}
                    className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="absolute top-2 right-2">
                     <span className={`px-3 py-1 text-xs font-bold rounded-full border ${trendScoreClasses[trendScore]} backdrop-blur-sm`}>
                        {trendScore} Trend
                    </span>
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-slate-100 text-lg mb-2">{name ?? 'Unnamed Product'}</h3>
                <p className="text-sm text-slate-400 mb-4 flex-grow">{description ?? 'No description provided.'}</p>
                
                <div className="mt-auto space-y-3">
                    <div className="text-xs">
                        <span className="font-semibold text-slate-300">Source: </span>
                        <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{sourceMarketplace ?? 'Unknown'}</span>
                    </div>

                    <div className="bg-slate-900/50 p-3 rounded-md">
                        <h4 className="text-xs font-semibold text-cyan-400 mb-1 uppercase tracking-wider">eBay Resale Analysis</h4>
                        <p className="text-sm text-slate-300">{ebayResaleAnalysis ?? 'No analysis available.'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
