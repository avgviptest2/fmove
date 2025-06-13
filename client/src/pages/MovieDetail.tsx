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

  const getCurrentServerUrl = () => {
    const server = servers.find(s => s.id === selectedServer);
    return server?.url || null;
  };

  const handleWatchNow = () => {
    setIsWatching(true);
  };

  const handleDownload = () => {
    alert("Download feature coming soon!");
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
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-300">Loading movie details...</div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Movie not found</div>
          <Button
            onClick={() => setLocation("/movies")}
            className="bg-accent-cyan hover:bg-accent-cyan-hover"
          >
            Back to Movies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Hero Backdrop or Inline Player */}
      {!isWatching ? (
        <div
          className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[32rem] bg-cover bg-center group cursor-pointer"
          style={{
            backgroundImage: movie.backdrop
              ? `url(${movie.backdrop})`
              : undefined,
          }}
          onClick={handleWatchNow}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-primary" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 ease-in-out" />

          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={handleWatchNow}
              size="lg"
              className="bg-accent-cyan/90 hover:bg-accent-cyan group-hover:scale-110 group-hover:shadow-accent-cyan/50 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] group-hover:brightness-125 text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-accent-cyan/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] hover:brightness-125"
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 ml-1" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-80 sm:h-96 md:h-[28rem] lg:h-[40rem] xl:h-[45rem] bg-black rounded-lg overflow-hidden shadow-2xl">
          {getCurrentServerUrl() ? (
            <iframe
              key={`${selectedServer}-${selectedQuality}`}
              src={getCurrentServerUrl() || ""}
              title={`${movie.title} - ${servers.find(s => s.id === selectedServer)?.name} - ${selectedQuality}`}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-red-400" />
                </div>
                <div className="text-red-400 text-xl mb-2 font-semibold">
                  Video not available
                </div>
                <p className="text-gray-400 text-sm">
                  This server is not available for streaming
                </p>
              </div>
            </div>
          )}

          {/* Player Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <div className="bg-gradient-to-t from-black/95 via-black/80 to-transparent p-3 sm:p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-1 bg-gray-600/50 relative rounded-full">
                  <div className="h-full bg-accent-cyan w-[15%] relative rounded-full">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-accent-cyan rounded-full shadow-lg"></div>
                  </div>
                </div>
              </div>

              {/* Main Controls Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Button
                    onClick={() => setIsWatching(false)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>

                  <div className="flex items-center space-x-1 text-xs sm:text-sm text-white font-medium">
                    <span>0:01</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-300">1:36:02</span>
                    <Badge className="ml-2 bg-green-600 text-white text-xs px-2 py-0.5">
                      LIVE
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                  >
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <Button
                    onClick={() => setIsWatching(false)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Server and Quality Selection - Bottom of Player */}
          <div className="absolute bottom-0 left-0 right-0 z-30">
            <div className="bg-black/95 p-4 border-t border-gray-700/50">
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

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-6 lg:gap-8">
          {/* Movie Poster */}
          <div className="md:col-span-4 lg:col-span-3 xl:col-span-2">
            <div className="relative group">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </div>
          </div>

          {/* Movie Information */}
          <div className="md:col-span-8 lg:col-span-9 xl:col-span-10">
            <div className="space-y-4 sm:space-y-6">
              {/* Title & Basic Info */}
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base">
                  <Badge variant="secondary" className="bg-accent-cyan text-white">
                    {movie.type === 'movie' ? 'Movie' : 'TV Series'}
                  </Badge>
                  <div className="flex items-center text-yellow-400">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    <span className="font-semibold">{movie.rating}/10</span>
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
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {movie.genres?.map((genre: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700/50 transition-colors">
                    {genre.trim()}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Button
                  onClick={handleWatchNow}
                  size="lg"
                  className="bg-accent-cyan hover:bg-accent-cyan-hover text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Now
                </Button>
                
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="lg"
                  className="border-gray-600 text-white hover:bg-gray-800 font-semibold px-6 py-3 rounded-xl transition-all duration-200"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download
                </Button>
                
                <Button
                  onClick={() => setIsLiked(!isLiked)}
                  variant="outline"
                  size="lg"
                  className={`border-gray-600 hover:bg-gray-800 font-semibold px-6 py-3 rounded-xl transition-all duration-200 ${
                    isLiked ? 'text-red-500 border-red-500' : 'text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
                
                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="lg"
                  className="border-gray-600 text-white hover:bg-gray-800 font-semibold px-6 py-3 rounded-xl transition-all duration-200"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>

              {/* Description */}
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                  {movie.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
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