
import React from 'react';
import type { AnalysisResults, LoadingState } from '../types';
import { MarketplaceResults } from './MarketplaceResults';
import { TitleOptimizer } from './TitleOptimizer';
import { CompetitionAnalyzer } from './CompetitionAnalyzer';
import { SupplierFinder } from './SupplierFinder';
import { WelcomeSplash } from './WelcomeSplash';
import { PriceComparisonChart } from './PriceComparisonChart';

interface ResultsDashboardProps {
  results: AnalysisResults | null;
  loadingState: LoadingState;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results, loadingState }) => {
  const hasResults = results && Object.values(results).some(res => res && (!Array.isArray(res) || res.length > 0));
  const isLoading = Object.values(loadingState).some(Boolean);

  if (!isLoading && !hasResults) {
    return <WelcomeSplash />;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <MarketplaceResults results={results?.marketplaceResults} isLoading={loadingState.marketplace} />
          <CompetitionAnalyzer info={results?.competitionInfo} isLoading={loadingState.competition} />
        </div>
        <div className="space-y-8">
          <TitleOptimizer suggestions={results?.titleSuggestions} isLoading={loadingState.title} />
          <SupplierFinder suppliers={results?.suppliers} isLoading={loadingState.suppliers} />
        </div>
      </div>
      <div>
        <PriceComparisonChart insights={results?.priceInsights} isLoading={loadingState.price} />
      </div>
    </div>
  );
};
