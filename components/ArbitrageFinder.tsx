import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import type { ArbitrageOpportunity } from '../types';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { LinkIcon } from './icons/LinkIcon';
import { SearchIcon } from './icons/SearchIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { ArbitrageOpportunityCard } from './ArbitrageOpportunityCard';

const ArbitrageResultDetail: React.FC<{ result: ArbitrageOpportunity }> = ({ result }) => {
    const viabilityClasses = {
        Good: 'bg-green-500/20 text-green-300 border-green-500/30',
        Fair: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        Poor: 'bg-red-500/20 text-red-300 border-red-500/30',
    };

    const { amazonProduct, ebayOpportunity, analysis, viability } = result;

    return (
        <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <h3 className="font-semibold text-slate-200 text-lg">Arbitrage Opportunity Analysis</h3>
                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${viabilityClasses[viability]}`}>
                    {viability} Viability
                </span>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Amazon Product */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Source: Amazon</h4>
                        <div className="flex space-x-4">
                            <img src={amazonProduct?.imageUrl || 'https://via.placeholder.com/96'} alt="Amazon Product" className="w-24 h-24 object-cover rounded-lg border-2 border-slate-700" />
                            <div className="flex-1">
                                <p className="text-slate-300 line-clamp-3 text-sm">{amazonProduct?.title ?? 'Title not found'}</p>
                                <p className="text-2xl font-bold text-white mt-2">${(amazonProduct?.price ?? 0).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    {/* eBay Opportunity */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-green-400 uppercase tracking-wider">Opportunity: eBay</h4>
                        <p className="text-slate-300 font-semibold text-sm line-clamp-3 bg-slate-900/50 p-3 rounded-md">
                            <span className="text-slate-400 font-normal block text-xs mb-1">Suggested Title:</span>
                            {ebayOpportunity?.suggestedTitle ?? 'Title not available'}
                        </p>
                        <div className="flex space-x-4 text-center">
                            <div className="flex-1">
                                <p className="text-slate-400 text-xs">Suggested Price</p>
                                <p className="text-2xl font-bold text-green-400">${(ebayOpportunity?.suggestedPrice ?? 0).toFixed(2)}</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-slate-400 text-xs">Potential Profit</p>
                                <p className="text-2xl font-bold text-green-400">${(ebayOpportunity?.potentialProfit ?? 0).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* AI Analysis */}
                <div className="mt-6 pt-4 border-t border-slate-700/50">
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">AI Analyst Notes</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{analysis ?? 'No analysis provided.'}</p>
                </div>
            </div>
        </div>
    );
};

type SearchMode = 'discover' | 'analyze';

export const ArbitrageFinder: React.FC = () => {
    const [mode, setMode] = useState<SearchMode>('discover');

    const [amazonUrl, setAmazonUrl] = useState('');
    const [category, setCategory] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [analyzeResult, setAnalyzeResult] = useState<ArbitrageOpportunity | null>(null);
    const [discoverResults, setDiscoverResults] = useState<ArbitrageOpportunity[] | null>(null);

    const handleAnalyzeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setAnalyzeResult(null);

        if (!amazonUrl || !amazonUrl.includes('amazon.com')) {
            setError('Please enter a valid Amazon product URL.');
            return;
        }

        setIsLoading(true);
        try {
            const data = await geminiService.findArbitrageOpportunity(amazonUrl);
            setAnalyzeResult(data);
        } catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : 'An unknown error occurred during analysis.';
            setError(`Failed to analyze URL. ${message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDiscoverSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setDiscoverResults(null);
        if (!category) {
            setError('Please enter a product category to discover.');
            return;
        }
        setIsLoading(true);
        try {
            const data = await geminiService.discoverArbitrageOpportunities(category);
            setDiscoverResults(data);
        } catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : 'An unknown error occurred during discovery.';
            setError(`Failed to discover opportunities. ${message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleModeChange = (newMode: SearchMode) => {
        setMode(newMode);
        setError(null);
        setAnalyzeResult(null);
        setDiscoverResults(null);
    };

    const ModeButton: React.FC<{
        label: string;
        icon: React.ReactNode;
        isActive: boolean;
        onClick: () => void;
    }> = ({ label, icon, isActive, onClick }) => (
        <button
            onClick={onClick}
            className={`flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900
            ${isActive ? 'bg-cyan-600 text-white' : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div>
            <div className="flex justify-center items-center gap-4 my-6">
                <ModeButton
                    label="Discover by Category"
                    icon={<ClipboardListIcon className="w-5 h-5" />}
                    isActive={mode === 'discover'}
                    onClick={() => handleModeChange('discover')}
                />
                <ModeButton
                    label="Analyze by URL"
                    icon={<LinkIcon className="w-5 h-5" />}
                    isActive={mode === 'analyze'}
                    onClick={() => handleModeChange('analyze')}
                />
            </div>
            
            {mode === 'discover' && (
                <form onSubmit={handleDiscoverSubmit} className="space-y-4 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2">
                            Product Category
                        </label>
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                id="category"
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="e.g., 'wireless headphones', 'kitchen gadgets'"
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center bg-cyan-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300"
                    >
                         {isLoading ? 'Discovering...' : 'Discover Opportunities'}
                    </button>
                </form>
            )}

            {mode === 'analyze' && (
                 <form onSubmit={handleAnalyzeSubmit} className="space-y-4 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <div>
                        <label htmlFor="amazonUrl" className="block text-sm font-medium text-slate-300 mb-2">
                            Amazon Product URL
                        </label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                id="amazonUrl"
                                type="url"
                                value={amazonUrl}
                                onChange={(e) => setAmazonUrl(e.target.value)}
                                placeholder="https://www.amazon.com/dp/B0..."
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center bg-cyan-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300"
                    >
                       {isLoading ? 'Analyzing...' : 'Analyze Opportunity (30% ROI)'}
                    </button>
                </form>
            )}

            {isLoading && (
                 <div className="flex justify-center mt-8">
                     <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                 </div>
            )}

            {error && (
                <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
                    <p>{error}</p>
                </div>
            )}
            
            {analyzeResult && <ArbitrageResultDetail result={analyzeResult} />}

            {discoverResults && (
                <div className="mt-8">
                    {discoverResults.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {discoverResults.map((result, index) => (
                                <ArbitrageOpportunityCard key={index} result={result} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 px-6 bg-slate-800/50 border border-slate-700 rounded-xl">
                            <h3 className="text-lg font-semibold text-slate-200">No Opportunities Found</h3>
                            <p className="text-slate-400 mt-2">The AI couldn't find any viable arbitrage opportunities in this category with a 30% ROI target. Try a different or more specific category.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};