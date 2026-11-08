import React from 'react';
import { useApp } from '../../context/AppContext';
import { HardDrive, Info } from 'lucide-react';

export const StorageIndicator: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { storageInfo } = useApp();

  const movieStorageGB = (storageInfo.usedByMoviesBytes / (1024 * 1024 * 1024)).toFixed(2);
  const moviePercent = ((storageInfo.usedByMoviesBytes / (storageInfo.totalGB * 1024 * 1024 * 1024)) * 100).toFixed(1);
  const systemPercent = ((storageInfo.systemGB / storageInfo.totalGB) * 100).toFixed(1);

  if (compact) {
    return (
      <div className="flex items-center justify-between text-xs text-slate-400 py-1 font-mono-nums">
        <span className="flex items-center gap-1.5 text-slate-300">
          <HardDrive className="w-3.5 h-3.5 text-slate-400" />
          <span>Device Storage</span>
        </span>
        <span>
          <strong className="text-white">{storageInfo.availableGB} GB</strong> free of {storageInfo.totalGB} GB
        </span>
      </div>
    );
  }

  return (
    <div className="bg-[#111317] border border-white/5 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-300">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Android Storage</span>
              <span className="text-[10px] uppercase font-mono-nums tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                Simulated Device
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono-nums">
              Internal Storage · /storage/emulated/0
            </p>
          </div>
        </div>

        <div className="text-right font-mono-nums">
          <div className="text-sm font-bold text-white">{storageInfo.availableGB} GB free</div>
          <div className="text-[11px] text-slate-400">of {storageInfo.totalGB} GB total</div>
        </div>
      </div>

      {/* Segmented bar */}
      <div className="space-y-1.5">
        <div className="h-2 w-full bg-[#1e222b] rounded-full overflow-hidden flex">
          {/* System/Other apps */}
          <div
            style={{ width: `${systemPercent}%` }}
            className="h-full bg-slate-600 transition-all duration-500"
            title={`System & Other Apps: ${storageInfo.systemGB} GB`}
          />
          {/* JTEC Movies downloads */}
          <div
            style={{ width: `${moviePercent}%` }}
            className="h-full bg-red-600 transition-all duration-500"
            title={`JTEC Movies: ${movieStorageGB} GB`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono-nums pt-1">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>JTEC Movies: <strong className="text-slate-200">{movieStorageGB} GB</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-600" />
              <span>System / Apps: <strong className="text-slate-200">{storageInfo.systemGB} GB</strong></span>
            </span>
          </div>
          <span className="hidden sm:inline text-slate-500 flex items-center gap-1">
            <Info className="w-3 h-3" /> Android 14 Scope Storage
          </span>
        </div>
      </div>
    </div>
  );
};
