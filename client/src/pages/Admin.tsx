import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Edit, Trash2, Search, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { insertMovieSchema, type Movie, type InsertMovie } from '@shared/schema';
import { GENRES, COUNTRIES } from '@/lib/constants';
import { z } from 'zod';

export default function Admin() {
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: moviesData, isLoading } = useQuery<{movies: Movie[], total: number, pages: number}>({
    queryKey: ['/api/movies', { limit: 50, search: searchQuery }],
  });

  const movies = moviesData?.movies || [];

  const form = useForm<InsertMovie>({
    resolver: zodResolver(insertMovieSchema),
    defaultValues: {
      title: '',
      description: '',
      year: new Date().getFullYear(),
      duration: 120,
      type: 'movie',
      genres: [],
      countries: [],
      quality: 'HD',
      rating: 7.0,
      poster: '',
      backdrop: '',
      play_url: '',
      trailer_url: '',
      featured: false
    }
  });

  const createMovieMutation = useMutation({
    mutationFn: (movie: InsertMovie) => apiRequest(`/api/movies`, {
      method: 'POST',
      body: JSON.stringify(movie)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/movies'] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Movie created successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create movie",
        variant: "destructive"
      });
    }
  });

  const updateMovieMutation = useMutation({
    mutationFn: async (data: { id: number } & z.infer<typeof insertMovieSchema>) => {
      const { id, ...movieData } = data;
      console.log('API call - updating movie ID:', id);
      console.log('API call - movie data:', movieData);

      const response = await apiRequest(`/api/movies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(movieData),
      });

      console.log('API response:', response);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/movies'] });
      setEditingMovie(null);
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Movie updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update movie",
        variant: "destructive"
      });
    }
  });

  const deleteMovieMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/movies/${id}`, {
      method: 'DELETE'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/movies'] });
      toast({
        title: "Success",
        description: "Movie deleted successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete movie",
        variant: "destructive"
      });
    }
  });

  const onSubmit = async (values: z.infer<typeof insertMovieSchema>) => {
    try {
      console.log('Form values before submit:', values);

      if (editingMovie) {
        console.log('Updating movie with ID:', editingMovie.id);
        const updateData = {
          id: editingMovie.id,
          ...values,
        };
        console.log('Update data being sent:', updateData);

        await updateMovieMutation.mutateAsync(updateData);
        toast({
          title: "Success",
          description: "Movie updated successfully",
        });
      } else {
        console.log('Creating new movie with data:', values);
        await createMovieMutation.mutateAsync(values);
        toast({
          title: "Success", 
          description: "Movie created successfully",
        });
      }
      setIsDialogOpen(false);
      setEditingMovie(null);
      form.reset();
    } catch (error) {
      console.error('Movie operation error:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to save movie",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    form.reset({
      title: movie.title,
      description: movie.description,
      year: movie.year,
      duration: movie.duration,
      type: movie.type,
      genres: movie.genres,
      countries: movie.countries,
      quality: movie.quality,
      rating: movie.rating,
      poster: movie.poster,
      backdrop: movie.backdrop,
      play_url: movie.play_url || '',
      trailer_url: movie.trailer_url || '',
      featured: movie.featured
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this movie?')) {
      deleteMovieMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setEditingMovie(null);
    form.reset();
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-dark-primary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage movies and TV series</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew} className="bg-accent-cyan hover:bg-accent-cyan-hover">
                <Plus className="w-4 h-4 mr-2" />
                Add Movie
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-dark-secondary border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingMovie ? 'Edit Movie' : 'Add New Movie'}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  {editingMovie ? 'Update movie information' : 'Fill in the details to add a new movie or TV series'}
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Title</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-dark-tertiary border-gray-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-dark-tertiary border-gray-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-dark-tertiary border-gray-600">
                              <SelectItem value="movie">Movie</SelectItem>
                              <SelectItem value="tv">TV Series</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="bg-dark-tertiary border-gray-600 text-white" rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Year</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              className="bg-dark-tertiary border-gray-600 text-white" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Duration (min)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number"
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              className="bg-dark-tertiary border-gray-600 text-white" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Rating</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number"
                              step="0.1"
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              className="bg-dark-tertiary border-gray-600 text-white" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="genres"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Genres</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-dark-tertiary border border-gray-600 rounded">
                                {GENRES.map((genre) => (
                                  <label key={genre} className="flex items-center space-x-2 text-sm">
                                    <input
                                      type="checkbox"
                                      checked={field.value?.includes(genre) || false}
                                      onChange={(e) => {
                                        const updatedGenres = e.target.checked
                                          ? [...(field.value || []), genre]
                                          : (field.value || []).filter(g => g !== genre);
                                        field.onChange(updatedGenres);
                                      }}
                                      className="rounded"
                                    />
                                    <span className="text-gray-300">{genre}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="countries"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Countries</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto p-2 bg-dark-tertiary border border-gray-600 rounded">
                                {COUNTRIES.map((country) => (
                                  <label key={country} className="flex items-center space-x-2 text-sm">
                                    <input
                                      type="checkbox"
                                      checked={field.value?.includes(country) || false}
                                      onChange={(e) => {
                                        const updatedCountries = e.target.checked
                                          ? [...(field.value || []), country]
                                          : (field.value || []).filter(c => c !== country);
                                        field.onChange(updatedCountries);
                                      }}
                                      className="rounded"
                                    />
                                    <span className="text-gray-300">{country}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="poster"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Poster URL</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-dark-tertiary border-gray-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="backdrop"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Backdrop URL</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-dark-tertiary border-gray-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="play_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Link Play Phim</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-dark-tertiary border-gray-600 text-white" placeholder="https://example.com/video.mp4" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                   <FormField
                    control={form.control}
                    name="trailer_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Link Trailer</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-dark-tertiary border-gray-600 text-white" placeholder="https://youtube.com/watch?v=..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="rounded"
                            />
                          </FormControl>
                          <FormLabel className="text-gray-300">
                            Featured Movie
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="border-gray-600 text-gray-300"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-accent-cyan hover:bg-accent-cyan-hover"
                      disabled={createMovieMutation.isPending || updateMovieMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingMovie ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-dark-secondary border-gray-600 text-white"
            />
          </div>
        </div>

        {/* Movies List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-gray-300">Loading movies...</div>
          </div>
        ) : (
          <div className="grid gap-4">
            {movies.map((movie) => (
              <Card key={movie.id} className="bg-dark-secondary border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <img 
                        src={movie.poster} 
                        alt={movie.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{movie.title}</h3>
                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">{movie.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="secondary" className="bg-accent-cyan text-white text-xs">
                            {movie.type === 'movie' ? 'Movie' : 'TV Series'}
                          </Badge>
                          <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                            {movie.year}
                          </Badge>
                          <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                            {movie.duration} min
                          </Badge>
                          <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                            ⭐ {movie.rating}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {movie.genres.slice(0, 3).map((genre) => (
                            <Badge key={genre} variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(movie)}
                        className="border-gray-600 text-gray-300 hover:text-accent-cyan"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(movie.id)}
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-dark-secondary border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-accent-cyan mb-2">
                {movies.length}
              </div>
              <div className="text-gray-400">Total Items</div>
            </CardContent>
          </Card>

          <Card className="bg-dark-secondary border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-accent-cyan mb-2">
                {movies.filter(m => m.type === 'movie').length}
              </div>
              <div className="text-gray-400">Movies</div>
            </CardContent>
          </Card>

          <Card className="bg-dark-secondary border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-accent-cyan mb-2">
                {movies.filter(m => m.type === 'tv').length}
              </div>
              <div className="text-gray-400">TV Series</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}