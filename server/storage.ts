import { movies, episodes, type Movie, type InsertMovie, type Episode, type InsertEpisode } from "@shared/schema";

export interface IStorage {
  // Movies
  getMovies(filters?: {
    search?: string;
    type?: 'movie' | 'tv' | 'all';
    genre?: string;
    country?: string;
    year?: string;
    sort?: 'latest' | 'popular' | 'rating' | 'title';
    page?: number;
    limit?: number;
  }): Promise<{ movies: Movie[], total: number, pages: number }>;
  getMovie(id: number): Promise<Movie | undefined>;
  getFeaturedMovie(): Promise<Movie | undefined>;
  getSuggestions(): Promise<Movie[]>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  
  // Episodes
  getEpisodes(movieId: number): Promise<Episode[]>;
  createEpisode(episode: InsertEpisode): Promise<Episode>;
}

export class MemStorage implements IStorage {
  private movies: Map<number, Movie>;
  private episodes: Map<number, Episode>;
  private currentMovieId: number;
  private currentEpisodeId: number;

  constructor() {
    this.movies = new Map();
    this.episodes = new Map();
    this.currentMovieId = 1;
    this.currentEpisodeId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleMovies: InsertMovie[] = [
      {
        title: "Captain America: Brave New World",
        description: "After meeting with newly elected U.S. President Thaddeus Ross, Sam finds himself in the middle of an international incident. He must discover the conspiracy behind a global threat while navigating complex political landscapes.",
        year: 2024,
        duration: 119,
        rating: 7.2,
        quality: "HD",
        poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdrop: "https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        genres: ["Action", "Adventure", "Sci-Fi"],
        countries: ["United States"],
        type: "movie",
        featured: true,
      },
      {
        title: "A Minecraft Movie",
        description: "Four misfits—Garrett 'The Garbage Man' Garrison, Henry, Natalie and Dawn—find themselves struggling with ordinary problems when they are suddenly pulled through a mysterious portal into the Overworld.",
        year: 2025,
        duration: 97,
        rating: 6.8,
        quality: "HD",
        poster: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=400&h=600",
        backdrop: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&h=675",
        genres: ["Adventure", "Animation", "Family"],
        countries: ["United States"],
        type: "movie",
        featured: false,
      },
      {
        title: "Thunderbolts",
        description: "A group of supervillains are recruited by the government to undertake dangerous missions in exchange for reduced sentences. They must learn to work together to face an even greater threat.",
        year: 2024,
        duration: 134,
        rating: 7.5,
        quality: "HD",
        poster: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=400&h=600",
        backdrop: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=1200&h=675",
        genres: ["Action", "Adventure", "Comedy"],
        countries: ["United States"],
        type: "movie",
        featured: false,
      },
      {
        title: "Black Bag",
        description: "A married couple's world is turned upside down when the wife discovers her husband's double life as a spy. Now they must work together to survive as they become targets themselves.",
        year: 2024,
        duration: 108,
        rating: 6.9,
        quality: "HD",
        poster: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=400&h=600",
        backdrop: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&h=675",
        genres: ["Thriller", "Action", "Drama"],
        countries: ["United States"],
        type: "movie",
        featured: false,
      },
      {
        title: "The Electric State",
        description: "In a retro-futuristic world, a teenage girl and her robot companion search for her missing brother while navigating a reality where robots and humans coexist uneasily.",
        year: 2025,
        duration: 115,
        rating: 7.1,
        quality: "HD",
        poster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=400&h=600",
        backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1200&h=675",
        genres: ["Sci-Fi", "Adventure", "Drama"],
        countries: ["United States"],
        type: "movie",
        featured: false,
      },
      {
        title: "Venom: The Last Dance",
        description: "Eddie Brock and Venom are forced into hiding when a powerful new enemy threatens both their worlds. This final chapter explores the bond between host and symbiote as they face their greatest challenge yet.",
        year: 2024,
        duration: 130,
        rating: 7.3,
        quality: "HD",
        poster: "https://images.unsplash.com/photo-1609743522653-52354461eb27?auto=format&fit=crop&w=400&h=600",
        backdrop: "https://images.unsplash.com/photo-1609743522653-52354461eb27?auto=format&fit=crop&w=1200&h=675",
        genres: ["Action", "Sci-Fi", "Thriller"],
        countries: ["United States"],
        type: "movie",
        featured: false,
      },
      {
        title: "Babygirl",
        description: "A successful CEO puts her career and family on the line when she begins a torrid affair with her much younger intern, exploring themes of power, desire, and consequence.",
        year: 2024,
        duration: 114,
        rating: 6.7,
        quality: "HD",
        poster: "https://images.unsplash.com/photo-1494790108755-2616c669c7e3?auto=format&fit=crop&w=400&h=600",
        backdrop: "https://images.unsplash.com/photo-1494790108755-2616c669c7e3?auto=format&fit=crop&w=1200&h=675",
        genres: ["Drama", "Romance", "Thriller"],
        countries: ["United States"],
        type: "movie",
        featured: false,
      },
      {
        title: "Nosferatu",
        description: "A gothic tale of obsession between a haunted young woman and the terrifying vampire infatuated with her, causing untold horror in its wake.",
        year: 2024,
        duration: 132,
        rating: 8.1,
        quality: "HD",
        poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&h=600",
        backdrop: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&h=675",
        genres: ["Horror", "Drama", "Fantasy"],
        countries: ["United States", "Germany"],
        type: "movie",
        featured: false,
      },
      // TV Series
      {
        title: "Stick - Season 1",
        description: "A gripping crime drama following an undercover detective who infiltrates a dangerous criminal organization, blurring the lines between law and lawlessness.",
        year: 2024,
        duration: 50,
        rating: 8.3,
        quality: "HD",
        poster: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=400&h=600",
        backdrop: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&h=675",
        genres: ["Crime", "Drama", "Thriller"],
        countries: ["United States"],
        type: "tv",
        featured: false,
      },
      {
        title: "Nine Perfect Strangers - Season 2",
        description: "Nine stressed city dwellers try to get on a path to a better way of living at a remote wellness retreat run by a mysterious woman with an unorthodox approach.",
        year: 2024,
        duration: 55,
        rating: 7.2,
        quality: "HD",
        poster: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&h=600",
        backdrop: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&h=675",
        genres: ["Drama", "Mystery", "Thriller"],
        countries: ["United States"],
        type: "tv",
        featured: false,
      },
      {
        title: "Rick and Morty - Season 8",
        description: "The misadventures of an alcoholic scientist and his good-hearted but easily influenced grandson continue across multiple dimensions and realities.",
        year: 2024,
        duration: 22,
        rating: 9.1,
        quality: "HD",
        poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=400&h=600",
        backdrop: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=1200&h=675",
        genres: ["Animation", "Comedy", "Sci-Fi"],
        countries: ["United States"],
        type: "tv",
        featured: false,
      },
      {
        title: "Below Deck - Season 12",
        description: "The upstairs and downstairs worlds collide when this young and single crew of superyacht workers live, love and work together onboard a luxurious mega yacht.",
        year: 2024,
        duration: 45,
        rating: 7.5,
        quality: "HD",
        poster: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&h=600",
        backdrop: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&h=675",
        genres: ["Reality"],
        countries: ["United States"],
        type: "tv",
        featured: false,
      },
    ];

    // Add sample movies
    sampleMovies.forEach(movieData => {
      const movie: Movie = { ...movieData, id: this.currentMovieId++ };
      this.movies.set(movie.id, movie);
    });
  }

  async getMovies(filters: {
    search?: string;
    type?: 'movie' | 'tv' | 'all';
    genre?: string;
    country?: string;
    year?: string;
    sort?: 'latest' | 'popular' | 'rating' | 'title';
    page?: number;
    limit?: number;
  } = {}): Promise<{ movies: Movie[], total: number, pages: number }> {
    let filteredMovies = Array.from(this.movies.values());

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredMovies = filteredMovies.filter(movie =>
        movie.title.toLowerCase().includes(searchLower) ||
        movie.description.toLowerCase().includes(searchLower) ||
        movie.genres.some(genre => genre.toLowerCase().includes(searchLower))
      );
    }

    if (filters.type && filters.type !== 'all') {
      filteredMovies = filteredMovies.filter(movie => movie.type === filters.type);
    }

    if (filters.genre) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.genres.some(genre => genre.toLowerCase() === filters.genre!.toLowerCase())
      );
    }

    if (filters.country) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.countries.some(country => country.toLowerCase() === filters.country!.toLowerCase())
      );
    }

    if (filters.year && filters.year !== 'Older') {
      if (filters.year === 'Older') {
        filteredMovies = filteredMovies.filter(movie => movie.year < 2016);
      } else {
        filteredMovies = filteredMovies.filter(movie => movie.year.toString() === filters.year);
      }
    }

    // Apply sorting
    switch (filters.sort) {
      case 'latest':
        filteredMovies.sort((a, b) => b.year - a.year);
        break;
      case 'popular':
        filteredMovies.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'rating':
        filteredMovies.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'title':
        filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        filteredMovies.sort((a, b) => b.year - a.year);
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const total = filteredMovies.length;
    const pages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedMovies = filteredMovies.slice(startIndex, endIndex);

    return {
      movies: paginatedMovies,
      total,
      pages,
    };
  }

  async getMovie(id: number): Promise<Movie | undefined> {
    return this.movies.get(id);
  }

  async getFeaturedMovie(): Promise<Movie | undefined> {
    return Array.from(this.movies.values()).find(movie => movie.featured);
  }

  async getSuggestions(): Promise<Movie[]> {
    // Return a mix of popular movies and TV shows
    const allMovies = Array.from(this.movies.values());
    return allMovies
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 8);
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const movie: Movie = { ...insertMovie, id: this.currentMovieId++ };
    this.movies.set(movie.id, movie);
    return movie;
  }

  async getEpisodes(movieId: number): Promise<Episode[]> {
    return Array.from(this.episodes.values()).filter(episode => episode.movieId === movieId);
  }

  async createEpisode(insertEpisode: InsertEpisode): Promise<Episode> {
    const episode: Episode = { ...insertEpisode, id: this.currentEpisodeId++ };
    this.episodes.set(episode.id, episode);
    return episode;
  }
}

export const storage = new MemStorage();
