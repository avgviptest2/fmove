import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Hero from '@/components/Hero';
import MovieGrid from '@/components/MovieGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { Movie } from '@shared/schema';

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: featuredMovie } = useQuery<Movie>({
    queryKey: ['/api/movies/featured'],
  });

  const { data: suggestions } = useQuery<Movie[]>({
    queryKey: ['/api/movies/suggestions'],
  });

  const { data: latestMovies } = useQuery<Movie[]>({
    queryKey: ['/api/movies?type=movie&sort=latest&limit=8'],
  });

  const { data: latestTVSeries } = useQuery<Movie[]>({
    queryKey: ['/api/movies?type=tv&sort=latest&limit=8'],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleWatchNow = (movieId: number) => {
    setLocation(`/movie/${movieId}`);
  };

  const handleMovieDetails = (movieId: number) => {
    setLocation(`/movie/${movieId}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {featuredMovie && (
        <Hero movie={featuredMovie} onWatchNow={handleWatchNow} />
      )}

      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <section className="text-center mb-12">
          <div className="bg-accent-cyan inline-block px-6 py-2 rounded-md text-2xl font-bold mb-6 text-white">
            FMOVIES
          </div>
          <p className="text-gray-300 mb-8">fmovies.to - Just a better place for watching online movies for free!</p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex">
            <Input
              type="text"
              placeholder="Enter Movies or Series name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-white text-gray-900 px-4 py-3 rounded-l-md border-0 focus:outline-none"
            />
            <Button 
              type="submit"
              className="bg-accent-cyan hover:bg-accent-cyan-hover px-6 py-3 rounded-r-md font-semibold transition-colors text-white"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </form>

          <div className="mt-4">
            <Button 
              variant="link" 
              onClick={() => setLocation('/movies')}
              className="text-accent-cyan hover:text-accent-cyan-hover underline"
            >
              Go to movies page
            </Button>
          </div>
        </section>

        {/* Suggestions */}
        {suggestions && suggestions.length > 0 && (
          <MovieGrid
            movies={suggestions}
            title="SUGGESTIONS"
            onWatch={handleWatchNow}
            onDetails={handleMovieDetails}
          />
        )}

        {/* Latest Movies */}
        {latestMovies && latestMovies.length > 0 && (
          <MovieGrid
            movies={latestMovies}
            title="Latest Movies"
            onWatch={handleWatchNow}
            onDetails={handleMovieDetails}
          />
        )}

        {/* Latest TV Series */}
        {latestTVSeries && latestTVSeries.length > 0 && (
          <MovieGrid
            movies={latestTVSeries}
            title="Latest TV-Series"
            onWatch={handleWatchNow}
            onDetails={handleMovieDetails}
          />
        )}
      </main>
    </div>
  );
}