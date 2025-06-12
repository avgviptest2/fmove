
import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function migrate() {
  console.log("Creating database tables...");
  
  // Drop existing tables to recreate with correct schema
  await db.execute(sql`DROP TABLE IF EXISTS episodes CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS movies CASCADE`);
  
  // Create movies table with all columns
  await db.execute(sql`
    CREATE TABLE movies (
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
      embed_url TEXT,
      genres TEXT[] NOT NULL,
      countries TEXT[] NOT NULL,
      type TEXT NOT NULL,
      featured BOOLEAN DEFAULT false
    )
  `);

  // Create episodes table
  await db.execute(sql`
    CREATE TABLE episodes (
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
