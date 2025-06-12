
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize, 
  Settings,
  SkipBack, 
  SkipForward
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import type { Movie } from '@shared/schema';
import { useState, useEffect } from 'react';

export default function EmbedPlayer() {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const { data: movie, isLoading, error } = useQuery<Movie>({
    queryKey: [`/api/movies/${id}`],
    enabled: !!id,
  });

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (isPlaying && showControls) {
      const timer = setTimeout(() => setShowControls(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, showControls]);

  // Simulate time progress
  useEffect(() => {
    if (isPlaying && movie) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          return newTime >= movie.duration * 60 ? 0 : newTime;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, movie]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-center">
          <div className="text-lg mb-2">Video not found</div>
          <div className="text-sm text-gray-400">Unable to load the requested video</div>
        </div>
      </div>
    );
  }

  const totalSeconds = movie.duration * 60;
  const progressPercentage = (currentTime / totalSeconds) * 100;

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* Video Player Container */}
      <div 
        className="relative w-full h-full"
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => !isPlaying && setShowControls(false)}
      >
        {/* Video Background */}
        <div 
          className="w-full h-full bg-cover bg-center relative"
          style={{
            backgroundImage: movie.backdrop ? `url(${movie.backdrop})` : undefined,
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Center Play Button (when paused) */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <Button
                onClick={handlePlayPause}
                size="lg"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full w-16 h-16 border border-white/20 transition-all duration-300 hover:scale-110"
              >
                <Play className="w-8 h-8 ml-1" />
              </Button>
            </div>
          )}

          {/* Top Info Bar */}
          <div className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 transition-opacity duration-300 z-30 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-white">{movie.title}</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <span>{movie.year}</span>
                  <span>•</span>
                  <span>{movie.duration} min</span>
                  <span>•</span>
                  <span className="bg-green-600 px-2 py-0.5 rounded text-xs text-white">
                    {movie.quality}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 z-30 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            {/* Progress Bar */}
            <div className="mb-4">
              <Slider
                value={[progressPercentage]}
                onValueChange={(value) => setCurrentTime((value[0] / 100) * totalSeconds)}
                max={100}
                step={0.1}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-300 mt-1">
                <span>{formatTime(Math.floor(currentTime))}</span>
                <span>{formatTime(totalSeconds)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handlePlayPause}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 rounded-full p-2"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 rounded-full p-2"
                  onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                >
                  <SkipBack className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 rounded-full p-2"
                  onClick={() => setCurrentTime(Math.min(totalSeconds, currentTime + 10))}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>

                {/* Volume Control */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white hover:bg-white/10 rounded-full p-2"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <div className="w-16">
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      onValueChange={(value) => {
                        setVolume(value[0]);
                        setIsMuted(value[0] === 0);
                      }}
                      max={100}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-full p-2">
                  <Settings className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (document.fullscreenElement) {
                      document.exitFullscreen();
                    } else {
                      document.documentElement.requestFullscreen();
                    }
                  }}
                  className="text-white hover:bg-white/10 rounded-full p-2"
                >
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Loading Overlay */}
          {isPlaying && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin opacity-30"></div>
            </div>
          )}

          {/* Watermark */}
          <div className="absolute bottom-4 right-4 text-white/50 text-xs">
            Embedded Player
          </div>
        </div>
      </div>
    </div>
  );
}
