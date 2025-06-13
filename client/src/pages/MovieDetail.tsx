import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MoviePlayer from "@/components/MoviePlayer";
import MovieInfo from "@/components/MovieInfo";
import MovieActions from "@/components/MovieActions";
import RelatedMovies from "@/components/RelatedMovies";
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
  const [selectedQuality, setSelectedQuality] = useState("Full HD");

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
    setSelectedQuality("Full HD");
  }, [id]);

  const handleWatchNow = () => {
    setIsWatching(true);
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
      {/* Hero Backdrop or Inline Player */}
      <MoviePlayer
        movie={movie}
        isWatching={isWatching}
        setIsWatching={setIsWatching}
        selectedServer={selectedServer}
        setSelectedServer={setSelectedServer}
        selectedQuality={selectedQuality}
        setSelectedQuality={setSelectedQuality}
      />
      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-6 lg:gap-8">
          {/* Movie Poster - Optimized for tablet and small desktop */}
          <div className="md:col-span-4 lg:col-span-3 xl:col-span-2">
            <MovieInfo movie={movie} onTrailer={handleTrailer} />
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
                    <span>{movie.year}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{movie.duration} min</span>
                  </div>
                  {movie.rating && (
                    <div className="flex items-center space-x-1">
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
                  <span className="text-accent-cyan font-medium">
                    Director:
                  </span>
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
                  <span className="text-accent-cyan font-medium">
                    Duration:
                  </span>
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
              <MovieActions
                isLiked={isLiked}
                onLike={() => setIsLiked(!isLiked)}
                onShare={handleShare}
                onDownload={handleDownload}
                onWatchNow={handleWatchNow}
                variant="mobile"
              />
            </div>
          </div>
          {/* Action Buttons - Tablet and Desktop */}
          <MovieActions
            isLiked={isLiked}
            onLike={() => setIsLiked(!isLiked)}
            onShare={handleShare}
            onDownload={handleDownload}
            onWatchNow={handleWatchNow}
            variant="desktop"
          />
        </div>
        {/* Related Movies */}
        <RelatedMovies
          movies={relatedMovies}
          currentMovieId={movie.id}
          onSelect={(movieId) => setLocation(`/movie/${movieId}`)}
        />
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
