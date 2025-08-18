
import React, { useState } from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface SearchInputProps {
  onSearch: (keyword: string, userTitle: string) => void;
  isLoading: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading }) => {
  const [keyword, setKeyword] = useState('');
  const [userTitle, setUserTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword, userTitle);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
      <div>
        <label htmlFor="keyword" className="block text-sm font-medium text-slate-300 mb-2">
          Product Keyword
        </label>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="keyword"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g., 'wireless bluetooth earbuds'"
            className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="userTitle" className="block text-sm font-medium text-slate-300 mb-2">
          Your Current Product Title (Optional)
        </label>
        <input
          id="userTitle"
          type="text"
          value={userTitle}
          onChange={(e) => setUserTitle(e.target.value)}
          placeholder="For title optimization"
          className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center bg-cyan-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5 mr-2" />
            Start AI Analysis
          </>
        )}
      </button>
    </form>
  );
};
