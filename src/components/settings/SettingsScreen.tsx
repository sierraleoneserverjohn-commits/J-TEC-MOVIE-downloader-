import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageIndicator } from '../common/StorageIndicator';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { 
  Sliders, 
  Download, 
  HardDrive, 
  Globe2, 
  ShieldCheck, 
  Info, 
  Wifi, 
  Smartphone, 
  Folder, 
  Trash2, 
  Check, 
  RefreshCw, 
  Film,
  ExternalLink,
  Server,
  Activity
} from 'lucide-react';
import { ApiService } from '../../services/apiService';

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, showToast, setCurrentTab, backendHealth, isNativeAndroid } = useApp();
  const [testingConnection, setTestingConnection] = useState(false);

  const [cacheSize, setCacheSize] = useState('48.4 MB');
  const [showClearCacheModal, setShowClearCacheModal] = useState(false);
  const [showResetDataModal, setShowResetDataModal] = useState(false);

  const handleClearCache = () => {
    setCacheSize('0.0 MB');
    setShowClearCacheModal(false);
    showToast('Image and archive metadata cache cleared', 'success');
  };

  const handleResetData = () => {
    localStorage.removeItem('jtec_settings_v1');
    setShowResetDataModal(false);
    showToast('Application state reset to defaults', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  const toggleProvider = (key: keyof typeof settings.providers) => {
    const current = settings.providers[key];
    updateSettings({
      providers: {
        ...settings.providers,
        [key]: { ...current, enabled: !current.enabled }
      }
    });
    showToast(`${!current.enabled ? 'Enabled' : 'Disabled'} provider`, 'info');
  };

  const handleTestBackend = async () => {
    setTestingConnection(true);
    const health = await ApiService.checkHealth();
    setTestingConnection(false);
    if (health) {
      showToast(`Connected to Render backend (${health.service} v${health.version}) · Redis: ${health.cache.status}`, 'success');
    } else {
      showToast('Render backend unreachable or in sleep mode. Operating in offline archive mode.', 'warning');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-28 md:pb-16 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">Application Settings</h1>
        <p className="text-xs text-slate-400">Configure storage paths, public archive integrations, and offline behavior</p>
      </div>

      {/* SECTION A: GENERAL SETTINGS */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Sliders className="w-4 h-4 text-slate-400" />
          <h2 className="text-xs uppercase tracking-wider font-mono-nums font-semibold text-slate-300">
            A. General Preferences
          </h2>
        </div>

        <div className="bg-[#111317] border border-white/5 rounded-2xl p-4 sm:p-5 space-y-4">
          {/* Appearance */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
            <div>
              <span className="text-xs font-semibold text-white">Appearance Theme</span>
              <p className="text-[11px] text-slate-400">Optimized for OLED displays and battery savings</p>
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-[#090a0d] rounded-lg border border-white/5">
              {[
                { id: 'dark', label: 'Dark Charcoal' },
                { id: 'amoled', label: 'AMOLED Black' },
                { id: 'slate', label: 'Slate Dark' },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => updateSettings({ appearance: theme.id as any })}
                  className={`px-3 py-1 rounded-md text-xs font-mono-nums transition-all ${
                    settings.appearance === theme.id
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          {/* Default Landing Page */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
            <div>
              <span className="text-xs font-semibold text-white">Default Landing Page</span>
              <p className="text-[11px] text-slate-400">Initial view shown when opening JTEC MOVIES</p>
            </div>
            <select
              value={settings.defaultLandingPage}
              onChange={(e) => updateSettings({ defaultLandingPage: e.target.value as any })}
              className="h-9 px-3 rounded-lg bg-[#090a0d] border border-white/10 text-xs text-slate-200 focus:outline-none font-mono-nums"
            >
              <option value="home">Featured Home</option>
              <option value="discover">Discover Catalog</option>
              <option value="library">My Offline Library</option>
            </select>
          </div>

          {/* Smooth Animations */}
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/5">
            <div>
              <span className="text-xs font-semibold text-white">Smooth Transitions</span>
              <p className="text-[11px] text-slate-400">Respect low-power Android performance mode</p>
            </div>
            <button
              onClick={() => updateSettings({ animations: !settings.animations })}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.animations ? 'bg-red-600' : 'bg-[#22252e]'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.animations ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-white">Download Notifications</span>
              <p className="text-[11px] text-slate-400">Alert when movie transfers complete in background</p>
            </div>
            <button
              onClick={() => updateSettings({ notifications: !settings.notifications })}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.notifications ? 'bg-red-600' : 'bg-[#22252e]'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.notifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION B: DOWNLOAD SETTINGS */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Download className="w-4 h-4 text-slate-400" />
          <h2 className="text-xs uppercase tracking-wider font-mono-nums font-semibold text-slate-300">
            B. Android Download Settings
          </h2>
        </div>

        <div className="bg-[#111317] border border-white/5 rounded-2xl p-4 sm:p-5 space-y-4">
          {/* Quality Preference */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
            <div>
              <span className="text-xs font-semibold text-white">Default Quality Preference</span>
              <p className="text-[11px] text-slate-400">Auto-selected resolution when tapping download</p>
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-[#090a0d] rounded-lg border border-white/5">
              {(['1080p', '720p', '480p'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => updateSettings({ downloadQuality: q })}
                  className={`px-3 py-1 rounded-md text-xs font-mono-nums transition-all ${
                    settings.downloadQuality === q
                      ? 'bg-white text-black font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Wi-Fi Only */}
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <Wifi className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-xs font-semibold text-white">Download on Wi-Fi Only</span>
                <p className="text-[11px] text-slate-400">Pause transfers when on cellular data</p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ wifiOnly: !settings.wifiOnly })}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.wifiOnly ? 'bg-red-600' : 'bg-[#22252e]'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.wifiOnly ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Large file confirmation */}
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/5">
            <div>
              <span className="text-xs font-semibold text-white">Ask Before Large Files (&gt;1 GB)</span>
              <p className="text-[11px] text-slate-400">Display confirmation modal before high-res 1080p transfers</p>
            </div>
            <button
              onClick={() => updateSettings({ askBeforeLarge: !settings.askBeforeLarge })}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.askBeforeLarge ? 'bg-red-600' : 'bg-[#22252e]'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.askBeforeLarge ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Auto Add to Library */}
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/5">
            <div>
              <span className="text-xs font-semibold text-white">Auto-Add Completed Files to Library</span>
              <p className="text-[11px] text-slate-400">Automatically register completed downloads into My Library</p>
            </div>
            <button
              onClick={() => updateSettings({ autoAddToLibrary: !settings.autoAddToLibrary })}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.autoAddToLibrary ? 'bg-red-600' : 'bg-[#22252e]'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.autoAddToLibrary ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Download Location */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <Folder className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-xs font-semibold text-white">Android Storage Target</span>
                <p className="text-[11px] font-mono-nums text-slate-400">{settings.downloadLocation}</p>
              </div>
            </div>
            <span className="text-[11px] font-mono-nums text-slate-500 bg-black/40 px-2 py-1 rounded border border-white/5">
              Android Scoped Storage
            </span>
          </div>
        </div>
      </section>

      {/* SECTION C: STORAGE MANAGEMENT */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <HardDrive className="w-4 h-4 text-slate-400" />
          <h2 className="text-xs uppercase tracking-wider font-mono-nums font-semibold text-slate-300">
            C. Storage & Cache Overview
          </h2>
        </div>

        <StorageIndicator />

        <div className="bg-[#111317] border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-white">Thumbnail & Image Cache</span>
            <p className="text-[11px] text-slate-400">
              Temporary posters and artwork cache: <strong className="text-slate-200 font-mono-nums">{cacheSize}</strong>
            </p>
          </div>
          <button
            onClick={() => setShowClearCacheModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-white border border-white/10 transition-colors"
          >
            Clear Image Cache
          </button>
        </div>
      </section>

      {/* SECTION D: MOVIE PROVIDERS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-slate-400" />
            <h2 className="text-xs uppercase tracking-wider font-mono-nums font-semibold text-slate-300">
              D. Public Archive Providers
            </h2>
          </div>
          <span className="text-[10px] font-mono-nums text-slate-500">
            Status: Ping Checked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              key: 'internetArchive' as const,
              name: 'Internet Archive',
              status: settings.providers.internetArchive.status,
              lastSync: settings.providers.internetArchive.lastSync,
              notes: 'Public Domain & Prelinger sub-collections',
              enabled: settings.providers.internetArchive.enabled
            },
            {
              key: 'libraryOfCongress' as const,
              name: 'Library of Congress',
              status: settings.providers.libraryOfCongress.status,
              lastSync: settings.providers.libraryOfCongress.lastSync,
              notes: 'National Film Registry preservation files',
              enabled: settings.providers.libraryOfCongress.enabled
            },
            {
              key: 'wikimediaCommons' as const,
              name: 'Wikimedia Commons',
              status: settings.providers.wikimediaCommons.status,
              lastSync: settings.providers.wikimediaCommons.lastSync,
              notes: 'Open video media repository under CC / CC0',
              enabled: settings.providers.wikimediaCommons.enabled
            },
            {
              key: 'prelingerArchives' as const,
              name: 'Prelinger Archives',
              status: settings.providers.prelingerArchives.status,
              lastSync: settings.providers.prelingerArchives.lastSync,
              notes: 'Historic advertising, education, and noir film',
              enabled: settings.providers.prelingerArchives.enabled
            },
          ].map((prov) => (
            <div
              key={prov.key}
              className="p-4 rounded-xl bg-[#111317] border border-white/5 flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">{prov.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-400">{prov.notes}</p>
                <div className="flex items-center gap-2 text-[10px] font-mono-nums text-slate-500 pt-0.5">
                  <span>Status: {prov.status}</span>
                  <span aria-hidden="true">·</span>
                  <span>Checked: {prov.lastSync}</span>
                </div>
              </div>

              <button
                onClick={() => toggleProvider(prov.key)}
                className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${
                  prov.enabled ? 'bg-red-600' : 'bg-[#22252e]'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    prov.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION E: INFRASTRUCTURE & DEPLOYMENT STATUS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-400" />
            <h2 className="text-xs uppercase tracking-wider font-mono-nums font-semibold text-slate-300">
              E. Cloud Infrastructure &amp; Runtime
            </h2>
          </div>
          <button
            onClick={handleTestBackend}
            disabled={testingConnection}
            className="text-[11px] font-mono-nums text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${testingConnection ? 'animate-spin' : ''}`} />
            <span>Test Health Endpoint</span>
          </button>
        </div>

        <div className="bg-[#111317] border border-white/5 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Render Backend */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-mono-nums tracking-wider text-slate-400">
                Render Backend
              </span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${backendHealth ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span className="text-xs font-semibold text-white">
                  {backendHealth ? 'Render Live' : 'Ready / Standby'}
                </span>
              </div>
              <p className="text-[11px] font-mono-nums text-slate-400 truncate">
                {ApiService.getBaseUrl() || 'Embedded Fallback Mode'}
              </p>
            </div>

            {/* Upstash Redis */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-mono-nums tracking-wider text-slate-400">
                Upstash Redis Cache
              </span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${backendHealth?.cache.connected ? 'bg-emerald-400' : 'bg-sky-400'}`} />
                <span className="text-xs font-semibold text-white">
                  {backendHealth?.cache.connected ? 'Upstash Connected' : 'REST Cache Ready'}
                </span>
              </div>
              <p className="text-[11px] font-mono-nums text-slate-400">
                Metadata &amp; Search Rate Limiting
              </p>
            </div>

            {/* Runtime Container */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-mono-nums tracking-wider text-slate-400">
                Client Runtime
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-white">
                  {isNativeAndroid ? 'Android Native (Capacitor)' : 'Web Browser SPA'}
                </span>
              </div>
              <p className="text-[11px] font-mono-nums text-slate-400">
                Offline Playback Supported
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION F: PRIVACY & RIGHTS */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <h2 className="text-xs uppercase tracking-wider font-mono-nums font-semibold text-slate-300">
            F. Privacy, Legal &amp; Rights Verification
          </h2>
        </div>

        <div className="bg-[#111317] border border-white/5 rounded-2xl p-4 sm:p-5 space-y-3 text-xs text-slate-300">
          <p className="leading-relaxed">
            <strong className="text-white">Legal Notice:</strong> JTEC MOVIES indexes materials from legitimate open cultural repositories including the Library of Congress and Internet Archive. No unauthorized commercial streaming or copyright infringement is permitted.
          </p>
          <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400 font-mono-nums">
              Attribution: CC BY-SA 4.0 &amp; Public Domain Worldwide
            </span>
            <button
              onClick={() => setShowResetDataModal(true)}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Local Application Data</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION G: ABOUT JTEC MOVIES */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Info className="w-4 h-4 text-slate-400" />
          <h2 className="text-xs uppercase tracking-wider font-mono-nums font-semibold text-slate-300">
            G. About JTEC MOVIES
          </h2>
        </div>

        <div className="bg-[#111317] border border-white/5 rounded-2xl p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center text-white mx-auto shadow-inner">
            <Film className="w-6 h-6 text-red-500" />
          </div>

          <div>
            <div className="flex items-center justify-center gap-2">
              <span className="font-display font-black text-xl text-white tracking-tight">JTEC</span>
              <span className="font-display font-medium text-sm tracking-widest text-slate-400">MOVIES</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono-nums">
              Version 1.0.4-preview · Android-First Cinema Architecture
            </p>
          </div>

          <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
            A premium mobile-first discovery client designed for legal public archive cinema, historical documentaries, and native Android offline storage. Built with React, TypeScript, and modern mobile touch ergonomics.
          </p>

          <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-center gap-4 text-xs font-mono-nums text-slate-400">
            <span>Architected for Capacitor &amp; Android APK</span>
            <span aria-hidden="true">·</span>
            <span>Zero-AI-Slop Visual Constitution</span>
            <span aria-hidden="true">·</span>
            <span>Open Source Registry</span>
          </div>
        </div>
      </section>

      {/* Modals */}
      <ConfirmationDialog
        isOpen={showClearCacheModal}
        title="Clear Image Cache?"
        message="This will remove temporarily cached posters and artwork images from application memory. Movie video files on your device storage will not be affected."
        confirmLabel="Clear Cache"
        onConfirm={handleClearCache}
        onCancel={() => setShowClearCacheModal(false)}
      />

      <ConfirmationDialog
        isOpen={showResetDataModal}
        title="Reset Application State?"
        message="This will reset all user preferences, downloads list, and stored settings to the default demonstration configuration."
        confirmLabel="Reset Everything"
        isDestructive={true}
        onConfirm={handleResetData}
        onCancel={() => setShowResetDataModal(false)}
      />
    </div>
  );
};
