
export interface MarketplaceProduct {
  title: string;
  source: string;
  url: string;
}

export interface TitleSuggestion {
  title: string;
  reasoning: string;
}

export enum CompetitionLevel {
    HIGH = 'High',
    MEDIUM = 'Medium',
    LOW = 'Low',
    UNKNOWN = 'Unknown'
}

export interface CompetitionInfo {
  level: CompetitionLevel;
  analysis: string;
  sources: { title: string; url: string }[];
}

export interface Supplier {
  name: string;
  url: string;
  details: string;
}

export interface PricePoint {
    source: string;
    minPrice: number;
    maxPrice: number;
    avgPrice: number;
}

export interface ArbitrageOpportunity {
  amazonProduct: {
    title: string;
    price: number;
    imageUrl: string;
  };
  ebayOpportunity: {
    suggestedTitle: string;
    suggestedPrice: number;
    potentialProfit: number;
  };
  analysis: string;
  viability: 'Good' | 'Fair' | 'Poor';
}

export interface TrendingProduct {
    name: string;
    description: string;
    sourceMarketplace: string;
    imageUrl: string;
    ebayResaleAnalysis: string;
    trendScore: 'Hot' | 'High' | 'Medium';
}

export interface AnalysisResults {
  marketplaceResults?: MarketplaceProduct[];
  titleSuggestions?: TitleSuggestion[];
  competitionInfo?: CompetitionInfo;
  suppliers?: Supplier[];
  priceInsights?: PricePoint[];
}

export interface LoadingState {
  marketplace: boolean;
  title: boolean;
  competition: boolean;
  suppliers: boolean;
  price: boolean;
}
