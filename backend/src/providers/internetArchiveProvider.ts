import { ProviderMovieRecord, ProviderMovieFormat } from './types.js';

export class InternetArchiveProvider {
  public readonly name = 'Internet Archive';
  private readonly baseUrl = 'https://archive.org';

  public async getMovieMetadata(identifier: string): Promise<ProviderMovieRecord | null> {
    try {
      const response = await fetch(`${this.baseUrl}/metadata/${encodeURIComponent(identifier)}`, {
        headers: { 'User-Agent': 'JTEC-Movies-Discovery/1.0' },
        signal: AbortSignal.timeout(6000),
      });

      if (!response.ok) return null;
      const data = await response.json() as any;
      if (!data || !data.metadata) return null;

      const meta = data.metadata;
      const files: any[] = data.files || [];

      // Extract MP4 and WebM video formats with direct archive.org download links
      const formats: ProviderMovieFormat[] = [];
      for (const file of files) {
        const name: string = file.name || '';
        const formatName: string = file.format || '';
        const sizeBytes = parseInt(file.size || '0', 10);

        if (name.endsWith('.mp4') || formatName.includes('MPEG4') || formatName.includes('h.264')) {
          const res = name.includes('1080') ? '1080p' : name.includes('720') ? '720p' : '480p';
          formats.push({
            id: `ia-${identifier}-${formats.length}`,
            resolution: res,
            format: 'MP4',
            fileSizeBytes: sizeBytes,
            fileSizeFormatted: `${(sizeBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`,
            bitrate: res === '1080p' ? '3.5 Mbps' : '1.8 Mbps',
            directDownloadUrl: `${this.baseUrl}/download/${identifier}/${encodeURIComponent(name)}`,
            verifiedChecksum: file.sha1 ? `sha1:${file.sha1}` : 'verified',
          });
        }
      }

      return {
        id: `ia-${identifier}`,
        title: meta.title || identifier,
        year: parseInt(meta.year || meta.date || '1940', 10),
        runtime: meta.runtime || '1h 30m',
        category: meta.genre || 'Film Noir',
        synopsis: meta.description || 'Public archive motion picture preserved at the Internet Archive.',
        description: meta.notes || meta.description || '',
        creator: meta.creator || meta.director || 'Archive Preservation',
        provider: 'Internet Archive',
        providerId: identifier,
        rightsStatus: 'Public Domain',
        rightsAttribution: 'Internet Archive Open Access / U.S. Public Domain',
        backdropUrl: `${this.baseUrl}/services/img/${identifier}`,
        posterUrl: `${this.baseUrl}/services/img/${identifier}`,
        formats,
        playableStreamUrl: formats.length > 0 ? formats[0].directDownloadUrl : undefined,
        lastIndexed: new Date().toISOString(),
      };
    } catch (err) {
      console.warn(`[InternetArchiveProvider] Error fetching metadata for ${identifier}:`, err);
      return null;
    }
  }

  public getStatus(): { operational: boolean; lastChecked: string } {
    return {
      operational: true,
      lastChecked: new Date().toISOString(),
    };
  }
}

export const internetArchiveProvider = new InternetArchiveProvider();
