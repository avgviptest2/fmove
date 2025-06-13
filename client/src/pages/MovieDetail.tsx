import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import MovieGrid from "@/components/MovieGrid";
import TrailerModal from "@/components/TrailerModal";
import HeroBackdrop from "@/components/HeroBackdrop";
import VideoPlayer from "@/components/VideoPlayer";
import MoviePoster from "@/components/MoviePoster";
import MovieInfo from "@/components/MovieInfo";
import MovieSidebar from "@/components/MovieSidebar";
import type { Movie } from "@shared/schema";
import { useState, useEffect } from "react";

export default function MovieDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isWatching, setIsWatching] = useState(false);

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
  }, [id]);

  const handleWatchNow = () => {
    setIsWatching(true);
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
      {/* Hero Backdrop or Video Player */}
      {!isWatching ? (
        <HeroBackdrop movie={movie} onWatchNow={handleWatchNow} />
      ) : (
        <VideoPlayer 
          movie={movie} 
          isWatching={isWatching} 
          onClose={() => setIsWatching(false)} 
        />
      )}

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Responsive layout optimized for 768px-1024px */}
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-6 lg:gap-8">
          {/* Movie Poster */}
          <MoviePoster movie={movie} onTrailer={handleTrailer} />

          {/* Movie Information */}
          <MovieInfo movie={movie} onWatchNow={handleWatchNow} />

          {/* Additional Info Panel */}
          <MovieSidebar movie={movie} />
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