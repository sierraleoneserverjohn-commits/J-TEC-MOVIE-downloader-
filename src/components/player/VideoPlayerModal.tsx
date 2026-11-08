import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Movie } from '../../types/movie';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  X, 
  Sun, 
  Subtitles, 
  Gauge, 
  Crop,
  AlertCircle
} from 'lucide-react';

interface VideoPlayerContentProps {
  playingMovie: { movie: Movie; isOffline?: boolean };
}

const VideoPlayerContent: React.FC<VideoPlayerContentProps> = ({ playingMovie }) => {
  const { setPlayingMovie } = useApp();
  const { movie, isOffline } = playingMovie;
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [aspectMode, setAspectMode] = useState<'contain' | 'cover' | 'fill'>('contain');
  const [brightness, setBrightness] = useState(100);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showBrightnessSlider, setShowBrightnessSlider] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSpeedMenu(false);
        setShowBrightnessSlider(false);
      }
    }, 3500);
  };

  useEffect(() => {
    handleMouseMove();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const skipSeconds = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      setIsMuted(nextMuted);
      videoRef.current.muted = nextMuted;
    }
  };

  const handleSpeedSelect = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const toggleAspectRatio = () => {
    if (aspectMode === 'contain') setAspectMode('cover');
    else if (aspectMode === 'cover') setAspectMode('fill');
    else setAspectMode('contain');
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) {
      return `${hrs}:${(mins % 60).toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const videoSource = movie.demoVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';

  return (
    <div
      onMouseMove={handleMouseMove}
      onClick={handleMouseMove}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden select-none"
    >
      {/* Video Viewport */}
      <div className="relative w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          src={videoSource}
          autoPlay
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={() => setHasError(true)}
          style={{ filter: `brightness(${brightness}%)` }}
          className={`w-full h-full transition-all ${
            aspectMode === 'contain'
              ? 'object-contain'
              : aspectMode === 'cover'
              ? 'object-cover'
              : 'object-fill'
          }`}
        />

        {/* Subtitles Overlay Simulation */}
        {showSubtitles && (
          <div className="absolute bottom-20 inset-x-0 flex justify-center pointer-events-none px-6 text-center">
            <span className="px-3 py-1 rounded bg-black/80 text-yellow-300 font-medium text-sm sm:text-base backdrop-blur-sm">
              [Archival audio dialogue · {movie.title} ({movie.year})]
            </span>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 pointer-events-none">
            <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono-nums text-slate-300 mt-3">
              Buffering Archival Stream...
            </span>
          </div>
        )}

        {/* Error Fallback State */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-6 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <h3 className="font-display font-bold text-lg text-white">Stream Temporarily Unavailable</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Public archive stream mirror is experiencing network congestion. You can still initiate direct MP4 download to device.
            </p>
            <button
              onClick={() => setPlayingMovie(null)}
              className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white"
            >
              Back to Catalog
            </button>
          </div>
        )}

        {/* Overlay Controls */}
        <div
          className={`absolute inset-0 flex flex-col justify-between p-4 sm:p-6 transition-opacity duration-300 bg-gradient-to-t from-black/90 via-transparent to-black/80 ${
            showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPlayingMovie(null)}
                aria-label="Exit player"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-semibold text-sm sm:text-base text-white">
                    {movie.title}
                  </h2>
                  {isOffline ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 text-[10px] font-mono-nums border border-emerald-800/40">
                      Offline Storage
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-[10px] font-mono-nums">
                      Public Stream
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-mono-nums">
                  {movie.year} · {movie.category} · {movie.provider}
                </p>
              </div>
            </div>

            {/* Top Right Utility Controls */}
            <div className="flex items-center gap-2">
              {/* Brightness button */}
              <div className="relative">
                <button
                  onClick={() => setShowBrightnessSlider(!showBrightnessSlider)}
                  aria-label="Adjust brightness"
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <Sun className="w-4 h-4" />
                </button>
                {showBrightnessSlider && (
                  <div className="absolute right-0 mt-2 p-3 bg-[#13151b] border border-white/10 rounded-xl shadow-xl w-44 z-50 flex items-center gap-2">
                    <Sun className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-red-500"
                    />
                    <span className="text-[10px] font-mono-nums text-slate-400">{brightness}%</span>
                  </div>
                )}
              </div>

              {/* Subtitles toggle */}
              <button
                onClick={() => setShowSubtitles(!showSubtitles)}
                aria-label="Toggle subtitles"
                className={`p-2.5 rounded-full transition-colors ${
                  showSubtitles ? 'bg-red-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Subtitles className="w-4 h-4" />
              </button>

              {/* Aspect ratio */}
              <button
                onClick={toggleAspectRatio}
                aria-label="Cycle aspect ratio"
                title={`Aspect: ${aspectMode}`}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center gap-1"
              >
                <Crop className="w-4 h-4" />
                <span className="text-[10px] uppercase font-mono-nums hidden sm:inline">{aspectMode}</span>
              </button>
            </div>
          </div>

          {/* Center Playback Click Gesture */}
          <div
            onClick={togglePlay}
            className="flex-1 flex items-center justify-center cursor-pointer"
          >
            {!isPlaying && (
              <div className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm transition-transform hover:scale-110">
                <Play className="w-8 h-8 fill-white translate-x-1" />
              </div>
            )}
          </div>

          {/* Bottom Controls Bar */}
          <div className="space-y-3">
            {/* Scrubber seekbar */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-red-600 hover:h-2 transition-all"
              />
              <div className="flex items-center justify-between text-xs font-mono-nums text-slate-400 px-0.5">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-slate-200"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-black" />
                  ) : (
                    <Play className="w-5 h-5 fill-black translate-x-0.5" />
                  )}
                </button>

                <button
                  onClick={() => skipSeconds(-10)}
                  aria-label="Seek back 10 seconds"
                  className="p-2 text-white/80 hover:text-white"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={() => skipSeconds(10)}
                  aria-label="Seek forward 10 seconds"
                  className="p-2 text-white/80 hover:text-white"
                >
                  <RotateCw className="w-5 h-5" />
                </button>

                {/* Volume slider */}
                <div className="hidden sm:flex items-center gap-2 group">
                  <button onClick={toggleMute} className="text-white/80 hover:text-white p-1">
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 accent-red-500 h-1 bg-white/20 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Speed & Fullscreen */}
              <div className="flex items-center gap-2">
                {/* Speed selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-mono-nums text-white flex items-center gap-1"
                  >
                    <Gauge className="w-3.5 h-3.5" />
                    <span>{playbackSpeed}x</span>
                  </button>
                  {showSpeedMenu && (
                    <div className="absolute bottom-10 right-0 bg-[#13151b] border border-white/10 rounded-xl p-1 shadow-2xl z-50 flex flex-col gap-0.5 w-24">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSpeedSelect(s)}
                          className={`px-3 py-1 text-xs font-mono-nums text-left rounded-md ${
                            playbackSpeed === s ? 'bg-red-600 text-white' : 'text-slate-300 hover:bg-white/5'
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (!document.fullscreenElement) {
                      document.documentElement.requestFullscreen().catch(() => {});
                    } else {
                      document.exitFullscreen().catch(() => {});
                    }
                  }}
                  aria-label="Toggle browser fullscreen"
                  className="p-2 text-white/80 hover:text-white"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VideoPlayerModal: React.FC = () => {
  const { playingMovie } = useApp();

  if (!playingMovie) return null;

  return <VideoPlayerContent playingMovie={playingMovie} />;
};
