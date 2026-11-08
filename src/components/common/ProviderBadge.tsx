import React from 'react';
import { ArchiveProvider, RightsStatus } from '../../types/movie';
import { Landmark, Globe, Archive, Film } from 'lucide-react';

export const ProviderBadge: React.FC<{ provider: ArchiveProvider; size?: 'sm' | 'md' }> = ({
  provider,
  size = 'sm'
}) => {
  const getIcon = () => {
    switch (provider) {
      case 'Library of Congress':
        return <Landmark className={size === 'sm' ? 'w-3 h-3 text-amber-400' : 'w-3.5 h-3.5 text-amber-400'} />;
      case 'Internet Archive':
        return <Archive className={size === 'sm' ? 'w-3 h-3 text-sky-400' : 'w-3.5 h-3.5 text-sky-400'} />;
      case 'Wikimedia Commons':
        return <Globe className={size === 'sm' ? 'w-3 h-3 text-emerald-400' : 'w-3.5 h-3.5 text-emerald-400'} />;
      case 'Prelinger Archives':
        return <Film className={size === 'sm' ? 'w-3 h-3 text-indigo-400' : 'w-3.5 h-3.5 text-indigo-400'} />;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium text-slate-300 ${size === 'sm' ? 'text-xs' : 'text-xs'}`}>
      {getIcon()}
      <span className="truncate">{provider}</span>
    </span>
  );
};

export const RightsBadge: React.FC<{ rights: RightsStatus; size?: 'sm' | 'md' }> = ({
  rights,
  size = 'sm'
}) => {
  const isPublicDomain = rights === 'Public Domain';

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono-nums ${
        size === 'sm' ? 'text-[11px]' : 'text-xs'
      } ${
        isPublicDomain
          ? 'text-emerald-400'
          : rights === 'Creative Commons'
          ? 'text-sky-400'
          : 'text-amber-400'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75 shrink-0" />
      <span className="uppercase tracking-wider font-semibold">{rights}</span>
    </span>
  );
};
