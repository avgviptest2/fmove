import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Play, Download, Heart, Share2, Calendar, Star, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MovieGrid from "@/components/MovieGrid";
import TrailerModal from "@/components/TrailerModal";
import VideoPlayer from "@/components/VideoPlayer";
import ServerSelector from "@/components/ServerSelector";
import MovieInfo from "@/components/MovieInfo";
import type { Movie } from "@shared/schema";
import { useState, useEffect } from "react";

export default function MovieDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  // State management
  const [isWatching, setIsWatching] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState("Full HD");

  // Server data with Vietnamese streaming sources
  const servers = [
    { id: 1, name: "Server 1", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 2, name: "Server 2", url: "https://www.youtube.com/embed/9bZkp7q19f0" },
    { id: 3, name: "Server 3", url: null }, // Disabled server
  ];

  // Fetch movie data
  const { data: movie, isLoading } = useQuery<Movie>({
    queryKey: ["/api/movies", id],
    enabled: !!id,
  });

  // Fetch related movies
  const { data: relatedMovies } = useQuery<Movie[]>({
    queryKey: ["/api/movies", { limit: 8 }],
    enabled: !!movie,
  });

  // Get current server URL
  const getCurrentServerUrl = () => {
    const server = servers.find((s) => s.id === selectedServer);
    return server?.url;
  };

  // Event handlers
  const handleWatchNow = () => setIsWatching(true);
  const handleDownload = () => {
    console.log("Download movie:", movie?.title);
  };
  const handleShare = () => {
    if (navigator.share && movie) {
      navigator.share({
        title: movie.title,
        text: movie.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };
  const handleTrailer = () => setIsTrailerOpen(true);

  // Auto-scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Movie not found</h2>
          <Button onClick={() => setLocation("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section with Responsive Background */}
      <div
        className="relative min-h-[85vh] sm:min-h-[90vh] md:min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(${movie.imageUrl})`,
        }}
      >
        {/* Video Player or Poster */}
        {isWatching ? (
          <>
            <VideoPlayer
              videoUrl={getCurrentServerUrl()}
              movieTitle={movie.title}
              onClose={() => setIsWatching(false)}
              serverKey={`${selectedServer}-${selectedQuality}`}
            />
            
            <ServerSelector
              servers={servers}
              selectedServer={selectedServer}
              onServerChange={setSelectedServer}
              selectedQuality={selectedQuality}
              onQualityChange={setSelectedQuality}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={handleWatchNow}
              size="lg"
              className="bg-accent-cyan hover:bg-accent-cyan-hover text-white font-bold px-8 py-4 rounded-full text-lg shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Responsive layout optimized for 768px-1024px */}
        <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-6 md:gap-6 lg:gap-8">
          {/* Movie Poster - Responsive sizing */}
          <div className="md:col-span-3 lg:col-span-4 xl:col-span-5 flex justify-center md:justify-start">
            <div className="relative group">
              <img
                src={movie.imageUrl}
                alt={movie.title}
                className="w-64 sm:w-72 md:w-full max-w-sm rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <Badge className="bg-green-600 text-white text-xs px-3 py-1 mb-2">
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

          {/* Movie Information - Using MovieInfo Component */}
          <div className="md:col-span-5 lg:col-span-6 xl:col-span-7">
            <MovieInfo
              movie={movie}
              isLiked={isLiked}
              onLikeToggle={() => setIsLiked(!isLiked)}
              onWatchNow={handleWatchNow}
              onDownload={handleDownload}
              onShare={handleShare}
              onTrailer={handleTrailer}
            />
          </div>
        </div>

        {/* Related Movies */}
        {relatedMovies && relatedMovies.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <MovieGrid
              movies={relatedMovies}
              title="Related Movies"
              onWatch={() => {}}
              onDetails={(movieId) => setLocation(`/movie/${movieId}`)}
            />
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
        movieTitle={movie.title}
      />
    </div>
  );
}