import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Movie } from '@shared/schema';

interface HeroProps {
  movie: Movie;
  onWatchNow: (movieId: number) => void;
}

export default function Hero({ movie, onWatchNow }: HeroProps) {
  return (
    <section 
      className="relative h-96 bg-gradient-to-r from-dark-primary via-dark-secondary to-dark-primary overflow-hidden"
      style={{
        backgroundImage: movie.backdrop ? `url(${movie.backdrop})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-2 mb-4">
            <Badge 
              className={`${
                movie.quality === 'HD' ? 'bg-green-600' : 
                movie.quality === 'CAM' ? 'bg-yellow-600' : 
                'bg-blue-600'
              } text-white`}
            >
              {movie.quality}
            </Badge>
            <span className="text-accent-cyan text-sm">{movie.duration} min</span>
            <span className="text-gray-400 text-sm">
              {movie.genres.join(', ')}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            {movie.title}
          </h1>
          
          <p className="text-gray-300 text-lg mb-6 leading-relaxed">
            {movie.description}
          </p>
          
          <Button 
            onClick={() => onWatchNow(movie.id)}
            className="bg-accent-cyan hover:bg-accent-cyan-hover text-white px-8 py-3 rounded-md font-semibold transition-colors inline-flex items-center space-x-2"
          >
            <Play className="w-5 h-5" />
            <span>Watch Now</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
