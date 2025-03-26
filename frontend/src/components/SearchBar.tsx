import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSearchInput: (query: string) => void;
  isLoading: boolean;
  onClear: () => void;
  query: string;
}

export function SearchBar({ onSearch, onSearchInput, isLoading, onClear, query }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => onSearchInput(e.target.value)}
          placeholder="e.g. i want modern blue sofa with price less than 900 dollars"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={isLoading}
        />
      
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-24 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          ) : (
            'Search'
          )}
        </button>
       
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 py-1 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        
      </div>
    </form>
  );
} 