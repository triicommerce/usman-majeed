
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import type { TrendingProduct } from '../types';
import { FlameIcon } from './icons/FlameIcon';
import { TrendingProductCard } from './TrendingProductCard';

export const TrendingProductsFinder: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<TrendingProduct[] | null>(null);

    const handleFindTrends = async () => {
        setError(null);
        setResults(null);
        setIsLoading(true);
        try {
            const data = await geminiService.findTrendingProducts();
            setResults(data);
        } catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : 'An unknown error occurred during trend discovery.';
            setError(`Failed to find trending products. ${message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <button
                    onClick={handleFindTrends}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center bg-cyan-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Scanning for Trends...
                        </>
                    ) : (
                        <>
                            <FlameIcon className="w-5 h-5 mr-2" />
                            Find Trending Products
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
                    <p>{error}</p>
                </div>
            )}

            {results && (
                <div className="mt-8 max-w-7xl mx-auto">
                    {results.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.map((product, index) => (
                                <TrendingProductCard key={index} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 px-6 bg-slate-800/50 border border-slate-700 rounded-xl">
                            <h3 className="text-lg font-semibold text-slate-200">No Hot Trends Found</h3>
                            <p className="text-slate-400 mt-2">The AI couldn't spot any significant trending products right now. Try again later as new trends can emerge quickly.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
