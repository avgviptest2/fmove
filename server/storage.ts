import { movies, episodes, type Movie, type InsertMovie, type Episode, type InsertEpisode } from "@shared/schema";
import { db } from "./db";
import { eq, like, and, or, desc, asc, count, sql } from "drizzle-orm";

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
  updateMovie(id: number, movie: InsertMovie): Promise<Movie>;
  deleteMovie(id: number): Promise<void>;
  
  // Episodes
  getEpisodes(movieId: number): Promise<Episode[]>;
  createEpisode(episode: InsertEpisode): Promise<Episode>;
}

export class DatabaseStorage implements IStorage {
  async getMovie(id: number): Promise<Movie | undefined> {
    const [movie] = await db.select().from(movies).where(eq(movies.id, id));
    return movie || undefined;
  }

  async getFeaturedMovie(): Promise<Movie | undefined> {
    const [movie] = await db.select().from(movies).where(eq(movies.featured, true));
    return movie || undefined;
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const [movie] = await db
      .insert(movies)
      .values(insertMovie)
      .returning();
    return movie;
  }

  async updateMovie(id: number, movieData: InsertMovie): Promise<Movie> {
    const [movie] = await db
      .update(movies)
      .set(movieData)
      .where(eq(movies.id, id))
      .returning();
    return movie;
  }

  async deleteMovie(id: number): Promise<void> {
    await db.delete(movies).where(eq(movies.id, id));
  }

  async getEpisodes(movieId: number): Promise<Episode[]> {
    return await db.select().from(episodes).where(eq(episodes.movieId, movieId));
  }

  async createEpisode(insertEpisode: InsertEpisode): Promise<Episode> {
    const [episode] = await db
      .insert(episodes)
      .values(insertEpisode)
      .returning();
    return episode;
  }

  async getSuggestions(): Promise<Movie[]> {
    return await db.select().from(movies).orderBy(desc(movies.rating)).limit(8);
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
    let query = db.select().from(movies);
    let countQuery = db.select({ count: count() }).from(movies);
    
    const conditions = [];

    // Apply filters
    if (filters.search) {
      const searchTerm = `%${filters.search}%`;
      conditions.push(
        or(
          like(movies.title, searchTerm),
          like(movies.description, searchTerm)
        )
      );
    }

    if (filters.type && filters.type !== 'all') {
      conditions.push(eq(movies.type, filters.type));
    }

    if (filters.year && filters.year !== 'Older') {
      if (filters.year === 'Older') {
        conditions.push(sql`${movies.year} < 2016`);
      } else {
        conditions.push(eq(movies.year, parseInt(filters.year)));
      }
    }

    if (conditions.length > 0) {
      const whereClause = and(...conditions);
      query = query.where(whereClause);
      countQuery = countQuery.where(whereClause);
    }

    // Apply sorting
    switch (filters.sort) {
      case 'latest':
        query = query.orderBy(desc(movies.year));
        break;
      case 'popular':
      case 'rating':
        query = query.orderBy(desc(movies.rating));
        break;
      case 'title':
        query = query.orderBy(asc(movies.title));
        break;
      default:
        query = query.orderBy(desc(movies.year));
    }

    // Get total count
    const [{ count: total }] = await countQuery;

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;
    
    query = query.limit(limit).offset(offset);

    const allMovies = await query;

    // Apply genre and country filters in memory (since they are array fields)
    let filteredMovies = allMovies;

    if (filters.genre) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.genres.some((genre: string) => genre.toLowerCase() === filters.genre!.toLowerCase())
      );
    }

    if (filters.country) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.countries.some((country: string) => country.toLowerCase() === filters.country!.toLowerCase())
      );
    }

    const pages = Math.ceil(total / limit);

    return {
      movies: filteredMovies,
      total,
      pages,
    };
  }
}

export const storage = new DatabaseStorage();
