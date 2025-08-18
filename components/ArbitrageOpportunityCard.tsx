import React from 'react';
import type { ArbitrageOpportunity } from '../types';

export const ArbitrageOpportunityCard: React.FC<{ result: ArbitrageOpportunity }> = ({ result }) => {
    const viabilityClasses = {
        Good: 'bg-green-500/20 text-green-300 border-green-500/30',
        Fair: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        Poor: 'bg-red-500/20 text-red-300 border-red-500/30',
    };

    const { amazonProduct, ebayOpportunity, viability } = result;

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg flex flex-col h-full transition-transform hover:scale-105 hover:border-cyan-500/50">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <h4 className="font-semibold text-slate-200 text-base truncate flex-1 pr-2">{amazonProduct?.title ?? 'Unknown Product'}</h4>
                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${viabilityClasses[viability]} flex-shrink-0`}>
                    {viability}
                </span>
            </div>
            <div className="p-4 flex-grow">
                <div className="flex space-x-4">
                    <img
                        src={amazonProduct?.imageUrl || 'https://via.placeholder.com/80'}
                        alt="Amazon Product"
                        className="w-20 h-20 object-cover rounded-lg border-2 border-slate-700 flex-shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                        <p className="text-xs text-slate-400">Amazon Price</p>
                        <p className="text-xl font-bold text-white">${(amazonProduct?.price ?? 0).toFixed(2)}</p>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-2">
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">eBay Opportunity</p>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-300 text-sm">Suggested Price:</span>
                        <span className="font-bold text-green-400 text-lg">${(ebayOpportunity?.suggestedPrice ?? 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-300 text-sm">Potential Profit:</span>
                        <span className="font-bold text-green-400 text-lg">${(ebayOpportunity?.potentialProfit ?? 0).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};