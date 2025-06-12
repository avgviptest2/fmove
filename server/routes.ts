import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { filterSchema, insertMovieSchema, insertEpisodeSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get movies with filtering and pagination
  app.get("/api/movies", async (req, res) => {
    try {
      const filters = filterSchema.parse({
        search: req.query.search || undefined,
        type: req.query.type || undefined,
        genre: req.query.genre || undefined,
        country: req.query.country || undefined,
        year: req.query.year || undefined,
        sort: req.query.sort || undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
      });

      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const result = await storage.getMovies({ ...filters, limit });
      
      res.json(result);
    } catch (error) {
      console.error("Movies filter error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid filter parameters", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get featured movie
  app.get("/api/movies/featured", async (req, res) => {
    try {
      const movie = await storage.getFeaturedMovie();
      if (!movie) {
        return res.status(404).json({ message: "No featured movie found" });
      }
      res.json(movie);
    } catch (error) {
      console.error("Featured movie error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get movie suggestions
  app.get("/api/movies/suggestions", async (req, res) => {
    try {
      const suggestions = await storage.getSuggestions();
      res.json(suggestions);
    } catch (error) {
      console.error("Suggestions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get single movie by ID
  app.get("/api/movies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid movie ID" });
      }

      const movie = await storage.getMovie(id);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      res.json(movie);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get episodes for a TV series
  app.get("/api/movies/:id/episodes", async (req, res) => {
    try {
      const movieId = parseInt(req.params.id);
      if (isNaN(movieId)) {
        return res.status(400).json({ message: "Invalid movie ID" });
      }

      const movie = await storage.getMovie(movieId);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      if (movie.type !== 'tv') {
        return res.status(400).json({ message: "Not a TV series" });
      }

      const episodes = await storage.getEpisodes(movieId);
      res.json(episodes);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create new movie
  app.post("/api/movies", async (req, res) => {
    try {
      const movieData = insertMovieSchema.parse(req.body);
      const movie = await storage.createMovie(movieData);
      res.status(201).json(movie);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid movie data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update movie
  app.put("/api/movies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid movie ID" });
      }

      const existingMovie = await storage.getMovie(id);
      if (!existingMovie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      console.log("Update request body:", JSON.stringify(req.body, null, 2));
      
      const movieData = insertMovieSchema.parse(req.body);
      console.log("Parsed movie data:", JSON.stringify(movieData, null, 2));
      
      const updatedMovie = await storage.updateMovie(id, movieData);
      res.json(updatedMovie);
    } catch (error) {
      console.error("Update movie error:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        return res.status(400).json({ message: "Invalid movie data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });

  // Delete movie
  app.delete("/api/movies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid movie ID" });
      }

      const existingMovie = await storage.getMovie(id);
      if (!existingMovie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      await storage.deleteMovie(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create episode for TV series
  app.post("/api/movies/:id/episodes", async (req, res) => {
    try {
      const movieId = parseInt(req.params.id);
      if (isNaN(movieId)) {
        return res.status(400).json({ message: "Invalid movie ID" });
      }

      const movie = await storage.getMovie(movieId);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      if (movie.type !== 'tv') {
        return res.status(400).json({ message: "Not a TV series" });
      }

      const episodeData = insertEpisodeSchema.parse({
        ...req.body,
        movieId: movieId
      });
      
      const episode = await storage.createEpisode(episodeData);
      res.status(201).json(episode);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid episode data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
