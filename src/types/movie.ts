export type ArchiveProvider = 
  | 'Internet Archive' 
  | 'Library of Congress' 
  | 'Wikimedia Commons' 
  | 'Prelinger Archives';

export type RightsStatus = 
  | 'Public Domain' 
  | 'Creative Commons' 
  | 'Open Access' 
  | 'Rights Review';

export type MovieCategory = 
  | 'Film Noir' 
  | 'Sci-Fi Classic' 
  | 'Silent Expressionism' 
  | 'Archival Documentary' 
  | 'Historical Drama' 
  | 'African Cinema' 
  | 'Educational Cinema'
  | 'Comedy Classic';

export interface MovieFileFormat {
  id: string;
  resolution: '1080p' | '720p' | '480p' | '360p';
  format: 'MP4' | 'WebM' | 'MKV';
  fileSizeBytes: number;
  fileSizeFormatted: string;
  bitrate: string;
  verifiedChecksum: string;
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  runtime: string;
  category: MovieCategory;
  synopsis: string;
  description: string;
  creator: string; // Director or primary creator
  provider: ArchiveProvider;
  providerId: string;
  rightsStatus: RightsStatus;
  rightsAttribution: string;
  backdropUrl: string;
  posterUrl: string;
  featured?: boolean;
  trendingScore: number;
  releaseDecade: '1900s' | '1920s' | '1930s' | '1940s' | '1950s' | '1960s' | '1970s';
  formats: MovieFileFormat[];
  hasPlayableStream: boolean;
  demoVideoUrl?: string;
}

export type DownloadStatus = 'active' | 'queued' | 'completed' | 'failed' | 'paused';

export interface DownloadItem {
  id: string;
  movieId: string;
  movieTitle: string;
  posterUrl: string;
  backdropUrl: string;
  provider: ArchiveProvider;
  resolution: string;
  format: string;
  totalBytes: number;
  downloadedBytes: number;
  progress: number; // 0 - 100
  status: DownloadStatus;
  speed: string; // e.g. "4.8 MB/s"
  eta: string; // e.g. "1m 32s"
  addedAt: number;
  completedAt?: number;
  localPath: string;
}

export interface LibraryItem {
  id: string;
  movieId: string;
  title: string;
  year: number;
  category: MovieCategory;
  runtime: string;
  posterUrl: string;
  backdropUrl: string;
  provider: ArchiveProvider;
  rightsStatus: RightsStatus;
  fileSizeFormatted: string;
  fileSizeBytes: number;
  resolution: string;
  format: string;
  addedToLibraryDate: string;
  localFilePath: string;
}

export interface UserSettings {
  appearance: 'dark' | 'amoled' | 'slate';
  downloadQuality: '1080p' | '720p' | '480p';
  wifiOnly: boolean;
  allowMobileData: boolean;
  askBeforeLarge: boolean;
  concurrentDownloads: number;
  downloadLocation: string;
  autoAddToLibrary: boolean;
  defaultLandingPage: 'home' | 'discover' | 'library';
  animations: boolean;
  notifications: boolean;
  providers: {
    internetArchive: { enabled: boolean; lastSync: string; status: 'Operational' | 'Degraded' | 'Checking' };
    libraryOfCongress: { enabled: boolean; lastSync: string; status: 'Operational' | 'Degraded' | 'Checking' };
    wikimediaCommons: { enabled: boolean; lastSync: string; status: 'Operational' | 'Degraded' | 'Checking' };
    prelingerArchives: { enabled: boolean; lastSync: string; status: 'Operational' | 'Degraded' | 'Checking' };
  };
}

export type NavigationTab = 'home' | 'discover' | 'downloads' | 'library' | 'settings';
