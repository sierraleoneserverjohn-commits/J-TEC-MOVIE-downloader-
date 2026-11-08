import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageIndicator } from '../common/StorageIndicator';
import { MoviePoster } from '../common/MoviePoster';
import { MOCK_MOVIES } from '../../data/mockMovies';
import { 
  Download, 
  Pause, 
  Play, 
  X, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Trash2, 
  PlusCircle, 
  HardDrive 
} from 'lucide-react';

export const DownloadsScreen: React.FC = () => {
  const { 
    downloads, 
    pauseDownload, 
    resumeDownload, 
    cancelDownload, 
    retryDownload, 
    clearCompletedDownloads,
    startDownload,
    setPlayingMovie,
    setCurrentTab
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'queued' | 'completed' | 'failed'>('all');

  const filteredDownloads = downloads.filter((d) => {
    if (activeTab === 'all') return true;
    return d.status === activeTab;
  });

  const activeCount = downloads.filter((d) => d.status === 'active').length;
  const queuedCount = downloads.filter((d) => d.status === 'queued').length;
  const completedCount = downloads.filter((d) => d.status === 'completed').length;
  const failedCount = downloads.filter((d) => d.status === 'failed').length;

  const handleSimulateNew = () => {
    // Pick an un-downloaded movie
    const candidate = MOCK_MOVIES.find((m) => !downloads.some((d) => d.movieId === m.id)) || MOCK_MOVIES[2];
    if (candidate && candidate.formats.length > 0) {
      startDownload(candidate, candidate.formats[0]);
    }
  };

  const handlePlayDownloaded = (movieId: string) => {
    const original = MOCK_MOVIES.find((m) => m.id === movieId);
    if (original) {
      setPlayingMovie({ movie: original, isOffline: true });
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 animate-in fade-in duration-300">
      
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">Download Manager</h1>
          <p className="text-xs text-slate-400">Manage offline video files saved directly to Android internal storage</p>
        </div>

        <div className="flex items-center gap-2">
          {completedCount > 0 && (
            <button
              onClick={clearCompletedDownloads}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-medium border border-white/5 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}

          <button
            onClick={handleSimulateNew}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 active:scale-[0.98]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Simulate Demo Download</span>
          </button>
        </div>
      </div>

      {/* Storage Indicator Component */}
      <StorageIndicator />

      {/* Segmented Filter Bar */}
      <div className="flex items-center gap-1 p-1 bg-[#12141a] rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All Transfers', count: downloads.length },
          { id: 'active', label: 'Active', count: activeCount },
          { id: 'queued', label: 'Queued', count: queuedCount },
          { id: 'completed', label: 'Completed', count: completedCount },
          { id: 'failed', label: 'Failed', count: failedCount },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                isSelected
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono-nums px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-black/10 text-black' : 'bg-white/5 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Downloads List */}
      {filteredDownloads.length > 0 ? (
        <div className="space-y-3">
          {filteredDownloads.map((item) => {
            const isCompleted = item.status === 'completed';
            const isPaused = item.status === 'paused';
            const isActive = item.status === 'active';
            const isFailed = item.status === 'failed';
            const isQueued = item.status === 'queued';

            const downloadedMB = (item.downloadedBytes / (1024 * 1024)).toFixed(1);
            const totalMB = (item.totalBytes / (1024 * 1024)).toFixed(1);

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#111317] border border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left: Thumbnail & Metadata */}
                <div className="flex items-center gap-3.5 w-full sm:w-auto">
                  <div className="w-16 h-20 shrink-0 overflow-hidden rounded-lg bg-black border border-white/5">
                    <img
                      src={item.posterUrl}
                      alt={item.movieTitle}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold text-sm text-white truncate max-w-xs sm:max-w-md">
                        {item.movieTitle}
                      </h3>
                      <span className="text-[10px] font-mono-nums px-1.5 py-0.5 rounded bg-white/5 text-slate-300">
                        {item.resolution} · {item.format}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-nums">
                      <span>{item.provider}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-slate-300">
                        {downloadedMB} MB / {totalMB} MB
                      </span>
                    </div>

                    <p className="text-[10px] font-mono-nums text-slate-500 truncate">
                      {item.localPath}
                    </p>
                  </div>
                </div>

                {/* Center / Right: Progress & Status */}
                <div className="w-full sm:w-64 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono-nums">
                    <div className="flex items-center gap-1.5">
                      {isActive && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                      {isPaused && <Pause className="w-3 h-3 text-amber-400" />}
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      {isFailed && <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
                      {isQueued && <Clock className="w-3 h-3 text-slate-400" />}
                      
                      <span className="font-medium text-slate-300 capitalize">
                        {item.status}
                      </span>
                    </div>

                    <span className="text-white font-bold">{item.progress}%</span>
                  </div>

                  {/* Restrained Progress Bar */}
                  <div className="h-1.5 w-full bg-[#1e222a] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${item.progress}%` }}
                      className={`h-full transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-500'
                          : isFailed
                          ? 'bg-red-600'
                          : isPaused
                          ? 'bg-amber-500'
                          : 'bg-red-600'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono-nums text-slate-500">
                    <span>{isActive ? item.speed : isCompleted ? 'Verified SHA256' : item.speed}</span>
                    <span>{isActive ? `ETA: ${item.eta}` : isCompleted ? 'Ready Offline' : item.eta}</span>
                  </div>
                </div>

                {/* Actions Right */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {isActive && (
                    <button
                      onClick={() => pauseDownload(item.id)}
                      title="Pause download"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                  )}

                  {isPaused && (
                    <button
                      onClick={() => resumeDownload(item.id)}
                      title="Resume download"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-400 hover:text-emerald-300"
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  )}

                  {isFailed && (
                    <button
                      onClick={() => retryDownload(item.id)}
                      title="Retry download"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-red-400 hover:text-red-300"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}

                  {isCompleted && (
                    <button
                      onClick={() => handlePlayDownloaded(item.movieId)}
                      className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-200"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>Play</span>
                    </button>
                  )}

                  {!isCompleted && (
                    <button
                      onClick={() => cancelDownload(item.id)}
                      title="Cancel download"
                      className="p-2 rounded-lg bg-white/5 hover:bg-red-950/40 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center space-y-3 bg-[#111317] rounded-2xl border border-white/5 p-6">
          <div className="w-12 h-12 rounded-full bg-white/5 text-slate-400 mx-auto flex items-center justify-center">
            <Download className="w-6 h-6" />
          </div>
          <h3 className="font-display font-semibold text-base text-white">No Downloads in this View</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            There are currently no {activeTab !== 'all' ? activeTab : ''} downloads. You can browse the archive catalog or click below to simulate a demo download to local storage.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentTab('discover')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-white transition-colors"
            >
              Browse Catalog
            </button>
            <button
              onClick={handleSimulateNew}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white shadow-md transition-colors"
            >
              Simulate Demo Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
