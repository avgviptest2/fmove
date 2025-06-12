
import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function migrate() {
  console.log("Creating database tables...");
  
  // Create movies table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS movies (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      year INTEGER NOT NULL,
      duration INTEGER NOT NULL,
      rating REAL,
      quality TEXT NOT NULL,
      poster TEXT NOT NULL,
      backdrop TEXT,
      play_url TEXT,
      trailer_url TEXT,
      genres TEXT[] NOT NULL,
      countries TEXT[] NOT NULL,
      type TEXT NOT NULL,
      featured BOOLEAN DEFAULT false
    )
  `);

  // Create episodes table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS episodes (
      id SERIAL PRIMARY KEY,
      movie_id INTEGER REFERENCES movies(id) NOT NULL,
      season INTEGER NOT NULL,
      episode INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      duration INTEGER
    )
  `);

  console.log("Database tables created successfully!");
}

migrate().catch(console.error);
