import { pgTable, text, serial, integer, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  year: integer("year").notNull(),
  duration: integer("duration").notNull(), // in minutes
  rating: real("rating"), // IMDb rating
  quality: text("quality").notNull(), // HD, CAM, etc.
  poster: text("poster").notNull(), // poster image URL
  backdrop: text("backdrop"), // backdrop image URL
  play_url: text("play_url"), // video play URL
  genres: text("genres").array().notNull(),
  countries: text("countries").array().notNull(),
  type: text("type").notNull(), // 'movie' or 'tv'
  featured: boolean("featured").default(false),
});

export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  movieId: integer("movie_id").references(() => movies.id).notNull(),
  season: integer("season").notNull(),
  episode: integer("episode").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration"), // in minutes
});

export const insertMovieSchema = createInsertSchema(movies).omit({
  id: true,
});

export const insertEpisodeSchema = createInsertSchema(episodes).omit({
  id: true,
});

export type Movie = typeof movies.$inferSelect;
export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type Episode = typeof episodes.$inferSelect;
export type InsertEpisode = z.infer<typeof insertEpisodeSchema>;

// Filter types
export const filterSchema = z.object({
  search: z.string().optional(),
  type: z.enum(['all', 'movie', 'tv']).optional(),
  genre: z.string().optional(),
  country: z.string().optional(),
  year: z.string().optional(),
  sort: z.enum(['latest', 'popular', 'rating', 'title']).optional(),
  page: z.number().min(1).optional(),
});

export type MovieFilters = z.infer<typeof filterSchema>;
