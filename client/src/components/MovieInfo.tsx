import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import type { Movie } from "@shared/schema";

interface MovieInfoProps {
  movie: Movie;
  onTrailer: () => void;
}

export default function MovieInfo({ movie, onTrailer }: MovieInfoProps) {
  return (
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
      <div className="w-48 sm:w-56 md:w-full max-w-xs lg:max-w-none">
        <Button
          variant="outline"
          onClick={onTrailer}
          className="w-full border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-white"
        >
          <Play className="w-4 h-4 mr-2" />
          Watch Trailer
        </Button>
      </div>
    </div>
  );
}
