import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProviderBadge, RightsBadge } from '../common/ProviderBadge';
import { Movie, MovieFileFormat } from '../../types/movie';
import { 
  X, 
  Play, 
  Download, 
  Heart, 
  Check, 
  ShieldCheck, 
  FileVideo, 
  Clock, 
  ExternalLink 
} from 'lucide-react';

interface MovieDetailsContentProps {
  movie: Movie;
}

const MovieDetailsContent: React.FC<MovieDetailsContentProps> = ({ movie }) => {
  const { setSelectedMovie, setPlayingMovie, startDownload, toggleFavourite, isFavourite, downloads } = useApp();
  
  const [selectedFormat, setSelectedFormat] = useState<MovieFileFormat>(movie.formats[0] || null);
  const favourited = isFavourite(movie.id);

  // Check if currently downloading
  const activeDownload = downloads.find((d) => d.movieId === movie.id && d.status !== 'failed');

  const handleDownload = () => {
    if (selectedFormat) {
      startDownload(movie, selectedFormat);
    }
  };

  const handlePlayOnline = () => {
    setPlayingMovie({ movie, isOffline: false });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl min-h-screen sm:min-h-0 bg-[#0d0f14] sm:rounded-2xl border-0 sm:border border-white/10 overflow-hidden shadow-2xl flex flex-col my-auto">
        
        {/* Close Button Floating */}
        <button
          onClick={() => setSelectedMovie(null)}
          aria-label="Close movie details"
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:text-white border border-white/10 flex items-center justify-center transition-all hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Backdrop Header */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-black">
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f14] via-[#0d0f14]/60 to-transparent" />
          
          {/* Top badges on backdrop */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono-nums">
              <RightsBadge rights={movie.rightsStatus} />
            </span>
            <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-xs text-slate-300">
              <ProviderBadge provider={movie.provider} />
            </span>
          </div>

          {/* Bottom title block over backdrop */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-nums text-slate-400 mb-1">
                <span>{movie.year}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{movie.category}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {movie.runtime}
                </span>
              </div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                {movie.title}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Directed by <strong className="text-slate-200">{movie.creator}</strong>
              </p>
            </div>

            {/* Quick Favourite Toggle */}
            <button
              onClick={() => toggleFavourite(movie.id)}
              aria-label={favourited ? 'Remove from favourites' : 'Add to favourites'}
              className="p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:text-red-400 transition-all hover:scale-105 shrink-0"
            >
              <Heart className={`w-5 h-5 ${favourited ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 flex-1">
          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3">
            {movie.hasPlayableStream && (
              <button
                onClick={handlePlayOnline}
                className="flex-1 min-w-[140px] h-12 rounded-xl bg-white text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-slate-200 active:scale-[0.98] transition-all"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Play Online</span>
              </button>
            )}

            <button
              onClick={handleDownload}
              className={`flex-1 min-w-[160px] h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border transition-all active:scale-[0.98] ${
                activeDownload
                  ? 'bg-red-950/40 text-red-300 border-red-800/50'
                  : 'bg-red-600 hover:bg-red-700 text-white border-red-500 shadow-lg shadow-red-950/40'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>
                {activeDownload ? `Downloading (${activeDownload.progress}%)` : `Download ${selectedFormat?.resolution || 'Movie'}`}
              </span>
            </button>
          </div>

          {/* Synopsis & Editorial Description */}
          <div className="space-y-2">
            <h2 className="text-xs uppercase tracking-wider font-mono-nums text-slate-400 font-semibold">
              Synopsis & Context
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed font-light">
              {movie.synopsis}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              {movie.description}
            </p>
          </div>

          {/* File Selection Panel (Public Archives Video Assets) */}
          <div className="space-y-3 bg-[#111318] p-4 rounded-xl border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <FileVideo className="w-4 h-4 text-red-500" />
                Available Archival Encodings
              </span>
              <span className="text-[11px] font-mono-nums text-slate-400">
                Verified Direct Video Streams
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {movie.formats.map((fmt) => {
                const isSelected = selectedFormat?.id === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`flex flex-col p-3 rounded-lg text-left transition-all border ${
                      isSelected
                        ? 'bg-white/10 border-red-500/80 shadow-md'
                        : 'bg-black/30 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-nums font-bold text-sm text-white">
                        {fmt.resolution}
                      </span>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-red-400" />
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono-nums">{fmt.format}</span>
                      )}
                    </div>
                    <span className="text-xs text-slate-300 font-mono-nums mt-1">
                      {fmt.fileSizeFormatted}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono-nums mt-0.5">
                      Bitrate: {fmt.bitrate}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legal / Rights Attribution Details */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Public Rights & Provenance Verification</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400 pl-6">
              {movie.rightsAttribution}
            </p>
            <div className="flex items-center gap-3 pl-6 pt-1 text-[11px] font-mono-nums text-slate-500">
              <span>Archive Identifier: {movie.providerId}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 hover:text-slate-300 cursor-pointer">
                Public Record <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MovieDetailsModal: React.FC = () => {
  const { selectedMovie } = useApp();

  if (!selectedMovie) return null;

  return <MovieDetailsContent movie={selectedMovie} />;
};
