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

export class Storage implements IStorage {
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

    const conditions = [];

    if (filters.search) {
      conditions.push(like(movies.title, `%${filters.search}%`));
    }

    if (filters.type && filters.type !== 'all') {
      conditions.push(eq(movies.type, filters.type));
    }

    if (filters.genre) {
      conditions.push(sql`${movies.genres} && ARRAY[${filters.genre}]`);
    }

    if (filters.country) {
      conditions.push(sql`${movies.countries} && ARRAY[${filters.country}]`);
    }

    if (filters.year) {
      if (filters.year === 'Older') {
        conditions.push(sql`${movies.year} < 2016`);
      } else {
        conditions.push(eq(movies.year, parseInt(filters.year)));
      }
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    switch (filters.sort) {
      case 'latest':
        query = query.orderBy(desc(movies.year));
        break;
      case 'popular':
        query = query.orderBy(desc(movies.rating));
        break;
      case 'rating':
        query = query.orderBy(desc(movies.rating));
        break;
      case 'title':
        query = query.orderBy(asc(movies.title));
        break;
      default:
        query = query.orderBy(desc(movies.year));
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const results = await query.limit(limit).offset(offset);

    // Get total count for pagination
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(movies);
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions));
    }
    const [{ count }] = await countQuery;

    return {
      movies: results,
      total: count,
      pages: Math.ceil(count / limit)
    };
  }

  async getMovie(id: number): Promise<Movie | undefined> {
    const result = await db.select().from(movies).where(eq(movies.id, id)).limit(1);
    return result[0];
  }

  async getFeaturedMovie(): Promise<Movie | undefined> {
    const result = await db.select().from(movies)
      .where(eq(movies.featured, true))
      .orderBy(desc(movies.rating))
      .limit(1);
    return result[0];
  }

  async getSuggestions(): Promise<Movie[]> {
    const result = await db.select().from(movies)
      .orderBy(desc(movies.rating))
      .limit(6);
    return result;
  }

  async createMovie(movieData: InsertMovie): Promise<Movie> {
    const [movie] = await db.insert(movies).values(movieData).returning();
    return movie;
  }

  async updateMovie(id: number, movieData: InsertMovie): Promise<Movie> {
    const [movie] = await db.update(movies)
      .set(movieData)
      .where(eq(movies.id, id))
      .returning();
    return movie;
  }

  async deleteMovie(id: number): Promise<void> {
    await db.delete(episodes).where(eq(episodes.movieId, id));
    await db.delete(movies).where(eq(movies.id, id));
  }

  async getEpisodes(movieId: number): Promise<Episode[]> {
    const result = await db.select().from(episodes)
      .where(eq(episodes.movieId, movieId))
      .orderBy(asc(episodes.season), asc(episodes.episode));
    return result;
  }

  async createEpisode(episodeData: InsertEpisode): Promise<Episode> {
    const [episode] = await db.insert(episodes).values(episodeData).returning();
    return episode;
  }
}

export const storage = new Storage();