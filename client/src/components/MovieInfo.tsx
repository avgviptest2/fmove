import { useState } from "react";
import { Play, Download, Heart, Share2, Calendar, Star, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Movie } from "@shared/schema";

interface MovieInfoProps {
  movie: Movie;
  onWatchNow: () => void;
}

export default function MovieInfo({ movie, onWatchNow }: MovieInfoProps) {
  const [isLiked, setIsLiked] = useState(false);

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

  return (
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
            onClick={onWatchNow}
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
  );
}