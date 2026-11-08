import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Film, Search, Bell, Settings, X, CheckCircle2, CloudDownload } from 'lucide-react';

export const AppHeader: React.FC = () => {
  const { currentTab, setCurrentTab, downloads, storageInfo } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const activeDownloadsCount = downloads.filter((d) => d.status === 'active').length;

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-[#090a0d]/90 backdrop-blur-md border-b border-white/5 pt-safe transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand Left Zone */}
          <div
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center text-white shadow-inner group-hover:border-white/20 transition-all">
              <Film className="w-4 h-4 text-red-500" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-display font-extrabold text-base tracking-tight text-white">
                  JTEC
                </span>
                <span className="font-display font-medium text-xs tracking-widest text-slate-400">
                  MOVIES
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono-nums tracking-wide hidden sm:inline">
                Public Cinema Archive
              </span>
            </div>
          </div>

          {/* Center Navigation Zone for Desktop */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {[
              { id: 'home', label: 'Home' },
              { id: 'discover', label: 'Discover' },
              { id: 'downloads', label: 'Downloads' },
              { id: 'library', label: 'My Library' },
              { id: 'settings', label: 'Settings' },
            ].map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.id === 'downloads' && activeDownloadsCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-red-600 text-[10px] text-white flex items-center justify-center font-mono-nums">
                      {activeDownloadsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Zone */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Quick Search Trigger */}
            <button
              onClick={() => setCurrentTab('discover')}
              aria-label="Search movies"
              className={`p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                currentTab === 'discover' ? 'text-white bg-white/10' : ''
              }`}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notification / Activity drawer */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Activity and notifications"
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                {activeDownloadsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>

              {/* Notification Drawer Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#13151b] border border-white/10 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <span className="text-sm font-semibold text-white">System Activity</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1 text-slate-400 hover:text-white rounded-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 py-3 max-h-72 overflow-y-auto text-xs">
                    {activeDownloadsCount > 0 && (
                      <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-800/30 flex items-start gap-2.5">
                        <CloudDownload className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-slate-200">
                            {activeDownloadsCount} active download{activeDownloadsCount > 1 ? 's' : ''} running
                          </p>
                          <p className="text-slate-400 text-[11px] mt-0.5 font-mono-nums">
                            Saving directly to Android Movies directory
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-200">Archive Index Updated</p>
                        <p className="text-slate-400 text-[11px] mt-0.5 font-mono-nums">
                          Library of Congress & Internet Archive records synced.
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-start gap-2.5">
                      <Film className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-200">Storage Status</p>
                        <p className="text-slate-400 text-[11px] mt-0.5 font-mono-nums">
                          {storageInfo.availableGB} GB available on device storage.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex justify-end">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        setCurrentTab('downloads');
                      }}
                      className="text-xs text-slate-300 hover:text-white font-medium"
                    >
                      View All Downloads →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings Trigger */}
            <button
              onClick={() => setCurrentTab('settings')}
              aria-label="Settings"
              className={`p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                currentTab === 'settings' ? 'text-white bg-white/10' : ''
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
