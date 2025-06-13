import { Badge } from "@/components/ui/badge";
import type { Movie } from "@shared/schema";

interface MovieSidebarProps {
  movie: Movie;
}

export default function MovieSidebar({ movie }: MovieSidebarProps) {
  return (
    <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
      <div className="space-y-4 md:space-y-6">
        {/* Movie Stats */}
        <div className="bg-dark-secondary/50 rounded-lg p-4 border border-gray-700/50">
          <h3 className="text-white font-semibold mb-3 text-base">Movie Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Type:</span>
              <span className="text-white capitalize">{movie.type}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Quality:</span>
              <Badge className="bg-green-600 text-white text-xs">
                {movie.quality}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Countries:</span>
              <span className="text-white text-right">
                {movie.countries?.join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}