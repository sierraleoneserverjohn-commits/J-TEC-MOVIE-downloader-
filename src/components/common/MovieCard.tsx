import React from 'react';
import { Movie } from '../../types/movie';
import { MoviePoster } from './MoviePoster';
import { useApp } from '../../context/AppContext';
import { Download, Heart, Play } from 'lucide-react';
import { RightsBadge } from './ProviderBadge';

interface MovieCardProps {
  movie: Movie;
  variant?: 'portrait' | 'landscape';
  className?: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  variant = 'portrait',
  className = ''
}) => {
  const { setSelectedMovie, setPlayingMovie, toggleFavourite, isFavourite, startDownload } = useApp();
  const favourited = isFavourite(movie.id);

  const handleCardClick = () => {
    setSelectedMovie(movie);
  };

  const handlePlayDirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayingMovie({ movie, isOffline: false });
  };

  const handleQuickDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (movie.formats.length > 0) {
      // Pick 1080p or best available format
      startDownload(movie, movie.formats[0]);
    }
  };

  const handleHeart = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavourite(movie.id);
  };

  if (variant === 'landscape') {
    return (
      <div
        onClick={handleCardClick}
        className={`group relative flex flex-col cursor-pointer transition-all active:scale-[0.98] ${className}`}
      >
        <div className="relative overflow-hidden rounded-lg">
          <MoviePoster
            src={movie.backdropUrl}
            alt={movie.title}
            aspect="landscape"
            className="w-full"
            overlayBadge={<RightsBadge rights={movie.rightsStatus} />}
          />
          {/* Quick Play hover overlay */}
          <button
            onClick={handlePlayDirect}
            aria-label={`Play ${movie.title}`}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 text-black flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white active:scale-90"
          >
            <Play className="w-4 h-4 fill-black translate-x-0.5" />
          </button>
        </div>

        <div className="mt-2.5 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display font-semibold text-sm text-white group-hover:text-slate-200 truncate">
              {movie.title}
            </h3>
            <button
              onClick={handleHeart}
              aria-label={favourited ? 'Remove favourite' : 'Add favourite'}
              className="p-1 text-slate-400 hover:text-red-400 transition-colors"
            >
              <Heart className={`w-3.5 h-3.5 ${favourited ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono-nums">
            <span>{movie.year}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="truncate">{movie.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{movie.runtime}</span>
          </div>

          <p className="text-[11px] text-slate-500 line-clamp-1">
            {movie.provider}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col cursor-pointer transition-all active:scale-[0.98] ${className}`}
    >
      <div className="relative overflow-hidden rounded-lg">
        <MoviePoster
          src={movie.posterUrl}
          alt={movie.title}
          aspect="poster"
          overlayBadge={<RightsBadge rights={movie.rightsStatus} />}
        />

        {/* Quick action buttons on poster hover */}
        <div className="absolute inset-x-2 bottom-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleHeart}
            aria-label="Add to favourites"
            className="w-9 h-9 rounded-full bg-black/70 backdrop-blur-md text-white hover:text-red-400 border border-white/10 flex items-center justify-center transition-transform hover:scale-105"
          >
            <Heart className={`w-4 h-4 ${favourited ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleQuickDownload}
              aria-label="Download movie"
              title="Download 1080p"
              className="w-9 h-9 rounded-full bg-black/70 backdrop-blur-md text-white hover:text-white border border-white/10 flex items-center justify-center transition-transform hover:scale-105"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handlePlayDirect}
              aria-label="Play online"
              title="Play online"
              className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center transition-transform hover:scale-105 shadow-md"
            >
              <Play className="w-4 h-4 fill-black translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-2 space-y-0.5">
        <h3 className="font-display font-semibold text-sm text-white group-hover:text-slate-200 truncate">
          {movie.title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono-nums">
          <span>{movie.year}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="truncate">{movie.category}</span>
        </div>
        <div className="text-[11px] text-slate-500 truncate pt-0.5">
          {movie.provider}
        </div>
      </div>
    </div>
  );
};
