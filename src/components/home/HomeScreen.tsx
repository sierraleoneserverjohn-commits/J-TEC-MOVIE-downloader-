import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_MOVIES } from '../../data/mockMovies';
import { MovieCard } from '../common/MovieCard';
import { MovieCategory } from '../../types/movie';
import { 
  Play, 
  Info, 
  Download, 
  ChevronRight, 
  Compass, 
  Clock, 
  Film, 
  Landmark, 
  Archive, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { setSelectedMovie, setPlayingMovie, setCurrentTab, startDownload } = useApp();
  
  // Featured movie is Orson Welles' The Stranger
  const featuredMovie = MOCK_MOVIES.find((m) => m.featured) || MOCK_MOVIES[0];

  // Curated collections
  const collections: Array<{ name: string; category: MovieCategory; count: string; icon: any }> = [
    { name: 'Film Noir Classics', category: 'Film Noir', count: '1,420 Films', icon: Film },
    { name: 'Silent Expressionism', category: 'Silent Expressionism', count: '890 Films', icon: Landmark },
    { name: 'Vintage Sci-Fi', category: 'Sci-Fi Classic', count: '640 Films', icon: Sparkles },
    { name: 'Archival Documentaries', category: 'Archival Documentary', count: '2,150 Films', icon: Archive },
    { name: 'Historical Chronicles', category: 'Historical Drama', count: '780 Films', icon: Clock },
    { name: 'African Cinema Archives', category: 'African Cinema', count: '310 Films', icon: Film },
  ];

  const continueExploring = MOCK_MOVIES.slice(1, 5);
  const publicArchiveDiscoveries = MOCK_MOVIES.slice(2, 8);
  const recentlyAdded = [...MOCK_MOVIES].reverse().slice(0, 6);

  const handleFeaturedDetails = () => {
    setSelectedMovie(featuredMovie);
  };

  const handleFeaturedPlay = () => {
    setPlayingMovie({ movie: featuredMovie, isOffline: false });
  };

  const handleFeaturedDownload = () => {
    if (featuredMovie.formats.length > 0) {
      startDownload(featuredMovie, featuredMovie.formats[0]);
    }
  };

  const navigateToCategory = (cat: MovieCategory) => {
    setCurrentTab('discover');
  };

  return (
    <div className="space-y-8 pb-24 md:pb-12 animate-in fade-in duration-300">
      
      {/* SECTION A: CINEMATIC FEATURED HERO */}
      <section className="relative w-full overflow-hidden rounded-2xl bg-[#0a0a0d] border border-white/5 shadow-2xl">
        <div className="relative h-[420px] sm:h-[480px] lg:h-[520px] w-full">
          <img
            src={featuredMovie.backdropUrl}
            alt={featuredMovie.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top opacity-75 scale-100 transition-transform duration-700 hover:scale-105"
          />
          {/* Gradients and Measured Scrims */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a0d] via-[#090a0d]/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090a0d] via-[#090a0d]/40 to-transparent w-full sm:w-3/4" />

          {/* Hero Content */}
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 max-w-3xl space-y-3.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-nums">
              <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider">
                Featured Spotlight
              </span>
              <span className="text-slate-300">
                {featuredMovie.provider}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">{featuredMovie.year}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">{featuredMovie.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400 font-semibold">{featuredMovie.rightsStatus}</span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              {featuredMovie.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-2xl font-light">
              {featuredMovie.synopsis}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleFeaturedPlay}
                className="h-11 px-5 rounded-xl bg-white text-black font-semibold text-xs sm:text-sm flex items-center gap-2 hover:bg-slate-200 shadow-xl transition-all active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Play Online</span>
              </button>

              <button
                onClick={handleFeaturedDetails}
                className="h-11 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-white/10 backdrop-blur-md transition-all active:scale-[0.98]"
              >
                <Info className="w-4 h-4" />
                <span>View Details</span>
              </button>

              <button
                onClick={handleFeaturedDownload}
                className="h-11 px-4 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-300 font-medium text-xs sm:text-sm flex items-center gap-2 border border-red-800/40 transition-all active:scale-[0.98]"
                title="Download 1080p MP4 to device"
              >
                <Download className="w-4 h-4 text-red-400" />
                <span className="hidden sm:inline">Download 1080p</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B: CONTINUE EXPLORING */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-display font-bold text-lg text-white">Continue Exploring</h2>
            <p className="text-xs text-slate-400">Archival films recently viewed in your session</p>
          </div>
          <button
            onClick={() => setCurrentTab('discover')}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono-nums transition-colors"
          >
            <span>Catalog</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {continueExploring.map((movie) => (
            <MovieCard key={movie.id} movie={movie} variant="landscape" />
          ))}
        </div>
      </section>

      {/* SECTION C: PUBLIC ARCHIVE DISCOVERIES */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-display font-bold text-lg text-white">Public Archive Discoveries</h2>
            <p className="text-xs text-slate-400">Directly indexed from Library of Congress, Wikimedia, & Prelinger</p>
          </div>
          <button
            onClick={() => setCurrentTab('discover')}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono-nums transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {publicArchiveDiscoveries.map((movie) => (
            <MovieCard key={movie.id} movie={movie} variant="portrait" />
          ))}
        </div>
      </section>

      {/* SECTION D: FEATURED ARCHIVE COLLECTIONS */}
      <section className="space-y-3">
        <div className="px-1">
          <h2 className="font-display font-bold text-lg text-white">Featured Collections</h2>
          <p className="text-xs text-slate-400">Curated cultural eras and historical preservation vaults</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {collections.map((col) => {
            const Icon = col.icon;
            return (
              <button
                key={col.name}
                onClick={() => navigateToCategory(col.category)}
                className="group flex flex-col items-start p-4 rounded-xl bg-[#111317] hover:bg-[#171920] border border-white/5 hover:border-white/10 text-left transition-all active:scale-[0.98]"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 group-hover:text-red-400 mb-2 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-display font-semibold text-xs sm:text-sm text-white group-hover:text-slate-200">
                  {col.name}
                </h3>
                <span className="text-[11px] font-mono-nums text-slate-500 mt-1">
                  {col.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION E: RECENTLY ADDED */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-display font-bold text-lg text-white">Recently Preserved & Indexed</h2>
            <p className="text-xs text-slate-400">Fresh high-definition restorations added to public registers</p>
          </div>
          <button
            onClick={() => setCurrentTab('discover')}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono-nums transition-colors"
          >
            <span>Explore</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {recentlyAdded.map((movie) => (
            <MovieCard key={movie.id} movie={movie} variant="portrait" />
          ))}
        </div>
      </section>

      {/* Archival Mission Banner */}
      <section className="p-6 rounded-2xl bg-gradient-to-r from-[#12141a] to-[#0d0f13] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-display font-semibold text-base text-white">
            100% Legal Public Domain & Open Access Cinema
          </h3>
          <p className="text-xs text-slate-400 max-w-xl">
            All files are verified free of active copyright under U.S. and international law. Download straight to your Android filesystem for offline study and preservation.
          </p>
        </div>
        <button
          onClick={() => setCurrentTab('discover')}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold whitespace-nowrap flex items-center gap-2"
        >
          <span>Search Archive Index</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>
    </div>
  );
};
