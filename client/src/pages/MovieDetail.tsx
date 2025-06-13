import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Play,
  Download,
  Heart,
  Share2,
  Calendar,
  Star,
  Film,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MovieGrid from "@/components/MovieGrid";
import type { Movie } from "@shared/schema";
import { useState, useEffect } from "react";

export default function MovieDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [isLiked, setIsLiked] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [selectedServer, setSelectedServer] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState('1080p');

  const {
    data: movie,
    isLoading,
    error,
  } = useQuery<Movie>({
    queryKey: [`/api/movies/${id}`],
    enabled: !!id,
  });

  const { data: relatedMoviesData } = useQuery<{
    movies: Movie[];
    total: number;
    pages: number;
  }>({
    queryKey: ["/api/movies", { limit: 6 }],
    enabled: !!movie,
  });

  const relatedMovies = relatedMoviesData?.movies || [];

  useEffect(() => {
    setIsWatching(false);
    setSelectedServer(1);
    setSelectedQuality('1080p');
  }, [id]);

  // Danh sách server với URL khác nhau
  const servers = [
    { id: 1, name: 'Server 1', url: movie?.embed_url || movie?.play_url },
    { id: 2, name: 'Server 2', url: movie?.play_url || movie?.embed_url },
    { id: 3, name: 'Server VIP', url: movie?.trailer_url },
  ];

  // Lấy URL của server được chọn
  const getCurrentServerUrl = () => {
    const server = servers.find(s => s.id === selectedServer);
    return server?.url || null;
  };

  const handleWatchNow = () => {
    setIsWatching(true);
  };

  const handleTrailer = () => {
    if (movie?.trailer_url) {
      window.open(movie.trailer_url, '_blank');
    }
  };

  const handleDownload = () => {
    if (movie?.play_url) {
      window.open(movie.play_url, '_blank');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie?.title,
        text: movie?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-cyan"></div>
          <p className="mt-4 text-white">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Movie Not Found</h1>
          <p className="text-gray-400 mb-4">The movie you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation("/")} className="bg-accent-cyan hover:bg-accent-cyan-hover">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={movie.backdrop || movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-dark-primary/80 to-transparent"></div>
        </div>

        <div className="relative z-10 pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-1">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
                />
              </div>

              <div className="lg:col-span-2">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <Badge variant="secondary" className="bg-accent-cyan text-white">
                    {movie.type === 'movie' ? 'Movie' : 'TV Series'}
                  </Badge>
                  <div className="flex items-center text-yellow-400">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    <span>{movie.rating}/10</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{movie.year}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Film className="w-4 h-4 mr-1" />
                    <span>{movie.duration} min</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres?.map((genre: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-gray-300 border-gray-600">
                      {genre.trim()}
                    </Badge>
                  ))}
                </div>

                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  {movie.description}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={handleWatchNow}
                    size="lg"
                    className="bg-accent-cyan hover:bg-accent-cyan-hover text-white"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Now
                  </Button>
                  
                  <Button
                    onClick={handleTrailer}
                    variant="outline"
                    size="lg"
                    className="border-gray-600 text-white hover:bg-gray-800"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Trailer
                  </Button>
                  
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="lg"
                    className="border-gray-600 text-white hover:bg-gray-800"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </Button>
                  
                  <Button
                    onClick={() => setIsLiked(!isLiked)}
                    variant="outline"
                    size="lg"
                    className={`border-gray-600 hover:bg-gray-800 ${
                      isLiked ? 'text-red-500' : 'text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'}
                  </Button>
                  
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    size="lg"
                    className="border-gray-600 text-white hover:bg-gray-800"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Section */}
      {isWatching && (
        <div className="container mx-auto px-4 mb-12">
          <div className="bg-dark-secondary rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">
                Now Playing: {movie.title} - {servers.find(s => s.id === selectedServer)?.name} ({selectedQuality})
              </h2>
              <Button
                onClick={() => setIsWatching(false)}
                variant="outline"
                size="sm"
                className="text-white border-gray-600 hover:bg-gray-800"
              >
                <X className="w-4 h-4 mr-2" />
                Close Player
              </Button>
            </div>
            
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {getCurrentServerUrl() ? (
                <iframe
                  key={`${selectedServer}-${selectedQuality}`}
                  src={getCurrentServerUrl() || ""}
                  title={`${movie.title} - ${servers.find(s => s.id === selectedServer)?.name} - ${selectedQuality}`}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Film className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-white text-lg mb-2">Video not available</p>
                    <p className="text-gray-400">This server is not available for streaming.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Server and Quality Selection */}
            <div className="mt-4 bg-black/95 rounded-lg p-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Server Selection */}
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">Server:</span>
                  <div className="flex gap-1">
                    {servers.map((server) => (
                      <Button
                        key={server.id}
                        onClick={() => setSelectedServer(server.id)}
                        className={`text-xs px-3 py-1.5 h-auto rounded-lg font-semibold transition-colors ${
                          selectedServer === server.id
                            ? 'bg-accent-cyan hover:bg-accent-cyan-hover text-white'
                            : 'bg-gray-700/80 hover:bg-gray-600 text-white'
                        }`}
                        disabled={!server.url}
                      >
                        {server.name}
                        {!server.url && " (Unavailable)"}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Quality Selection */}
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">Quality:</span>
                  <div className="flex gap-1">
                    {['1080p', '720p', '480p'].map((quality) => (
                      <Button
                        key={quality}
                        onClick={() => setSelectedQuality(quality)}
                        className={`text-xs px-3 py-1.5 h-auto rounded-lg font-semibold transition-colors ${
                          selectedQuality === quality
                            ? 'bg-accent-cyan hover:bg-accent-cyan-hover text-white'
                            : 'bg-gray-700/80 hover:bg-gray-600 text-white'
                        }`}
                      >
                        {quality}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <div className="container mx-auto px-4 pb-12">
          <MovieGrid
            movies={relatedMovies.filter(m => m.id !== movie.id)}
            title="Related Movies"
            onWatch={() => {}}
            onDetails={(movieId) => setLocation(`/movie/${movieId}`)}
          />
        </div>
      )}
    </div>
  );
}