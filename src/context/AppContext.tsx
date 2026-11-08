import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Movie, 
  DownloadItem, 
  LibraryItem, 
  UserSettings, 
  NavigationTab, 
  MovieFileFormat 
} from '../types/movie';
import { 
  MOCK_MOVIES, 
  INITIAL_LIBRARY_ITEMS, 
  INITIAL_DOWNLOADS 
} from '../data/mockMovies';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}

interface AppContextType {
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  selectedMovie: Movie | null;
  setSelectedMovie: (movie: Movie | null) => void;
  playingMovie: { movie: Movie; isOffline?: boolean } | null;
  setPlayingMovie: (payload: { movie: Movie; isOffline?: boolean } | null) => void;
  downloads: DownloadItem[];
  library: LibraryItem[];
  favourites: string[];
  toggleFavourite: (movieId: string) => void;
  isFavourite: (movieId: string) => boolean;
  startDownload: (movie: Movie, format: MovieFileFormat) => void;
  pauseDownload: (id: string) => void;
  resumeDownload: (id: string) => void;
  cancelDownload: (id: string) => void;
  retryDownload: (id: string) => void;
  clearCompletedDownloads: () => void;
  removeFromLibrary: (id: string) => void;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void;
  removeToast: (id: string) => void;
  // Storage calculations
  storageInfo: {
    totalGB: number;
    usedByMoviesBytes: number;
    usedByMoviesFormatted: string;
    availableGB: number;
    systemGB: number;
    percentUsed: number;
  };
  // Search state across screens
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  appearance: 'dark',
  downloadQuality: '1080p',
  wifiOnly: true,
  allowMobileData: false,
  askBeforeLarge: true,
  concurrentDownloads: 2,
  downloadLocation: '/storage/emulated/0/Movies/JTEC',
  autoAddToLibrary: true,
  defaultLandingPage: 'home',
  animations: true,
  notifications: true,
  providers: {
    internetArchive: { enabled: true, lastSync: '10 mins ago', status: 'Operational' },
    libraryOfCongress: { enabled: true, lastSync: '1 hour ago', status: 'Operational' },
    wikimediaCommons: { enabled: true, lastSync: '3 hours ago', status: 'Operational' },
    prelingerArchives: { enabled: true, lastSync: 'Yesterday', status: 'Operational' },
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [playingMovie, setPlayingMovie] = useState<{ movie: Movie; isOffline?: boolean } | null>(null);
  const [downloads, setDownloads] = useState<DownloadItem[]>(INITIAL_DOWNLOADS);
  const [library, setLibrary] = useState<LibraryItem[]>(INITIAL_LIBRARY_ITEMS);
  const [favourites, setFavourites] = useState<string[]>(['the-stranger-1946', 'metropolis-1927']);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('jtec_settings_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback to default
    }
    return DEFAULT_SETTINGS;
  });

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('jtec_settings_v1', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving settings', e);
      }
      return updated;
    });
  };

  const showToast = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleFavourite = (movieId: string) => {
    setFavourites((prev) => {
      const exists = prev.includes(movieId);
      if (exists) {
        showToast('Removed from favourites', 'info');
        return prev.filter((id) => id !== movieId);
      } else {
        showToast('Saved to favourites', 'success');
        return [...prev, movieId];
      }
    });
  };

  const isFavourite = (movieId: string) => favourites.includes(movieId);

  // Start realistic download simulation
  const startDownload = (movie: Movie, format: MovieFileFormat) => {
    // Check if already in active downloads
    const existing = downloads.find((d) => d.movieId === movie.id && d.resolution === format.resolution);
    if (existing && existing.status !== 'completed' && existing.status !== 'failed') {
      showToast(`${movie.title} (${format.resolution}) is already downloading`, 'warning');
      setCurrentTab('downloads');
      return;
    }

    const newDownload: DownloadItem = {
      id: `dl-${Date.now()}-${movie.id}`,
      movieId: movie.id,
      movieTitle: movie.title,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl,
      provider: movie.provider,
      resolution: format.resolution,
      format: format.format,
      totalBytes: format.fileSizeBytes,
      downloadedBytes: 0,
      progress: 0,
      status: 'active',
      speed: '5.2 MB/s',
      eta: 'Calculating...',
      addedAt: Date.now(),
      localPath: `${settings.downloadLocation}/${movie.title.replace(/[^a-zA-Z0-9]/g, '_')}_${format.resolution}.${format.format.toLowerCase()}`
    };

    setDownloads((prev) => [newDownload, ...prev]);
    showToast(`Started download: ${movie.title} (${format.resolution})`, 'success');
    setCurrentTab('downloads');
  };

  const pauseDownload = (id: string) => {
    setDownloads((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'paused', speed: 'Paused', eta: '—' } : d))
    );
    showToast('Download paused', 'info');
  };

  const resumeDownload = (id: string) => {
    setDownloads((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'active', speed: '4.9 MB/s', eta: 'Resuming...' } : d))
    );
    showToast('Download resumed', 'info');
  };

  const cancelDownload = (id: string) => {
    const item = downloads.find((d) => d.id === id);
    setDownloads((prev) => prev.filter((d) => d.id !== id));
    if (item) {
      showToast(`Cancelled download: ${item.movieTitle}`, 'info');
    }
  };

  const retryDownload = (id: string) => {
    setDownloads((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: 'active', progress: 5, downloadedBytes: d.totalBytes * 0.05, speed: '4.5 MB/s' }
          : d
      )
    );
    showToast('Retrying download...', 'info');
  };

  const clearCompletedDownloads = () => {
    setDownloads((prev) => prev.filter((d) => d.status !== 'completed'));
    showToast('Cleared completed download history', 'info');
  };

  const removeFromLibrary = (id: string) => {
    const item = library.find((l) => l.id === id);
    setLibrary((prev) => prev.filter((l) => l.id !== id));
    if (item) {
      showToast(`Removed "${item.title}" from device storage`, 'info');
    }
  };

  // Background download simulation ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setDownloads((prevDownloads) => {
        let changed = false;
        const updated = prevDownloads.map((item) => {
          if (item.status !== 'active') return item;

          changed = true;
          // increment 3% to 6% per tick
          const incrementPercent = Math.min(100 - item.progress, Math.floor(Math.random() * 4) + 3);
          const newProgress = Math.min(100, item.progress + incrementPercent);
          const newDownloadedBytes = Math.floor((newProgress / 100) * item.totalBytes);

          // Simulated speed variance
          const speeds = ['4.6 MB/s', '5.1 MB/s', '5.8 MB/s', '4.2 MB/s', '6.1 MB/s'];
          const randomSpeed = speeds[Math.floor(Math.random() * speeds.length)];

          // Remaining seconds
          const remainingBytes = item.totalBytes - newDownloadedBytes;
          const remainingSec = Math.max(1, Math.round(remainingBytes / (5 * 1024 * 1024)));
          const etaText = remainingSec > 60 ? `${Math.floor(remainingSec / 60)}m ${remainingSec % 60}s` : `${remainingSec}s`;

          if (newProgress >= 100) {
            // Completed! Auto add to library if configured
            const originalMovie = MOCK_MOVIES.find((m) => m.id === item.movieId);
            if (settings.autoAddToLibrary) {
              const newLibItem: LibraryItem = {
                id: `lib-${Date.now()}-${item.movieId}`,
                movieId: item.movieId,
                title: item.movieTitle,
                year: originalMovie?.year || 1950,
                category: originalMovie?.category || 'Film Noir',
                runtime: originalMovie?.runtime || '1h 30m',
                posterUrl: item.posterUrl,
                backdropUrl: item.backdropUrl,
                provider: item.provider,
                rightsStatus: originalMovie?.rightsStatus || 'Public Domain',
                fileSizeFormatted: (item.totalBytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB',
                fileSizeBytes: item.totalBytes,
                resolution: item.resolution,
                format: item.format,
                addedToLibraryDate: 'Just now',
                localFilePath: item.localPath
              };

              // Defer state update outside of this map
              setTimeout(() => {
                setLibrary((prevLib) => {
                  const existsInLib = prevLib.some((l) => l.movieId === item.movieId && l.resolution === item.resolution);
                  if (existsInLib) return prevLib;
                  return [newLibItem, ...prevLib];
                });
                showToast(`Download complete: ${item.movieTitle} (${item.resolution}) is in My Library`, 'success');
              }, 100);
            }

            return {
              ...item,
              progress: 100,
              downloadedBytes: item.totalBytes,
              status: 'completed' as const,
              speed: 'Complete',
              eta: 'Saved',
              completedAt: Date.now()
            };
          }

          return {
            ...item,
            progress: newProgress,
            downloadedBytes: newDownloadedBytes,
            speed: randomSpeed,
            eta: etaText
          };
        });

        return changed ? updated : prevDownloads;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [settings.autoAddToLibrary]);

  // Compute total movie storage used
  const totalGB = 128;
  const systemGB = 44.8;
  const libraryBytes = library.reduce((acc, curr) => acc + curr.fileSizeBytes, 0);
  const activeDownloadsBytes = downloads
    .filter((d) => d.status === 'active' || d.status === 'paused')
    .reduce((acc, curr) => acc + curr.downloadedBytes, 0);
  const usedByMoviesBytes = libraryBytes + activeDownloadsBytes;
  const usedByMoviesGB = usedByMoviesBytes / (1024 * 1024 * 1024);
  const availableGB = Math.max(0, Number((totalGB - systemGB - usedByMoviesGB).toFixed(1)));
  const percentUsed = Math.min(100, Math.round(((systemGB + usedByMoviesGB) / totalGB) * 100));

  const storageInfo = {
    totalGB,
    usedByMoviesBytes,
    usedByMoviesFormatted: `${usedByMoviesGB.toFixed(2)} GB`,
    availableGB,
    systemGB,
    percentUsed
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        selectedMovie,
        setSelectedMovie,
        playingMovie,
        setPlayingMovie,
        downloads,
        library,
        favourites,
        toggleFavourite,
        isFavourite,
        startDownload,
        pauseDownload,
        resumeDownload,
        cancelDownload,
        retryDownload,
        clearCompletedDownloads,
        removeFromLibrary,
        settings,
        updateSettings,
        toasts,
        showToast,
        removeToast,
        storageInfo,
        globalSearchQuery,
        setGlobalSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
