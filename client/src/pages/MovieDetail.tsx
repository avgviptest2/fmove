
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
  ArrowLeft,
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
      {/* Mobile Back Button */}
      <div className="lg:hidden p-4">
        <Button
          variant="ghost"
          onClick={() => setLocation("/movies")}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
      </div>

      {/* Hero Backdrop - Responsive Height */}
      <div
        className="relative h-64 sm:h-80 lg:h-96 bg-cover bg-center"
        style={{
          backgroundImage: movie.backdrop
            ? `url(${movie.backdrop})`
            : undefined,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-dark-primary" />

        {/* Large Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            onClick={handleWatchNow}
            size="lg"
            className="bg-accent-cyan/90 hover:bg-accent-cyan text-white rounded-full w-12 h-12 sm:w-16 sm:h-16 shadow-2xl transition-all duration-300 hover:scale-110"
          >
            <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-1" />
          </Button>
        </div>
      </div>

      {/* Main Content - Responsive Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Movie Poster - Responsive Layout */}
          <div className="lg:col-span-3 xl:col-span-2">
            <div className="flex flex-row lg:flex-col gap-4">
              {/* Poster */}
              <div className="flex-shrink-0 w-32 sm:w-40 lg:w-full">
                <div className="relative group">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full rounded-lg shadow-xl transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-green-600 text-white font-semibold text-xs">
                      {movie.quality}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Mobile/Tablet Layout */}
              <div className="flex-1 lg:hidden">
                <div className="space-y-3">
                  <Button
                    onClick={handleWatchNow}
                    className="w-full bg-accent-cyan hover:bg-accent-cyan-hover text-white font-semibold py-2.5 text-sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Now
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleTrailer}
                    className="w-full border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-white text-sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Trailer
                  </Button>

                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsLiked(!isLiked)}
                      className={`flex-1 ${isLiked ? "text-red-500" : "text-gray-400"} hover:text-red-500 text-xs`}
                    >
                      <Heart
                        className={`w-4 h-4 mr-1 ${isLiked ? "fill-current" : ""}`}
                      />
                      Like
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShare}
                      className="flex-1 text-gray-400 hover:text-accent-cyan text-xs"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:block mt-4 space-y-3">
              <Button
                onClick={handleWatchNow}
                className="w-full bg-accent-cyan hover:bg-accent-cyan-hover text-white font-semibold py-3"
              >
                <Play className="w-4 h-4 mr-2" />
                Stream in HD
              </Button>

              <Button
                variant="outline"
                onClick={handleTrailer}
                className="w-full border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Trailer
              </Button>

              <Button
                onClick={handleDownload}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
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

          {/* Movie Information - Responsive Layout */}
          <div className="lg:col-span-9 xl:col-span-10">
            <div className="space-y-4 lg:space-y-6">
              {/* Title and Basic Info */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-300 mb-4 text-sm sm:text-base">
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
                  <Badge className="bg-gray-700 text-gray-300">
                    {movie.type === "movie" ? "Movie" : "TV Series"}
                  </Badge>
                </div>

                <p className="text-gray-300 leading-relaxed mb-4 lg:mb-6 text-sm sm:text-base">
                  {movie.description}
                </p>
              </div>

              {/* Movie Details - Responsive Grid */}
              <div className="bg-dark-secondary rounded-lg p-4 lg:p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Movie Details
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <span className="text-accent-cyan font-medium">Genres:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {movie.genres.map((genre) => (
                        <Badge key={genre} variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-accent-cyan font-medium">Countries:</span>
                    <div className="text-gray-300 mt-1">
                      {movie.countries.join(", ")}
                    </div>
                  </div>

                  <div>
                    <span className="text-accent-cyan font-medium">Duration:</span>
                    <div className="text-gray-300 mt-1">
                      {movie.duration} minutes
                    </div>
                  </div>

                  <div>
                    <span className="text-accent-cyan font-medium">Quality:</span>
                    <Badge className="ml-2 bg-green-600 text-white text-xs">
                      {movie.quality}
                    </Badge>
                  </div>

                  <div>
                    <span className="text-accent-cyan font-medium">Release:</span>
                    <div className="text-gray-300 mt-1">{movie.year}</div>
                  </div>

                  <div>
                    <span className="text-accent-cyan font-medium">IMDb:</span>
                    <span className="ml-2 text-yellow-400">
                      {movie.rating?.toFixed(1) || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Movies - Responsive */}
        {relatedMovies && relatedMovies.length > 0 && (
          <div className="mt-12 lg:mt-16">
            <MovieGrid
              movies={relatedMovies
                .filter((m) => m.id !== movie.id)
                .slice(0, 6)}
              title="You May Also Like"
              onWatch={(movieId) => setLocation(`/player/${movieId}`)}
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
