import React, { useState } from 'react';
import { Film } from 'lucide-react';

interface MoviePosterProps {
  src: string;
  alt: string;
  aspect?: 'poster' | 'landscape';
  className?: string;
  overlayBadge?: React.ReactNode;
}

export const MoviePoster: React.FC<MoviePosterProps> = ({
  src,
  alt,
  aspect = 'poster',
  className = '',
  overlayBadge
}) => {
  const [hasError, setHasError] = useState(false);
  const aspectClass = aspect === 'poster' ? 'aspect-[2/3]' : 'aspect-video';

  return (
    <div className={`relative overflow-hidden bg-[#13151a] rounded-lg border border-white/5 select-none ${aspectClass} ${className}`}>
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-[#181a20] to-[#0e1014]">
          <Film className="w-8 h-8 text-neutral-600 mb-2" />
          <span className="text-xs font-medium text-neutral-400 line-clamp-2 px-1">{alt}</span>
          <span className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wider font-mono-nums">Archival Print</span>
        </div>
      )}

      {/* Subtle vignette scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

      {overlayBadge && (
        <div className="absolute top-2 left-2 z-10 pointer-events-none">
          {overlayBadge}
        </div>
      )}
    </div>
  );
};
