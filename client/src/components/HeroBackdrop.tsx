import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Movie } from "@shared/schema";

interface HeroBackdropProps {
  movie: Movie;
  onWatchNow: () => void;
}

export default function HeroBackdrop({ movie, onWatchNow }: HeroBackdropProps) {
  return (
    <div
      className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[32rem] bg-cover bg-center group cursor-pointer"
      style={{
        backgroundImage: movie.backdrop
          ? `url(${movie.backdrop})`
          : undefined,
      }}
      onClick={onWatchNow}
    >
      {/* Light gradient for bottom fade - always visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-primary" />

      {/* Dark overlay on hover only */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 ease-in-out" />

      {/* Large Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Button
          onClick={onWatchNow}
          size="lg"
          className="bg-accent-cyan/90 bg-accent-cyan hover:bg-accent-cyan group-hover:bg-accent-cyan group-hover:scale-110 group-hover:shadow-accent-cyan/50 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] group-hover:brightness-125 text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-accent-cyan/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] hover:brightness-125"
        >
          <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 ml-1" />
        </Button>
      </div>
    </div>
  );
}