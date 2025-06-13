import { Play, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Movie } from "@shared/schema";
import { QUALITY_BADGES } from "@/lib/constants";
import { useState } from "react";
import TrailerModal from "./TrailerModal";

interface MovieCardProps {
  movie: Movie;
  onWatch: (movieId: number) => void;
  onDetails: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onWatch,
  onDetails,
}: MovieCardProps) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const handleWatchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWatch(movie.id);
  };

  const handleTrailerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTrailerOpen(true);
  };

  return (
    <div className="group cursor-pointer" onClick={() => onDetails(movie.id)}>
      <div className="relative overflow-hidden rounded-lg bg-dark-secondary">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-auto aspect-[2/3] object-cover transform group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quality badge */}
        <div className="absolute top-2 left-2">
          <Badge
            className={`${QUALITY_BADGES[movie.quality as keyof typeof QUALITY_BADGES] || "bg-gray-600"} text-white text-xs font-semibold`}
          >
            {movie.quality}
          </Badge>
        </div>

        {/* Episode count for TV series */}
        {movie.type === "tv" && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-accent-cyan text-white text-xs font-semibold">
              S1
            </Badge>
          </div>
        )}

        {/* Rating */}
        {movie.rating && (
          <div className="absolute top-2 right-2">
            <Badge
              variant="secondary"
              className="bg-black/50 text-yellow-400 text-xs"
            >
              ⭐ {movie.rating.toFixed(1)}
            </Badge>
          </div>
        )}

        {/* Action buttons on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="space-y-2">
            <Button
              onClick={handleWatchClick}
              className="w-full bg-accent-cyan hover:bg-accent-cyan-hover text-white py-2 rounded font-medium"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Now
            </Button>
            <Button
              onClick={handleTrailerClick}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 py-2 rounded font-medium"
            >
              <Film className="w-4 h-4 mr-2" />
              Trailer
            </Button>
          </div>
        </div>
      </div>

      {/* Movie info */}
      <div className="mt-3">
        <h3 className="font-medium text-white group-hover:text-accent-cyan transition-colors line-clamp-2">
          {movie.title}
        </h3>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-accent-cyan text-sm">{movie.year}</span>
          <span className="text-gray-400 text-sm">
            {movie.genres.slice(0, 2).join(", ")}
          </span>
        </div>
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerUrl={movie.trailer_url || ""}
        movieTitle={movie.title}
      />
    </div>
  );
}
