import MovieGrid from "@/components/MovieGrid";
import type { Movie } from "@shared/schema";

interface RelatedMoviesProps {
  movies: Movie[];
  currentMovieId: string | number;
  onSelect: (id: string | number) => void;
}

export default function RelatedMovies({
  movies,
  currentMovieId,
  onSelect,
}: RelatedMoviesProps) {
  if (!movies || movies.length === 0) return null;
  return (
    <div className="mt-12 sm:mt-16">
      <MovieGrid
        movies={movies.filter((m) => m.id !== currentMovieId).slice(0, 6)}
        title="Related Movies"
        onWatch={onSelect}
        onDetails={onSelect}
      />
    </div>
  );
}
