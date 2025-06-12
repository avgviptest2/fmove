import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Play, Clock, Calendar, Star, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Movie } from '@shared/schema';
import { QUALITY_BADGES } from '@/lib/constants';

export default function MovieDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: movie, isLoading, error } = useQuery<Movie>({
    queryKey: [`/api/movies/${id}`],
    enabled: !!id,
  });

  const handleWatchNow = () => {
    if (movie) {
      setLocation(`/player/${movie.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-gray-400">Loading movie details...</div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-400">Movie not found</div>
          <Button 
            onClick={() => setLocation('/movies')}
            className="mt-4 bg-accent-cyan hover:bg-accent-cyan-hover"
          >
            Back to Movies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-96 lg:h-[500px] bg-gradient-to-r from-dark-primary via-dark-secondary to-dark-primary overflow-hidden"
        style={{
          backgroundImage: movie.backdrop ? `url(${movie.backdrop})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="grid lg:grid-cols-3 gap-8 w-full">
            {/* Movie Poster */}
            <div className="lg:col-span-1">
              <img 
                src={movie.poster} 
                alt={movie.title}
                className="w-full max-w-sm mx-auto rounded-lg shadow-2xl"
              />
            </div>
            
            {/* Movie Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Badge 
                  className={`${QUALITY_BADGES[movie.quality as keyof typeof QUALITY_BADGES] || 'bg-gray-600'} text-white`}
                >
                  {movie.quality}
                </Badge>
                <Badge variant="outline" className="border-accent-cyan text-accent-cyan">
                  {movie.type === 'movie' ? 'Movie' : 'TV Series'}
                </Badge>
                {movie.rating && (
                  <Badge variant="secondary" className="bg-yellow-600 text-white">
                    ⭐ {movie.rating.toFixed(1)}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-300">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{movie.year}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{movie.duration} min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>{movie.countries.join(', ')}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Badge key={genre} variant="secondary" className="bg-dark-tertiary text-gray-300">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                {movie.description}
              </p>
              
              <Button 
                onClick={handleWatchNow}
                size="lg"
                className="bg-accent-cyan hover:bg-accent-cyan-hover text-white px-8 py-3 text-lg font-semibold"
              >
                <Play className="w-6 h-6 mr-2" />
                Watch Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-dark-secondary border-gray-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-accent-cyan">Description</h2>
                <p className="text-gray-300 leading-relaxed">
                  {movie.description}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="bg-dark-secondary border-gray-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-accent-cyan">Movie Info</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400">Release Year:</span>
                    <span className="ml-2 text-white">{movie.year}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Duration:</span>
                    <span className="ml-2 text-white">{movie.duration} minutes</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Quality:</span>
                    <Badge 
                      className={`ml-2 ${QUALITY_BADGES[movie.quality as keyof typeof QUALITY_BADGES] || 'bg-gray-600'} text-white`}
                    >
                      {movie.quality}
                    </Badge>
                  </div>
                  {movie.rating && (
                    <div>
                      <span className="text-gray-400">Rating:</span>
                      <span className="ml-2 text-white flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        {movie.rating.toFixed(1)}/10
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400">Countries:</span>
                    <span className="ml-2 text-white">{movie.countries.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Genres:</span>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {movie.genres.map((genre) => (
                        <Badge key={genre} variant="secondary" className="bg-dark-tertiary text-gray-300 text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
