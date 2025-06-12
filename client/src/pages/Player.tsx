import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Play, Pause, Volume2, Maximize, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Movie } from '@shared/schema';
import { useState } from 'react';

export default function Player() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: movie, isLoading, error } = useQuery<Movie>({
    queryKey: [`/api/movies/${id}`],
    enabled: !!id,
  });

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleGoBack = () => {
    setLocation(`/movie/${id}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-gray-400">Loading player...</div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-400">Movie not found</div>
          <Button 
            onClick={() => setLocation('/movies')}
            className="mt-4 bg-accent-cyan hover:bg-accent-cyan-hover"
          >
            Back to Movies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-dark-secondary/90 backdrop-blur-sm p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="text-white hover:text-accent-cyan"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-white">{movie.title}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className="bg-green-600 text-white text-xs">
                  {movie.quality}
                </Badge>
                <span className="text-gray-400 text-sm">{movie.year}</span>
                <span className="text-gray-400 text-sm">{movie.duration} min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative">
        <div className="aspect-video bg-black flex items-center justify-center">
          {/* Mock Video Player */}
          <div 
            className="w-full h-full bg-cover bg-center relative"
            style={{
              backgroundImage: movie.backdrop ? `url(${movie.backdrop})` : undefined,
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Play/Pause Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                onClick={handlePlayPause}
                size="lg"
                className="bg-accent-cyan/80 hover:bg-accent-cyan text-white rounded-full w-20 h-20"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </Button>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={handlePlayPause}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-accent-cyan"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-accent-cyan"
                  >
                    <Volume2 className="w-5 h-5" />
                  </Button>
                  <span className="text-white text-sm">00:00 / {Math.floor(movie.duration / 60)}:{(movie.duration % 60).toString().padStart(2, '0')}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-accent-cyan"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-accent-cyan"
                  >
                    <Maximize className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-600 rounded-full h-1">
                  <div className="bg-accent-cyan h-1 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Player Notice */}
        <div className="absolute top-4 right-4 z-10">
          <Card className="bg-dark-secondary/90 backdrop-blur-sm border-gray-700">
            <CardContent className="p-3">
              <p className="text-yellow-400 text-sm font-medium">
                🎬 Demo Player - No actual video stream
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Movie Info */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-dark-secondary border-gray-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-accent-cyan">About this {movie.type === 'movie' ? 'Movie' : 'Series'}</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {movie.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Badge key={genre} variant="secondary" className="bg-dark-tertiary text-gray-300">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="bg-dark-secondary border-gray-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-accent-cyan">Player Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Quality
                    </label>
                    <select className="w-full bg-dark-tertiary border border-gray-600 rounded px-3 py-2 text-white">
                      <option>{movie.quality}</option>
                      <option>720p</option>
                      <option>480p</option>
                      <option>360p</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Server
                    </label>
                    <select className="w-full bg-dark-tertiary border border-gray-600 rounded px-3 py-2 text-white">
                      <option>Server 1 (Primary)</option>
                      <option>Server 2 (Backup)</option>
                      <option>Server 3 (Alternative)</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-gray-600">
                    <p className="text-sm text-gray-400">
                      Having issues? Try switching to a different server or quality setting.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
