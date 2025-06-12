import MovieCard from './MovieCard';
import type { Movie } from '@shared/schema';

interface MovieGridProps {
  movies: Movie[];
  title: string;
  onWatch: (movieId: number) => void;
  onDetails: (movieId: number) => void;
}

export default function MovieGrid({ movies, title, onWatch, onDetails }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6 text-accent-cyan">{title}</h2>
        <div className="text-center py-8 text-gray-400">
          No movies found matching your criteria.
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-6 text-accent-cyan">{title}</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onWatch={onWatch}
            onDetails={onDetails}
          />
        ))}
      </div>
    </section>
  );
}
