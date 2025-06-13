
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
  Clock,
  Globe,
  Users,
  Award,
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
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-300 text-lg">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="text-red-400 text-2xl font-semibold">Movie not found</div>
          <p className="text-gray-400">The movie you're looking for doesn't exist.</p>
          <Button
            onClick={() => setLocation("/movies")}
            className="bg-accent-cyan hover:bg-accent-cyan-hover px-8 py-3"
          >
            Back to Movies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Hero Section with Backdrop */}
      <section className="relative">
        <div 
          className="h-[50vh] md:h-[60vh] lg:h-[70vh] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: movie.backdrop ? `url(${movie.backdrop})` : undefined,
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-dark-primary"></div>
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Button
              onClick={handleWatchNow}
              size="lg"
              className="bg-accent-cyan/90 hover:bg-accent-cyan text-white rounded-full w-20 h-20 shadow-2xl transition-all duration-300 hover:scale-110 border-4 border-white/20"
            >
              <Play className="w-10 h-10 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Movie Poster - Left Column */}
          <aside className="lg:col-span-3">
            <div className="sticky top-8 space-y-6">
              {/* Poster */}
              <div className="relative group max-w-sm mx-auto lg:max-w-none">
                <div className="relative overflow-hidden rounded-xl shadow-2xl">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Quality Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-600 text-white font-bold px-3 py-1 text-sm">
                      {movie.quality}
                    </Badge>
                  </div>
                  
                  {/* Rating Badge */}
                  {movie.rating && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-600 text-white font-bold px-3 py-1 text-sm flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        {movie.rating.toFixed(1)}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleWatchNow}
                  className="w-full bg-accent-cyan hover:bg-accent-cyan-hover text-white font-semibold py-4 text-lg rounded-lg transition-all duration-300 hover:shadow-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Stream in HD
                </Button>

                <Button
                  onClick={handleTrailer}
                  variant="outline"
                  className="w-full border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-white py-4 text-lg rounded-lg transition-all duration-300"
                >
                  <Film className="w-5 h-5 mr-2" />
                  Watch Trailer
                </Button>

                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white py-4 text-lg rounded-lg transition-all duration-300"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download HD
                </Button>

                {/* Social Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setIsLiked(!isLiked)}
                    className={`flex-1 ${isLiked ? "text-red-500 bg-red-500/10" : "text-gray-400 hover:text-red-500 hover:bg-red-500/10"} rounded-lg transition-all duration-300`}
                  >
                    <Heart className={`w-5 h-5 mr-2 ${isLiked ? "fill-current" : ""}`} />
                    {isLiked ? "Liked" : "Like"}
                  </Button>

                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={handleShare}
                    className="flex-1 text-gray-400 hover:text-accent-cyan hover:bg-accent-cyan/10 rounded-lg transition-all duration-300"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Movie Information - Right Column */}
          <section className="lg:col-span-9">
            <div className="space-y-8">
              
              {/* Title and Basic Info */}
              <header className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {movie.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent-cyan" />
                    <span className="font-medium">{movie.year}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent-cyan" />
                    <span className="font-medium">{movie.duration} min</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-accent-cyan" />
                    <span className="font-medium capitalize">{movie.type}</span>
                  </div>
                  
                  {movie.rating && (
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-yellow-400 font-bold">{movie.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Genre Tags */}
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Badge 
                      key={genre} 
                      variant="secondary" 
                      className="bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 px-3 py-1 text-sm font-medium rounded-full"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </header>

              {/* Description */}
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed text-lg">
                  {movie.description}
                </p>
              </div>

              {/* Movie Details Grid */}
              <div className="bg-dark-secondary/50 rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent-cyan" />
                  Movie Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Director:</span>
                      <span className="text-white">{movie.type === "movie" ? "Director Name" : "Show Creator"}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Duration:</span>
                      <span className="text-white">{movie.duration} minutes</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Quality:</span>
                      <Badge className="bg-green-600 text-white font-semibold">
                        {movie.quality}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-400 font-medium">Countries:</span>
                      <div className="flex items-center gap-1 text-white">
                        <Globe className="w-4 h-4 text-accent-cyan" />
                        <span>{movie.countries.join(", ")}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Release Year:</span>
                      <span className="text-white">{movie.year}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">IMDb Rating:</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-yellow-400 font-bold">
                          {movie.rating?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cast & Crew Section */}
              <div className="bg-dark-secondary/50 rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent-cyan" />
                  Cast & Crew
                </h3>
                <p className="text-gray-400">
                  {movie.type === "movie" ? "Various talented actors and actresses" : "Amazing TV series cast"}
                </p>
              </div>

              {/* Keywords */}
              <div className="bg-dark-secondary/50 rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-4">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.slice(0, 6).map((genre, index) => (
                    <span 
                      key={index}
                      className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {genre.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Related Movies Section */}
        {relatedMovies && relatedMovies.length > 0 && (
          <section className="mt-16 pt-16 border-t border-gray-800">
            <MovieGrid
              movies={relatedMovies.filter((m) => m.id !== movie.id).slice(0, 6)}
              title="You May Also Like"
              onWatch={(movieId) => setLocation(`/player/${movieId}`)}
              onDetails={(movieId) => setLocation(`/movie/${movieId}`)}
            />
          </section>
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
      </main>
    </div>
  );
}
