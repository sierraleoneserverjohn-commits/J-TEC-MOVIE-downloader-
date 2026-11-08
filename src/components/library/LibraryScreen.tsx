import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_MOVIES } from '../../data/mockMovies';
import { LibraryItem } from '../../types/movie';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { 
  Play, 
  Trash2, 
  Info, 
  Search, 
  X, 
  HardDrive, 
  Film, 
  FolderDown, 
  ArrowUpDown,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const LibraryScreen: React.FC = () => {
  const { library, removeFromLibrary, setPlayingMovie, setSelectedMovie, setCurrentTab } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'size'>('date');
  const [deleteCandidate, setDeleteCandidate] = useState<LibraryItem | null>(null);

  // Compute total size
  const totalBytes = library.reduce((acc, curr) => acc + curr.fileSizeBytes, 0);
  const totalFormatted = (totalBytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';

  // Categories present in library
  const categories = ['All', ...Array.from(new Set(library.map((item) => item.category)))];

  const filteredLibrary = useMemo(() => {
    return library.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!item.title.toLowerCase().includes(q) && !item.category.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'size') return b.fileSizeBytes - a.fileSizeBytes;
      // default: date (id timestamp or array order)
      return b.id.localeCompare(a.id);
    });
  }, [library, searchQuery, selectedCategory, sortBy]);

  const handlePlayOffline = (item: LibraryItem) => {
    const originalMovie = MOCK_MOVIES.find((m) => m.id === item.movieId) || {
      id: item.movieId,
      title: item.title,
      year: item.year,
      runtime: item.runtime,
      category: item.category,
      synopsis: 'Stored on Android local storage.',
      description: 'Preserved local copy for offline playback.',
      creator: 'Archival Creator',
      provider: item.provider,
      providerId: item.movieId,
      rightsStatus: item.rightsStatus,
      rightsAttribution: 'Public Archive Copy',
      backdropUrl: item.backdropUrl,
      posterUrl: item.posterUrl,
      trendingScore: 90,
      releaseDecade: '1940s' as const,
      formats: [],
      hasPlayableStream: true
    };

    setPlayingMovie({ movie: originalMovie as any, isOffline: true });
  };

  const handleOpenDetails = (item: LibraryItem) => {
    const originalMovie = MOCK_MOVIES.find((m) => m.id === item.movieId);
    if (originalMovie) {
      setSelectedMovie(originalMovie);
    }
  };

  const confirmDelete = () => {
    if (deleteCandidate) {
      removeFromLibrary(deleteCandidate.id);
      setDeleteCandidate(null);
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 animate-in fade-in duration-300">
      
      {/* Header & Local Device Storage Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">My Offline Library</h1>
          <p className="text-xs text-slate-400">Locally stored public domain files on this Android device</p>
        </div>

        {/* Local device storage indicator pill */}
        <div className="flex items-center gap-3 bg-[#111317] border border-white/5 px-3.5 py-2 rounded-xl text-xs font-mono-nums">
          <HardDrive className="w-4 h-4 text-emerald-400" />
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">{library.length} Movies</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300">{totalFormatted} Used</span>
          </div>
        </div>
      </div>

      {/* Directory notice */}
      <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono-nums">
        <div className="flex items-center gap-2 truncate">
          <FolderDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">Storage: /storage/emulated/0/Movies/JTEC</span>
        </div>
        <span className="text-[11px] text-emerald-400 flex items-center gap-1 shrink-0 ml-2">
          <CheckCircle2 className="w-3 h-3" /> Indexed & Ready Offline
        </span>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved movies..."
            className="w-full h-10 pl-10 pr-9 rounded-xl bg-[#12141a] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500/80 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Category filter */}
          {categories.length > 2 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 rounded-xl bg-[#12141a] border border-white/10 px-3 text-xs text-slate-200 focus:outline-none font-mono-nums flex-1 sm:flex-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}

          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-10 rounded-xl bg-[#12141a] border border-white/10 px-3 text-xs text-slate-200 focus:outline-none font-mono-nums flex-1 sm:flex-none"
          >
            <option value="date">Date Added</option>
            <option value="title">Movie Title</option>
            <option value="size">File Size</option>
          </select>
        </div>
      </div>

      {/* Movie Grid */}
      {filteredLibrary.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredLibrary.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col bg-[#111317] border border-white/5 hover:border-white/15 rounded-xl overflow-hidden transition-all shadow-lg"
            >
              {/* Thumbnail with overlay */}
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img
                  src={item.backdropUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Format pill */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono-nums text-white border border-white/10">
                  {item.resolution} · {item.format}
                </span>

                {/* Play Offline button overlay */}
                <button
                  onClick={() => handlePlayOffline(item)}
                  aria-label={`Play ${item.title} offline`}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
                    <Play className="w-5 h-5 fill-white translate-x-0.5" />
                  </div>
                </button>
              </div>

              {/* Info & Metadata */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-semibold text-sm text-white line-clamp-1 group-hover:text-slate-200">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono-nums mt-0.5">
                    <span>{item.year}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="truncate">{item.category}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span>{item.runtime}</span>
                  </div>
                </div>

                {/* Storage & Added time */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono-nums text-slate-400">
                  <span>{item.fileSizeFormatted}</span>
                  <span>{item.addedToLibraryDate}</span>
                </div>

                {/* Bottom Card Actions */}
                <div className="pt-1 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenDetails(item)}
                    className="text-xs text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>

                  <button
                    onClick={() => setDeleteCandidate(item)}
                    title="Delete movie from local storage"
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty Library State */
        <div className="py-16 text-center space-y-3 bg-[#111317] rounded-2xl border border-white/5 p-6">
          <div className="w-12 h-12 rounded-full bg-white/5 text-slate-400 mx-auto flex items-center justify-center">
            <Film className="w-6 h-6" />
          </div>
          <h3 className="font-display font-semibold text-base text-white">Your Offline Library is Empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            No public domain movies have been downloaded to this device yet. Browse the catalog to download films directly for offline playback.
          </p>
          <button
            onClick={() => setCurrentTab('discover')}
            className="mt-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white shadow-md transition-colors"
          >
            Explore Movies to Download
          </button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!deleteCandidate}
        title="Remove Downloaded Movie?"
        message={`Are you sure you want to delete "${deleteCandidate?.title}" (${deleteCandidate?.fileSizeFormatted}) from local Android storage? This file will be permanently removed from your device.`}
        confirmLabel="Delete from Device"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteCandidate(null)}
      />
    </div>
  );
};
