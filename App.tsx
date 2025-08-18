
import React, { useState, useCallback } from 'react';
import { SearchInput } from './components/SearchInput';
import { ResultsDashboard } from './components/ResultsDashboard';
import { Header } from './components/Header';
import { geminiService } from './services/geminiService';
import type { AnalysisResults, LoadingState } from './types';
import { ArbitrageFinder } from './components/ArbitrageFinder';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { DollarSignIcon } from './components/icons/DollarSignIcon';
import { TrendingProductsFinder } from './components/TrendingProductsFinder';
import { FlameIcon } from './components/icons/FlameIcon';

type ActiveTab = 'research' | 'arbitrage' | 'trending';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    marketplace: false,
    title: false,
    competition: false,
    suppliers: false,
    price: false,
  });
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('research');

  const handleSearch = useCallback(async (keyword: string, userTitle: string) => {
    if (!keyword) {
      setError('Please enter a product keyword to start your research.');
      return;
    }

    setHasSearched(true);
    setError(null);
    setResults(null);
    setLoadingState({
      marketplace: true,
      title: true,
      competition: true,
      suppliers: true,
      price: true,
    });

    try {
      // Fetch marketplace results first to get titles for optimization
      const marketplacePromise = geminiService.searchMarketplaces(keyword);
      marketplacePromise.then(data => {
        setResults(prev => ({ ...prev, marketplaceResults: data }));
        setLoadingState(prev => ({ ...prev, marketplace: false }));

        // Now fetch title optimizations
        const existingTitles = data.map(p => p.title);
        const titlePromise = geminiService.optimizeTitle(keyword, userTitle, existingTitles);
        titlePromise.then(titleData => {
            setResults(prev => ({ ...prev, titleSuggestions: titleData }));
        }).catch(e => {
            console.error('Title Optimization Error:', e);
            setError(prev => prev ? `${prev}\nTitle optimization failed.` : 'Title optimization failed.');
        }).finally(() => {
            setLoadingState(prev => ({ ...prev, title: false }));
        });
      }).catch(e => {
          console.error('Marketplace Search Error:', e);
          setError(prev => prev ? `${prev}\nMarketplace search failed.` : 'Marketplace search failed.');
          setLoadingState(prev => ({ ...prev, marketplace: false, title: false })); // also stop title loading
      });

      // Fetch competition and suppliers in parallel
      const competitionPromise = geminiService.analyzeCompetition(keyword);
      competitionPromise.then(data => {
        setResults(prev => ({ ...prev, competitionInfo: data }));
      }).catch(e => {
        console.error('Competition Analysis Error:', e);
        setError(prev => prev ? `${prev}\nCompetition analysis failed.` : 'Competition analysis failed.');
      }).finally(() => {
        setLoadingState(prev => ({ ...prev, competition: false }));
      });
      
      const suppliersPromise = geminiService.findSuppliers(keyword);
      suppliersPromise.then(data => {
        setResults(prev => ({ ...prev, suppliers: data }));
      }).catch(e => {
        console.error('Supplier Search Error:', e);
        setError(prev => prev ? `${prev}\nSupplier search failed.` : 'Supplier search failed.');
      }).finally(() => {
        setLoadingState(prev => ({ ...prev, suppliers: false }));
      });

      const pricePromise = geminiService.getPriceInsights(keyword);
      pricePromise.then(data => {
        setResults(prev => ({ ...prev, priceInsights: data }));
      }).catch(e => {
        console.error('Price Analysis Error:', e);
        setError(prev => prev ? `${prev}\nPrice analysis failed.` : 'Price analysis failed.');
      }).finally(() => {
        setLoadingState(prev => ({...prev, price: false }));
      });

    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to perform analysis. ${errorMessage}`);
      setLoadingState({ marketplace: false, title: false, competition: false, suppliers: false, price: false });
    }
  }, []);

  const isLoading = Object.values(loadingState).some(Boolean);

  const TabButton: React.FC<{tab: ActiveTab, label: string, icon: React.ReactNode}> = ({ tab, label, icon }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={`flex-1 flex items-center justify-center px-4 py-3 font-semibold text-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 rounded-t-lg
          ${isActive 
            ? 'bg-slate-800/50 border-slate-700 border-t border-x text-white' 
            : 'text-slate-400 hover:bg-slate-800/20 hover:text-slate-200'
          }`
        }
        aria-current={isActive ? 'page' : undefined}
      >
        {icon}
        {label}
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 transition-colors duration-300">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">

          <div className="flex border-b border-slate-700">
            <TabButton tab="research" label="Product Research" icon={<SparklesIcon className="w-5 h-5 mr-2" />} />
            <TabButton tab="arbitrage" label="Arbitrage Finder" icon={<DollarSignIcon className="w-5 h-5 mr-2" />} />
            <TabButton tab="trending" label="Trending Products" icon={<FlameIcon className="w-5 h-5 mr-2" />} />
          </div>
          
          {activeTab === 'research' && (
            <>
              <p className="text-center text-slate-400 my-6 text-lg">
                Enter a product keyword to analyze marketplaces, optimize titles, assess competition, and discover suppliers.
              </p>
              <SearchInput onSearch={handleSearch} isLoading={isLoading} />
              {error && (
                <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
                  <p>{error}</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'arbitrage' && (
            <>
              <p className="text-center text-slate-400 my-6 text-lg">
                Find profitable products to resell on eBay from Amazon.
              </p>
              <ArbitrageFinder />
            </>
          )}
          
          {activeTab === 'trending' && (
             <>
              <p className="text-center text-slate-400 my-6 text-lg">
                Discover viral products from TikTok, Etsy, and more with high resale potential on eBay.
              </p>
              <TrendingProductsFinder />
            </>
          )}

        </div>
        {activeTab === 'research' && (
          <div className="mt-12">
            {hasSearched && <ResultsDashboard results={results} loadingState={loadingState} />}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
