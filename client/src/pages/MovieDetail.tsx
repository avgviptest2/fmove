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
import TrailerModal from "@/components/TrailerModal";
import type { Movie } from "@shared/schema";
import { useState, useEffect } from "react";

export default function MovieDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [isLiked, setIsLiked] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [selectedServer, setSelectedServer] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState('Full HD');

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

  // Reset isWatching when movie ID changes
  useEffect(() => {
    setIsWatching(false);
    setSelectedServer(1);
    setSelectedQuality('Full HD');
  }, [id]);

  // Server options
  const servers = [
    { id: 1, name: 'Server 1', url: movie?.embed_url || movie?.play_url },
    { id: 2, name: 'Server 2', url: movie?.play_url || movie?.embed_url },
    { id: 3, name: 'Server 3', url: movie?.trailer_url },
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

  const handleTrailer = () => {
    setIsTrailerOpen(true);
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
          {/* Light gradient for bottom fade - always visible */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-primary" />

          {/* Dark overlay on hover only */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 ease-in-out" />

          {/* Large Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={handleWatchNow}
              size="lg"
              className="bg-accent-cyan/90 bg-accent-cyan hover:bg-accent-cyan group-hover:bg-accent-cyan group-hover:scale-110 group-hover:shadow-accent-cyan/50 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] group-hover:brightness-125 text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-accent-cyan/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] hover:brightness-125"
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 ml-1" />
            </Button>
          </div>
        </div>
      ) : (
      <>
        {/* Video Player and Control UI Container */}
        <div className="relative w-full h-80 sm:h-96 md:h-[28rem] lg:h-[40rem] xl:h-[45rem] bg-black rounded-lg overflow-hidden shadow-2xl">
          {/* Video Player */}
          {getCurrentServerUrl() ? (
            <iframe
              key={`${selectedServer}-${selectedQuality}`}
              src={getCurrentServerUrl() || ""}
              title={`${movie.title} - Player`}
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
                {/* Left Controls */}
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

                {/* Right Controls */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 rounded p-1.5"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 rounded p-1.5"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Close Player Button */}
          <Button
            onClick={() => setIsWatching(false)}
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 text-white hover:bg-black/50 rounded-full p-2 backdrop-blur-sm border border-white/20 transition-all duration-200 z-30"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Server and Quality Selection - Separate Div */}
        <div className="w-full bg-black/95 p-4">
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
                  </Button>
                ))}
              </div>
            </div>

            {/* Quality Selection */}
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-medium">Quality:</span>
              <div className="flex gap-1">
                {['Full HD', 'HD', '720p'].map((quality) => (
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
      </>
      )}

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Responsive layout optimized for 768px-1024px */}
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-6 lg:gap-8">
          {/* Movie Poster - Optimized for tablet and small desktop */}
          <div className="md:col-span-4 lg:col-span-3 xl:col-span-2">
            <div className="flex flex-col items-center md:items-start space-y-4">
              <div className="relative group w-48 sm:w-56 md:w-full max-w-xs lg:max-w-none">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full rounded-lg shadow-xl transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-green-600 text-white font-semibold text-xs sm:text-sm">
                    {movie.quality}
                  </Badge>
                </div>
              </div>

              {/* Trailer Button */}
              <div className="w-48 sm:w-56 md:w-full max-w-xs lg:max-w-none">
                <Button
                  variant="outline"
                  onClick={handleTrailer}
                  className="w-full border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Trailer
                </Button>
              </div>
            </div>
          </div>

          {/* Movie Information - Optimized width distribution */}
          <div className="md:col-span-5 lg:col-span-6 xl:col-span-7">
            <div className="space-y-4 md:space-y-5 lg:space-y-6">
              {/* Title and Basic Info */}
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 md:gap-3 lg:gap-4 text-sm md:text-sm lg:text-base text-gray-300 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{movie.year}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Film className="w-4 h-4" />
                    <span>{movie.duration} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-yellow-400 font-medium">{movie.rating}</span>
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres?.map((genre: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-gray-300 border-gray-600 hover:bg-gray-700/50 transition-colors"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-300 text-sm md:text-base lg:text-base leading-relaxed">
                  {movie.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
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
            </div>
          </div>

          {/* Additional Info Panel - Optimized for smaller screens */}
          <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
            <div className="space-y-4 md:space-y-6">
              {/* Movie Stats */}
              <div className="bg-dark-secondary/50 rounded-lg p-4 border border-gray-700/50">
                <h3 className="text-white font-semibold mb-3 text-base">Movie Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white capitalize">{movie.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Quality:</span>
                    <Badge className="bg-green-600 text-white text-xs">
                      {movie.quality}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Countries:</span>
                    <span className="text-white text-right">
                      {movie.countries?.join(', ')}
                    </span>
                  </div>
                </div>
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

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        movie={movie}
      />
    </div>
  );
}