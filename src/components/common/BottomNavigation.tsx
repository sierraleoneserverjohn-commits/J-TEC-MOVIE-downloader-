import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Compass, Download, Library, Settings } from 'lucide-react';
import { NavigationTab } from '../../types/movie';

export const BottomNavigation: React.FC = () => {
  const { currentTab, setCurrentTab, downloads } = useApp();

  const activeDownloadsCount = downloads.filter((d) => d.status === 'active').length;

  const tabs: Array<{ id: NavigationTab; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'library', label: 'My Library', icon: Library },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-[#0c0e12]/95 backdrop-blur-md border-t border-white/5 pb-safe transition-all md:hidden"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`relative flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] py-1 transition-colors select-none ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-white' : 'text-slate-400'
                  }`}
                />
                {tab.id === 'downloads' && activeDownloadsCount > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-[14px] rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center font-mono-nums">
                    {activeDownloadsCount}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] tracking-tight mt-1 transition-all ${
                  isActive ? 'font-semibold text-white' : 'font-normal text-slate-400'
                }`}
              >
                {tab.label}
              </span>

              {/* Minimal active highlight bar */}
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-red-500 transition-all" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
