import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize, 
  Settings, 
  SkipBack, 
  SkipForward,
  RotateCcw,
  Subtitles,
  Cast,
  Download,
  Heart,
  Share2,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { Movie } from '@shared/schema';
import { useState, useEffect } from 'react';

export default function Player() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quality, setQuality] = useState('HD');
  const [server, setServer] = useState('server1');

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

  const handleGoBack = () => {
    setLocation(`/movie/${id}`);
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-300">Loading player...</div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Movie not found</div>
          <Button 
            onClick={() => setLocation('/movies')}
            className="bg-accent-cyan hover:bg-accent-cyan-hover"
          >
            Back to Movies
          </Button>
        </div>
      </div>
    );
  }

  const totalSeconds = movie.duration * 60;
  const progressPercentage = (currentTime / totalSeconds) * 100;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Video Player Container */}
      <div 
        className="relative w-full h-screen"
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
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full w-20 h-20 border border-white/20 transition-all duration-300 hover:scale-110"
              >
                <Play className="w-10 h-10 ml-1" />
              </Button>
            </div>
          )}

          {/* Top Controls */}
          <div className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 transition-opacity duration-300 z-30 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={handleGoBack}
                      className="text-white hover:text-accent-cyan hover:bg-white/10 rounded-full p-2"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Back to movie details</TooltipContent>
                </Tooltip>
                
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">{movie.title}</h1>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-green-600/80 text-white text-xs">
                      {movie.quality}
                    </Badge>
                    <span className="text-gray-300 text-sm">{movie.year}</span>
                    <span className="text-gray-300 text-sm">{movie.duration} min</span>
                    <div className="flex items-center space-x-1">
                      {movie.genres.slice(0, 3).map((genre) => (
                        <Badge key={genre} variant="secondary" className="bg-white/10 text-gray-300 text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full p-2">
                      <Heart className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add to favorites</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full p-2">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full p-2">
                      <Download className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 transition-opacity duration-300 z-30 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            {/* Progress Bar */}
            <div className="mb-6">
              <Slider
                value={[progressPercentage]}
                onValueChange={(value) => setCurrentTime((value[0] / 100) * totalSeconds)}
                max={100}
                step={0.1}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-300 mt-2">
                <span>{formatTime(Math.floor(currentTime))}</span>
                <span>{formatTime(totalSeconds)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center space-x-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handlePlayPause}
                      variant="ghost"
                      className="text-white hover:bg-white/10 rounded-full p-3"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6 ml-0.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isPlaying ? 'Pause' : 'Play'}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-white/10 rounded-full p-2"
                      onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                    >
                      <SkipBack className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Rewind 10s</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-white/10 rounded-full p-2"
                      onClick={() => setCurrentTime(Math.min(totalSeconds, currentTime + 10))}
                    >
                      <SkipForward className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Forward 10s</TooltipContent>
                </Tooltip>

                {/* Volume Control */}
                <div className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-white hover:bg-white/10 rounded-full p-2"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isMuted ? 'Unmute' : 'Mute'}</TooltipContent>
                  </Tooltip>
                  
                  <div className="w-20">
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full p-2">
                      <Subtitles className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Subtitles</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full p-2">
                      <Cast className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Cast</TooltipContent>
                </Tooltip>

                {/* Quality Selector */}
                <div className="relative group">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full p-2">
                        <Monitor className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Quality: {quality}</TooltipContent>
                  </Tooltip>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full p-2">
                      <Settings className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Settings</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="text-white hover:bg-white/10 rounded-full p-2"
                    >
                      <Maximize className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Fullscreen</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Demo Notice */}
          <div className={`absolute top-6 right-6 z-20 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg p-3">
              <p className="text-yellow-400 text-sm font-medium flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                Demo Player - No actual video stream
              </p>
            </div>
          </div>

          {/* Loading Overlay */}
          {isPlaying && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin opacity-30"></div>
            </div>
          )}
        </div>
      </div>

      {/* Side Panel for Settings (when not fullscreen) */}
      {!isFullscreen && (
        <div className="absolute right-0 top-0 h-full w-80 bg-black/80 backdrop-blur-sm border-l border-gray-800 transform translate-x-full hover:translate-x-0 transition-transform duration-300 z-40">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Player Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Quality</label>
                <select 
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-cyan"
                >
                  <option value="4K">4K Ultra HD</option>
                  <option value="HD">1080p HD</option>
                  <option value="720p">720p</option>
                  <option value="480p">480p</option>
                  <option value="360p">360p</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Server</label>
                <select 
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-cyan"
                >
                  <option value="server1">Server 1 (Primary)</option>
                  <option value="server2">Server 2 (Backup)</option>
                  <option value="server3">Server 3 (Alternative)</option>
                  <option value="server4">Server 4 (Premium)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Playback Speed</label>
                <select className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-cyan">
                  <option value="0.5">0.5x</option>
                  <option value="0.75">0.75x</option>
                  <option value="1" selected>1x (Normal)</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <h4 className="text-lg font-medium text-white mb-3">About this {movie.type === 'movie' ? 'Movie' : 'Series'}</h4>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {movie.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Badge key={genre} variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
