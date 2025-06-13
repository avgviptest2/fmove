
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MovieGrid from "@/components/MovieGrid";
import TrailerModal from "@/components/TrailerModal";
import type { Movie } from "@shared/schema";
import { useState } from "react";

export default function MovieDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [isLiked, setIsLiked] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

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

  const handleWatchNow = () => {
    if (movie) {
      setLocation(`/player/${movie.id}`);
    }
  };

  const handleDownload = () => {
    // Demo functionality
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
      {/* Hero Backdrop - Responsive height */}
      <div
        className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[32rem] bg-cover bg-center group"
        style={{
          backgroundImage: movie.backdrop
            ? `url(${movie.backdrop})`
            : undefined,
        }}
      >
        {/* Light gradient for bottom fade - always visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-primary" />
        
        {/* Dark overlay on hover only */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300" />

        {/* Large Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            onClick={handleWatchNow}
            size="lg"
            className="bg-accent-cyan/90 hover:bg-accent-cyan text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-accent-cyan/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] hover:brightness-125"
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 ml-1" />
          </Button>
        </div>
      </div>

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
                  {movie.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">
                        {movie.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-gray-300 leading-relaxed mb-4 md:mb-5 lg:mb-6 text-sm md:text-sm lg:text-base">
                  {movie.description}
                </p>
              </div>

              {/* Movie Details - Optimized for medium screens */}
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-x-4 lg:gap-x-6 gap-y-2 text-sm">
                <div>
                  <span className="text-accent-cyan font-medium">Genres:</span>
                  <span className="ml-2 text-gray-300">
                    {movie.genres.join(", ")}
                  </span>
                </div>

                <div>
                  <span className="text-accent-cyan font-medium">Actor:</span>
                  <span className="ml-2 text-gray-300">
                    {movie.type === "movie" ? "Various Artists" : "TV Cast"}
                  </span>
                </div>

                <div>
                  <span className="text-accent-cyan font-medium">Director:</span>
                  <span className="ml-2 text-gray-300">
                    {movie.type === "movie" ? "Director Name" : "Show Creator"}
                  </span>
                </div>

                <div>
                  <span className="text-accent-cyan font-medium">Country:</span>
                  <span className="ml-2 text-gray-300">
                    {movie.countries.join(", ")}
                  </span>
                </div>

                <div>
                  <span className="text-accent-cyan font-medium">Duration:</span>
                  <span className="ml-2 text-gray-300">
                    {movie.duration} min
                  </span>
                </div>

                <div>
                  <span className="text-accent-cyan font-medium">Quality:</span>
                  <Badge className="ml-2 bg-green-600 text-white text-xs">
                    {movie.quality}
                  </Badge>
                </div>

                <div>
                  <span className="text-accent-cyan font-medium">Release:</span>
                  <span className="ml-2 text-gray-300">{movie.year}</span>
                </div>

                <div>
                  <span className="text-accent-cyan font-medium">IMDb:</span>
                  <span className="ml-2 text-yellow-400">
                    {movie.rating?.toFixed(1) || "N/A"}
                  </span>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <span className="text-accent-cyan font-medium">Keywords:</span>
                <span className="ml-2 text-gray-400 text-sm">
                  {movie.genres
                    .slice(0, 4)
                    .map((genre) => genre.toLowerCase())
                    .join(", ")}
                </span>
              </div>

              {/* Action Buttons on mobile and tablet - show here */}
              <div className="md:hidden space-y-3 mt-6">
                <Button
                  onClick={handleWatchNow}
                  className="w-full bg-accent-cyan hover:bg-accent-cyan-hover text-white font-semibold py-3"
                >
                  Stream in HD
                </Button>

                <Button
                  onClick={handleDownload}
                  className="w-full bg-accent-cyan hover:bg-accent-cyan-hover text-white font-semibold py-3"
                >
                  Download in HD
                </Button>

                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLiked(!isLiked)}
                    className={`flex-1 ${isLiked ? "text-red-500" : "text-gray-400"} hover:text-red-500`}
                  >
                    <Heart
                      className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`}
                    />
                    Like
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="flex-1 text-gray-400 hover:text-accent-cyan"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Tablet and Desktop */}
          <div className="hidden md:block md:col-span-3 lg:col-span-3 xl:col-span-3">
            <div className="space-y-3 sticky top-4">
              <Button
                onClick={handleWatchNow}
                className="w-full bg-accent-cyan hover:bg-accent-cyan-hover text-white font-semibold py-3 text-sm md:text-base"
              >
                Stream in HD
              </Button>

              <Button
                onClick={handleDownload}
                className="w-full bg-accent-cyan hover:bg-accent-cyan-hover text-white font-semibold py-3 text-sm md:text-base"
              >
                Download in HD
              </Button>

              <div className="flex flex-col md:flex-row lg:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex-1 ${isLiked ? "text-red-500" : "text-gray-400"} hover:text-red-500`}
                >
                  <Heart
                    className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`}
                  />
                  Like
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="flex-1 text-gray-400 hover:text-accent-cyan"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Movies */}
        {relatedMovies && relatedMovies.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <MovieGrid
              movies={relatedMovies
                .filter((m) => m.id !== movie.id)
                .slice(0, 6)}
              title="Related Movies"
              onWatch={(movieId) => setLocation(`/movie/${movieId}`)}
              onDetails={(movieId) => setLocation(`/movie/${movieId}`)}
            />
          </div>
        )}

        {/* Trailer Modal */}
        {movie && (
          <TrailerModal
            isOpen={isTrailerOpen}
            onClose={() => setIsTrailerOpen(false)}
            trailerUrl={movie.trailer_url || ""}
            movieTitle={movie.title}
          />
        )}
      </div>
    </div>
  );
}
