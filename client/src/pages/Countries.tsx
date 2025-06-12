import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Film, Tv } from 'lucide-react';
import { COUNTRIES } from '@/lib/constants';
import type { Movie } from '@shared/schema';

export default function Countries() {
  const [, setLocation] = useLocation();

  const { data: moviesData, isLoading } = useQuery<{movies: Movie[], total: number, pages: number}>({
    queryKey: ['/api/movies', { limit: 100 }],
  });

  const movies = moviesData?.movies || [];

  // Count movies by country
  const countryStats = COUNTRIES.map(country => {
    const countryMovies = movies.filter(movie => 
      movie.countries.includes(country)
    );
    const movieCount = countryMovies.filter(m => m.type === 'movie').length;
    const tvCount = countryMovies.filter(m => m.type === 'tv').length;
    
    return {
      country,
      total: countryMovies.length,
      movies: movieCount,
      tvShows: tvCount,
      latestMovies: countryMovies.slice(0, 3)
    };
  }).filter(stat => stat.total > 0);

  const handleCountryClick = (country: string) => {
    setLocation(`/movies?country=${encodeURIComponent(country)}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-primary">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-gray-300">Loading countries...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Browse by Countries</h1>
          <p className="text-gray-400">
            Explore movies and TV series from different countries around the world
          </p>
        </div>

        {/* Country Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countryStats.map((stat) => (
            <Card 
              key={stat.country}
              className="bg-dark-secondary border-gray-700 hover:border-accent-cyan transition-colors cursor-pointer group"
              onClick={() => handleCountryClick(stat.country)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-accent-cyan" />
                    <h3 className="text-xl font-semibold text-white group-hover:text-accent-cyan transition-colors">
                      {stat.country}
                    </h3>
                  </div>
                  <Badge variant="secondary" className="bg-accent-cyan text-white">
                    {stat.total}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Film className="w-4 h-4" />
                    <span>{stat.movies} Movies</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tv className="w-4 h-4" />
                    <span>{stat.tvShows} TV Shows</span>
                  </div>
                </div>

                {/* Latest Movies Preview */}
                {stat.latestMovies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Popular titles:</h4>
                    <div className="space-y-1">
                      {stat.latestMovies.map((movie) => (
                        <div 
                          key={movie.id} 
                          className="text-sm text-gray-400 hover:text-accent-cyan transition-colors truncate cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/movie/${movie.id}`);
                          }}
                        >
                          • {movie.title} ({movie.year})
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-dark-secondary border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-accent-cyan mb-2">
                {countryStats.length}
              </div>
              <div className="text-gray-400">Countries</div>
            </CardContent>
          </Card>
          
          <Card className="bg-dark-secondary border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-accent-cyan mb-2">
                {countryStats.reduce((sum, stat) => sum + stat.movies, 0)}
              </div>
              <div className="text-gray-400">Total Movies</div>
            </CardContent>
          </Card>
          
          <Card className="bg-dark-secondary border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-accent-cyan mb-2">
                {countryStats.reduce((sum, stat) => sum + stat.tvShows, 0)}
              </div>
              <div className="text-gray-400">Total TV Shows</div>
            </CardContent>
          </Card>
        </div>

        {/* World Map Placeholder */}
        <div className="mt-12">
          <Card className="bg-dark-secondary border-gray-700">
            <CardContent className="p-8 text-center">
              <Globe className="w-16 h-16 text-accent-cyan mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Global Content Library</h3>
              <p className="text-gray-400">
                Our collection spans across {countryStats.length} countries, 
                bringing you diverse entertainment from around the world.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}