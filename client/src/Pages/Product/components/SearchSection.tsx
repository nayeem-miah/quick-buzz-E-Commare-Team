import { Flame, History, Search, Sparkles, Tag, X } from 'lucide-react';
import { useState } from 'react';
import { CategoryOption, ProductItem } from '../types';

interface SearchSectionProps {
  searchText: string;
  typoSuggestion: string;
  recentSearches: string[];
  popularSearches: string[];
  matchingProducts: ProductItem[];
  matchingCategories: CategoryOption[];
  onSearchChange: (value: string) => void;
  onPersistSearch: (value: string) => void;
}

const SearchSection = ({
  searchText,
  typoSuggestion,
  recentSearches,
  popularSearches,
  matchingProducts,
  matchingCategories,
  onSearchChange,
  onPersistSearch,
}: SearchSectionProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const matches = [
    ...matchingCategories.slice(0, 2).map((item) => item.label),
    ...matchingProducts.slice(0, 3).map((item) => item.productTitle),
  ];

  return (
    <section className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">QuickBuzz products</p>
          <h1 className="mt-2 text-2xl font-bold text-gray-950 sm:text-3xl">Find the right tech faster</h1>
        </div>

        <div className="relative mx-auto mt-6 max-w-3xl">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => window.setTimeout(() => setIsFocused(false), 160)}
            onChange={(event) => onSearchChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') onPersistSearch(typoSuggestion || searchText);
            }}
            placeholder="Search mobile, mouse, keyboard, charger..."
            className="h-14 w-full rounded-xl border border-gray-200 bg-white pl-14 pr-14 text-base shadow-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
          />
          {searchText && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-orange-100 hover:text-orange-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {isFocused && (
            <div className="absolute z-30 mt-3 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg shadow-gray-200/60">
              {typoSuggestion && (
                <button
                  type="button"
                  onMouseDown={() => {
                    onSearchChange(typoSuggestion);
                    onPersistSearch(typoSuggestion);
                  }}
                  className="flex w-full items-center gap-3 bg-orange-50 px-5 py-3 text-left text-sm font-medium text-orange-700"
                >
                  <Sparkles className="h-4 w-4" /> Did you mean {typoSuggestion}?
                </button>
              )}

              <div className="grid gap-1 p-3 md:grid-cols-3">
                <SuggestionGroup icon="recent" title="Recent" items={recentSearches} onSelect={onSearchChange} />
                <SuggestionGroup icon="trending" title="Trending" items={popularSearches} onSelect={onSearchChange} />
                <SuggestionGroup icon="matches" title="Matches" items={matches} onSelect={onSearchChange} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const SuggestionGroup = ({
  icon,
  title,
  items,
  onSelect,
}: {
  icon: 'recent' | 'trending' | 'matches';
  title: string;
  items: string[];
  onSelect: (value: string) => void;
}) => {
  const Icon = icon === 'recent' ? History : icon === 'trending' ? Flame : Tag;

  return (
    <div>
      <p className="px-2 py-2 text-xs font-semibold uppercase text-gray-400">{title}</p>
      {items.map((item, index) => (
        <button
          key={`${item}-${index}`}
          type="button"
          onMouseDown={() => onSelect(item)}
          className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
        >
          <Icon className={`h-4 w-4 ${icon === 'trending' ? 'text-orange-500' : 'text-gray-400'}`} /> {item}
        </button>
      ))}
    </div>
  );
};

export default SearchSection;
