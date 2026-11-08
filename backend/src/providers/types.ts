export type ArchiveProviderName =
  | 'Internet Archive'
  | 'Library of Congress'
  | 'Wikimedia Commons'
  | 'Prelinger Archives';

export interface ProviderMovieFormat {
  id: string;
  resolution: '1080p' | '720p' | '480p' | '360p';
  format: 'MP4' | 'WebM' | 'MKV';
  fileSizeBytes: number;
  fileSizeFormatted: string;
  bitrate: string;
  directDownloadUrl: string; // Direct authorized provider link! Never proxied through Render!
  verifiedChecksum: string;
}

export interface ProviderMovieRecord {
  id: string;
  title: string;
  year: number;
  runtime: string;
  category: string;
  synopsis: string;
  description: string;
  creator: string;
  provider: ArchiveProviderName;
  providerId: string;
  rightsStatus: 'Public Domain' | 'Creative Commons' | 'Open Access' | 'Rights Review';
  rightsAttribution: string;
  backdropUrl: string;
  posterUrl: string;
  formats: ProviderMovieFormat[];
  playableStreamUrl?: string;
  lastIndexed: string;
}
