
import React from 'react';
import { GlobeIcon } from './icons/GlobeIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { UsersIcon } from './icons/UsersIcon';
import { TruckIcon } from './icons/TruckIcon';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { FlameIcon } from './icons/FlameIcon';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-slate-800/50 p-6 rounded-lg text-center border border-slate-700 flex flex-col items-center">
    <div className="flex justify-center items-center mb-4 text-cyan-400">
      {icon}
    </div>
    <h3 className="font-semibold text-slate-200 mb-2">{title}</h3>
    <p className="text-sm text-slate-400">{description}</p>
  </div>
);

export const WelcomeSplash: React.FC = () => {
  return (
    <div className="text-center py-10">
      <h2 className="text-3xl font-bold text-slate-100 mb-4">Unlock Your E-Commerce Potential</h2>
      <p className="text-slate-400 max-w-2xl mx-auto mb-10">
        Your AI-powered research assistant is ready. Select a tool above to begin.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <FeatureCard 
          icon={<GlobeIcon className="w-8 h-8"/>}
          title="Marketplace Scan"
          description="Discover top product listings across major online marketplaces."
        />
        <FeatureCard 
          icon={<SparklesIcon className="w-8 h-8"/>}
          title="Title Optimization"
          description="Get AI-powered suggestions to create compelling, SEO-friendly titles."
        />
        <FeatureCard 
          icon={<UsersIcon className="w-8 h-8"/>}
          title="Competition Analysis"
          description="Gauge market saturation and understand the competitive landscape."
        />
        <FeatureCard 
          icon={<TruckIcon className="w-8 h-8"/>}
          title="Supplier Discovery"
          description="Find potential wholesale or dropshipping suppliers for your product."
        />
        <FeatureCard 
          icon={<DollarSignIcon className="w-8 h-8"/>}
          title="Arbitrage Finder"
          description="Analyze an Amazon product for its resale potential on eBay for 30% ROI."
        />
        <FeatureCard 
          icon={<FlameIcon className="w-8 h-8"/>}
          title="Trending Products"
          description="Spot viral products on TikTok, Etsy, etc., and analyze their eBay resale potential."
        />
      </div>
    </div>
  );
};
