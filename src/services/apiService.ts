import { Movie } from '../types/movie';
import { MOCK_MOVIES } from '../data/mockMovies';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export interface BackendHealthResponse {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  uptimeSeconds: number;
  cache: {
    provider: string;
    status: string;
    connected: boolean;
  };
  capabilities: string[];
}

export class ApiService {
  public static getBaseUrl(): string {
    return API_BASE_URL;
  }

  public static isConfigured(): boolean {
    return Boolean(API_BASE_URL);
  }

  public static async checkHealth(): Promise<BackendHealthResponse | null> {
    if (!API_BASE_URL) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(4000),
      });

      if (!response.ok) return null;
      return (await response.json()) as BackendHealthResponse;
    } catch (err) {
      console.warn('[ApiService] Backend health check unreachable:', err);
      return null;
    }
  }

  public static async fetchMovies(category?: string, provider?: string): Promise<Movie[]> {
    if (API_BASE_URL) {
      try {
        const params = new URLSearchParams();
        if (category && category !== 'All') params.set('category', category);
        if (provider && provider !== 'All') params.set('provider', provider);

        const response = await fetch(`${API_BASE_URL}/api/movies?${params.toString()}`, {
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          const json = await response.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            return json.data;
          }
        }
      } catch (err) {
        console.warn('[ApiService] Remote fetch failed, falling back to local archive catalog:', err);
      }
    }

    // Offline / Fallback
    return MOCK_MOVIES;
  }

  public static async searchMovies(query: string): Promise<Movie[]> {
    if (API_BASE_URL && query.trim()) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/movies/search?q=${encodeURIComponent(query)}`, {
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          const json = await response.json();
          if (json.success && Array.isArray(json.data)) {
            return json.data;
          }
        }
      } catch (err) {
        console.warn('[ApiService] Remote search failed, searching local catalog:', err);
      }
    }

    // Local search fallback
    const q = query.toLowerCase();
    return MOCK_MOVIES.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.creator.toLowerCase().includes(q) ||
        m.synopsis.toLowerCase().includes(q)
    );
  }
}
