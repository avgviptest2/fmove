import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Edit, Trash2, Search, Save, X, HardDrive } from 'lucide-react';
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
import { insertMovieSchema, insertServerSchema } from '@shared/schema';
import type { Movie, InsertMovie, Server as ServerType, InsertServer } from '@shared/schema';
import { GENRES, COUNTRIES } from '@/lib/constants';
import { z } from 'zod';

// Extended schema for movie with servers
const movieWithServersSchema = insertMovieSchema.omit({
  play_url: true,
  embed_url: true
}).extend({
  servers: z.array(insertServerSchema.omit({ movieId: true })).min(1, "At least one server is required")
});

type MovieWithServers = z.infer<typeof movieWithServersSchema>;

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

  const form = useForm<MovieWithServers>({
    resolver: zodResolver(movieWithServersSchema),
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
      trailer_url: '',
      featured: false,
      servers: [
        { name: 'Server 1', url: '', type: 'direct', quality: 'HD' },
        { name: 'Server 2', url: '', type: 'embed', quality: 'HD' },
        { name: 'Server 3', url: '', type: 'direct', quality: 'Full HD' }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "servers"
  });

  const createMovieMutation = useMutation({
    mutationFn: async (movieData: MovieWithServers) => {
      try {
        // Create movie first
        const { servers, ...movieInfo } = movieData;
        const movie = await apiRequest(`/api/movies`, {
          method: 'POST',
          body: JSON.stringify(movieInfo)
        });

        // Then create servers for the movie with error handling
        const serverPromises = servers
          .filter(server => server.url && server.url.trim())
          .map(async (server) => {
            try {
              return await apiRequest(`/api/movies/${movie.id}/servers`, {
                method: 'POST',
                body: JSON.stringify({
                  ...server,
                  movieId: movie.id
                })
              });
            } catch (error) {
              console.log(`Failed to create server ${server.name}:`, error);
              // Don't throw here to allow other servers to be created
              return null;
            }
          });

        // Wait for all server operations to complete
        await Promise.allSettled(serverPromises);

        return movie;
      } catch (error) {
        console.error('Error in createMovieMutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/movies'] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Thành công",
        description: "Phim và server đã được tạo thành công"
      });
    },
    onError: (error) => {
      console.error('Create movie error:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo phim. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  });

  const updateMovieMutation = useMutation({
    mutationFn: async (data: { id: number; movieData: MovieWithServers }) => {
      const { id, movieData } = data;
      const { servers, ...movieInfo } = movieData;

      try {
        // Update movie first
        const movie = await apiRequest(`/api/movies/${id}`, {
          method: 'PUT',
          body: JSON.stringify(movieInfo),
        });

        // Get existing servers
        let existingServers = [];
        try {
          existingServers = await apiRequest(`/api/movies/${id}/servers`);
        } catch (error) {
          console.log('No existing servers found or error fetching servers');
        }
        
        // Delete existing servers with error handling
        for (const server of existingServers) {
          try {
            await apiRequest(`/api/movies/${id}/servers/${server.id}`, {
              method: 'DELETE'
            });
          } catch (error) {
            console.log(`Failed to delete server ${server.id}:`, error);
            // Continue with other servers
          }
        }

        // Create new servers with error handling
        const serverPromises = servers
          .filter(server => server.url && server.url.trim())
          .map(async (server) => {
            try {
              return await apiRequest(`/api/movies/${id}/servers`, {
                method: 'POST',
                body: JSON.stringify({
                  ...server,
                  movieId: id
                })
              });
            } catch (error) {
              console.log(`Failed to create server ${server.name}:`, error);
              throw error;
            }
          });

        // Wait for all server operations to complete
        await Promise.allSettled(serverPromises);

        return movie;
      } catch (error) {
        console.error('Error in updateMovieMutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/movies'] });
      setEditingMovie(null);
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Thành công",
        description: "Phim và server đã được cập nhật thành công"
      });
    },
    onError: (error) => {
      console.error('Update movie error:', error);
      toast({
        title: "Lỗi", 
        description: "Không thể cập nhật phim. Vui lòng thử lại.",
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

  const onSubmit = async (values: MovieWithServers) => {
    try {
      if (editingMovie) {
        await updateMovieMutation.mutateAsync({
          id: editingMovie.id,
          movieData: values
        });
      } else {
        await createMovieMutation.mutateAsync(values);
      }
    } catch (error) {
      console.error('Movie operation error:', error);
    }
  };

  const handleEdit = async (movie: Movie) => {
    setEditingMovie(movie);
    
    // Fetch servers for this movie
    try {
      const servers = await apiRequest(`/api/movies/${movie.id}/servers`);
      
      form.reset({
        title: movie.title,
        description: movie.description,
        year: movie.year,
        duration: movie.duration,
        type: movie.type as "movie" | "tv",
        genres: movie.genres,
        countries: movie.countries,
        quality: movie.quality,
        rating: movie.rating || 7.0,
        poster: movie.poster,
        backdrop: movie.backdrop || '',
        trailer_url: movie.trailer_url || '',
        featured: movie.featured || false,
        servers: servers.length > 0 ? servers.map((s: ServerType) => ({
          name: s.name,
          url: s.url,
          type: s.type as "direct" | "embed",
          quality: s.quality || 'HD'
        })) : [
          { name: 'Server 1', url: '', type: 'direct', quality: 'HD' },
          { name: 'Server 2', url: '', type: 'embed', quality: 'HD' },
          { name: 'Server 3', url: '', type: 'direct', quality: 'Full HD' }
        ]
      });
    } catch (error) {
      console.error('Failed to fetch servers:', error);
      // Set default servers if fetch fails
      form.reset({
        title: movie.title,
        description: movie.description,
        year: movie.year,
        duration: movie.duration,
        type: movie.type as "movie" | "tv",
        genres: movie.genres,
        countries: movie.countries,
        quality: movie.quality,
        rating: movie.rating || 7.0,
        poster: movie.poster,
        backdrop: movie.backdrop || '',
        trailer_url: movie.trailer_url || '',
        featured: movie.featured || false,
        servers: [
          { name: 'Server 1', url: '', type: 'direct', quality: 'HD' },
          { name: 'Server 2', url: '', type: 'embed', quality: 'HD' },
          { name: 'Server 3', url: '', type: 'direct', quality: 'Full HD' }
        ]
      });
    }
    
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
            <p className="text-gray-400">Manage movies and servers</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew} className="bg-accent-cyan hover:bg-accent-cyan-hover">
                <Plus className="w-4 h-4 mr-2" />
                Add Movie
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-dark-secondary border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingMovie ? 'Edit Movie' : 'Add New Movie'}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  {editingMovie ? 'Update movie information and servers' : 'Fill in the details to add a new movie with servers'}
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Movie Info */}
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
                          <FormLabel className="text-gray-300">Duration (minutes)</FormLabel>
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
                              min="0"
                              max="10"
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              className="bg-dark-tertiary border-gray-600 text-white" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Servers Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <HardDrive className="w-5 h-5 mr-2" />
                        Servers
                      </h3>
                      <Button
                        type="button"
                        onClick={() => append({ name: `Server ${fields.length + 1}`, url: '', type: 'direct', quality: 'HD' })}
                        className="bg-accent-cyan hover:bg-accent-cyan-hover"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Server
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <Card key={field.id} className="bg-dark-tertiary border-gray-600">
                          <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <FormField
                                control={form.control}
                                name={`servers.${index}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">Server Name</FormLabel>
                                    <FormControl>
                                      <Input {...field} className="bg-dark-primary border-gray-600 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`servers.${index}.url`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">URL</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="https://..." className="bg-dark-primary border-gray-600 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`servers.${index}.type`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="bg-dark-primary border-gray-600 text-white">
                                          <SelectValue />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="bg-dark-primary border-gray-600">
                                        <SelectItem value="direct">Direct (Video Player)</SelectItem>
                                        <SelectItem value="embed">Embed (iframe)</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="flex items-end gap-2">
                                <FormField
                                  control={form.control}
                                  name={`servers.${index}.quality`}
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormLabel className="text-gray-300">Quality</FormLabel>
                                      <FormControl>
                                        <Input {...field} value={field.value || ''} placeholder="HD, Full HD..." className="bg-dark-primary border-gray-600 text-white" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                {fields.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => remove(index)}
                                    className="border-red-600 text-red-400 hover:bg-red-600/10"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-accent-cyan hover:bg-accent-cyan-hover"
                      disabled={createMovieMutation.isPending || updateMovieMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingMovie ? 'Update Movie' : 'Create Movie'}
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
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-dark-secondary border-gray-600 text-white"
            />
          </div>
        </div>

        {/* Movies Grid */}
        {isLoading ? (
          <div className="text-center text-gray-400 py-8">Loading movies...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <Card key={movie.id} className="bg-dark-secondary border-gray-700 hover:border-accent-cyan transition-colors">
                <div className="relative">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-60 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEdit(movie)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(movie.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{movie.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                    <span>{movie.year}</span>
                    <Badge variant="secondary" className="bg-accent-cyan/20 text-accent-cyan">
                      {movie.type}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-3">{movie.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}