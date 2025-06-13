import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import MovieGrid from "@/components/MovieGrid";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Movie, MovieFilters } from "@shared/schema";

export default function Movies() {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState<MovieFilters>({
    sort: "latest",
    type: "all",
    page: 1,
  });

  // Parse URL search params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newFilters: MovieFilters = { page: 1 };

    if (params.get("search")) newFilters.search = params.get("search")!;
    if (params.get("type")) newFilters.type = params.get("type") as any;
    if (params.get("genre")) newFilters.genre = params.get("genre")!;
    if (params.get("country")) newFilters.country = params.get("country")!;
    if (params.get("year")) newFilters.year = params.get("year")!;
    if (params.get("sort")) newFilters.sort = params.get("sort") as any;
    if (params.get("page"))
      newFilters.page = parseInt(params.get("page")!) || 1;

    setFilters(newFilters);
  }, []);

  // Build query string for API call
  const queryString = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "all") {
      queryString.append(key, value.toString());
    }
  });

  const { data: moviesData, isLoading } = useQuery<{
    movies: Movie[];
    total: number;
    pages: number;
  }>({
    queryKey: [`/api/movies?${queryString.toString()}`],
  });

  const handleFiltersChange = (newFilters: MovieFilters) => {
    const updatedFilters = { ...newFilters, page: 1 };
    setFilters(updatedFilters);

    // Update URL
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== "all" && value !== "") {
        params.append(key, value.toString());
      }
    });

    const newUrl = `/movies${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.pushState({}, "", newUrl);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== "all" && value !== "") {
        params.append(key, value.toString());
      }
    });

    const newUrl = `/movies${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.pushState({}, "", newUrl);
  };

  const handleWatchNow = (movieId: number) => {
    setLocation(`/movie/${movieId}`);
  };

  const handleMovieDetails = (movieId: number) => {
    setLocation(`/movie/${movieId}`);
  };

  const movies = moviesData?.movies || [];
  const totalPages = moviesData?.pages || 1;
  const currentPage = filters.page || 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <Sidebar filters={filters} onFiltersChange={handleFiltersChange} />

        {/* Main Content */}
        <main className="lg:col-span-3">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-400">Loading movies...</div>
            </div>
          ) : (
            <>
              <MovieGrid
                movies={movies}
                title={
                  filters.search
                    ? `Search Results for "${filters.search}"`
                    : "All Movies"
                }
                onWatch={(movieId) => setLocation(`/movie/${movieId}`)}
                onDetails={handleMovieDetails}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="px-3 py-2 text-sm bg-dark-secondary text-gray-400 hover:bg-dark-tertiary disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>

                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm ${
                            page === currentPage
                              ? "bg-accent-cyan text-white"
                              : "bg-dark-secondary text-gray-300 hover:bg-dark-tertiary"
                          }`}
                        >
                          {page}
                        </Button>
                      );
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="px-3 py-2 text-sm text-gray-400">
                          ...
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
                          className="px-3 py-2 text-sm bg-dark-secondary text-gray-300 hover:bg-dark-tertiary"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="px-3 py-2 text-sm bg-dark-secondary text-gray-300 hover:bg-dark-tertiary disabled:opacity-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
