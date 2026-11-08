import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppHeader } from './components/common/AppHeader';
import { BottomNavigation } from './components/common/BottomNavigation';
import { ToastNotification } from './components/common/ToastNotification';
import { MovieDetailsModal } from './components/details/MovieDetailsModal';
import { VideoPlayerModal } from './components/player/VideoPlayerModal';
import { HomeScreen } from './components/home/HomeScreen';
import { DiscoverScreen } from './components/discover/DiscoverScreen';
import { DownloadsScreen } from './components/downloads/DownloadsScreen';
import { LibraryScreen } from './components/library/LibraryScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';

const MainLayout: React.FC = () => {
  const { currentTab, settings } = useApp();

  const themeClass = 
    settings.appearance === 'amoled'
      ? 'bg-black text-white'
      : settings.appearance === 'slate'
      ? 'bg-[#0f1117] text-slate-100'
      : 'bg-[#090a0d] text-slate-100';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${themeClass}`}>
      {/* Top Header */}
      <AppHeader />

      {/* Main Viewport Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        {currentTab === 'home' && <HomeScreen />}
        {currentTab === 'discover' && <DiscoverScreen />}
        {currentTab === 'downloads' && <DownloadsScreen />}
        {currentTab === 'library' && <LibraryScreen />}
        {currentTab === 'settings' && <SettingsScreen />}
      </main>

      {/* Modals & Overlays */}
      <MovieDetailsModal />
      <VideoPlayerModal />
      <ToastNotification />

      {/* Mobile Fixed 5-Item Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
