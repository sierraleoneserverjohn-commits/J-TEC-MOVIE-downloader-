import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_MOVIES } from '../../data/mockMovies';
import { MovieCard } from '../common/MovieCard';
import { ArchiveProvider, MovieCategory, RightsStatus } from '../../types/movie';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  Film, 
  RotateCcw, 
  Check, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

export const DiscoverScreen: React.FC = () => {
  const { globalSearchQuery, setGlobalSearchQuery } = useApp();

  const [searchQuery, setSearchQuery] = useState(globalSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProvider, setSelectedProvider] = useState<string>('All');
  const [selectedDecade, setSelectedDecade] = useState<string>('All');
  const [selectedRights, setSelectedRights] = useState<string>('All');
  const [downloadOnly, setDownloadOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'trending' | 'yearDesc' | 'yearAsc' | 'title'>('trending');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const categories: Array<string> = [
    'All',
    'Film Noir',
    'Sci-Fi Classic',
    'Silent Expressionism',
    'Archival Documentary',
    'Historical Drama',
    'African Cinema',
    'Educational Cinema',
    'Comedy Classic'
  ];

  const providers: Array<string> = [
    'All',
    'Internet Archive',
    'Library of Congress',
    'Wikimedia Commons',
    'Prelinger Archives'
  ];

  const decades = ['All', '1900s', '1920s', '1940s', '1950s', '1960s', '1970s'];

  const rightsList = ['All', 'Public Domain', 'Creative Commons'];

  const resetFilters = () => {
    setSearchQuery('');
    setGlobalSearchQuery('');
    setSelectedCategory('All');
    setSelectedProvider('All');
    setSelectedDecade('All');
    setSelectedRights('All');
    setDownloadOnly(false);
    setSortBy('trending');
  };

  const filteredMovies = useMemo(() => {
    return MOCK_MOVIES.filter((movie) => {
      // Query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = movie.title.toLowerCase().includes(q);
        const matchesCreator = movie.creator.toLowerCase().includes(q);
        const matchesSynopsis = movie.synopsis.toLowerCase().includes(q);
        const matchesCategory = movie.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCreator && !matchesSynopsis && !matchesCategory) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'All' && movie.category !== selectedCategory) {
        return false;
      }

      // Provider
      if (selectedProvider !== 'All' && movie.provider !== selectedProvider) {
        return false;
      }

      // Decade
      if (selectedDecade !== 'All' && movie.releaseDecade !== selectedDecade) {
        return false;
      }

      // Rights
      if (selectedRights !== 'All' && movie.rightsStatus !== selectedRights) {
        return false;
      }

      // Download availability
      if (downloadOnly && movie.formats.length === 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'trending') return b.trendingScore - a.trendingScore;
      if (sortBy === 'yearDesc') return b.year - a.year;
      if (sortBy === 'yearAsc') return a.year - b.year;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedProvider, selectedDecade, selectedRights, downloadOnly, sortBy]);

  const activeFilterCount = 
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedProvider !== 'All' ? 1 : 0) +
    (selectedDecade !== 'All' ? 1 : 0) +
    (selectedRights !== 'All' ? 1 : 0) +
    (downloadOnly ? 1 : 0);

  return (
    <div className="space-y-6 pb-24 md:pb-12 animate-in fade-in duration-300">
      
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">Discover Archive Cinema</h1>
          <p className="text-xs text-slate-400">Search legal public domain motion pictures and educational film records</p>
        </div>

        {/* Search input with buttons */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setGlobalSearchQuery(e.target.value);
              }}
              placeholder="Search titles, directors, eras (e.g. Welles, 1946, Noir)..."
              className="w-full h-11 pl-10 pr-9 rounded-xl bg-[#12141a] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500/80 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setGlobalSearchQuery('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter toggle trigger */}
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`h-11 px-3.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
              activeFilterCount > 0
                ? 'bg-red-950/50 text-red-300 border-red-700/60'
                : 'bg-[#12141a] hover:bg-[#181a22] text-slate-300 border-white/10'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-mono-nums">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Quick Horizontal Category Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'bg-[#12141a] hover:bg-[#181a22] text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Drawer / Panel (Expandable) */}
      {showFilterDrawer && (
        <div className="p-4 rounded-xl bg-[#12141a] border border-white/10 space-y-4 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono-nums">
              Refine Search Criteria
            </span>
            <button
              onClick={resetFilters}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {/* Archive Provider */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-mono-nums">Source Archive</label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full h-9 rounded-lg bg-[#0d0f14] border border-white/10 px-2.5 text-slate-200 focus:outline-none"
              >
                {providers.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Release Era / Decade */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-mono-nums">Decade / Era</label>
              <select
                value={selectedDecade}
                onChange={(e) => setSelectedDecade(e.target.value)}
                className="w-full h-9 rounded-lg bg-[#0d0f14] border border-white/10 px-2.5 text-slate-200 focus:outline-none"
              >
                {decades.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Rights / Licence */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-mono-nums">Legal Status</label>
              <select
                value={selectedRights}
                onChange={(e) => setSelectedRights(e.target.value)}
                className="w-full h-9 rounded-lg bg-[#0d0f14] border border-white/10 px-2.5 text-slate-200 focus:outline-none"
              >
                {rightsList.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-mono-nums">Sort Results</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full h-9 rounded-lg bg-[#0d0f14] border border-white/10 px-2.5 text-slate-200 focus:outline-none"
              >
                <option value="trending">Curated Trending</option>
                <option value="yearDesc">Newest Release First</option>
                <option value="yearAsc">Earliest Preservation First</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-white/5">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={downloadOnly}
                onChange={(e) => setDownloadOnly(e.target.checked)}
                className="w-4 h-4 rounded accent-red-600 bg-black/40 border border-white/10"
              />
              <span>Download Available to Android Storage Only</span>
            </label>

            <span className="text-[11px] font-mono-nums text-slate-400">
              Showing {filteredMovies.length} matching films
            </span>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-400 font-mono-nums">
        <span>
          {filteredMovies.length} {filteredMovies.length === 1 ? 'film' : 'films'} found
          {searchQuery && <span> for &ldquo;{searchQuery}&rdquo;</span>}
        </span>
        <span className="text-slate-500">
          Archive Verified · Public Records
        </span>
      </div>

      {/* Movie Results Grid */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} variant="portrait" />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center space-y-3 bg-[#111317] rounded-2xl border border-white/5 p-6">
          <div className="w-12 h-12 rounded-full bg-white/5 text-slate-400 mx-auto flex items-center justify-center">
            <Film className="w-6 h-6" />
          </div>
          <h3 className="font-display font-semibold text-base text-white">No Archival Records Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            We couldn’t find any public domain films matching your current query and filters. Try clearing your filters or searching for classic titles like “Metropolis”, “The Stranger”, or “1940s”.
          </p>
          <button
            onClick={resetFilters}
            className="mt-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-white transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
