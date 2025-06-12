
import { db } from "../server/db";
import { movies } from "@shared/schema";

async function seed() {
  console.log("Seeding database with sample data...");
  
  const sampleMovies = [
    {
      title: "Captain America: Brave New World",
      description: "After meeting with newly elected U.S. President Thaddeus Ross, Sam finds himself in the middle of an international incident. He must discover the reason behind a nefarious global plot before the true mastermind has the entire world seeing red.",
      year: 2025,
      duration: 119,
      rating: 7.2,
      quality: "HD",
      poster: "https://img.cdno.my.id/cover/w_1280/h_405/captain-america-brave-new-world-1630858461.jpg",
      backdrop: "https://img.cdno.my.id/cover/w_1280/h_405/captain-america-brave-new-world-1630858461.jpg",
      genres: ["Action", "Thriller", "Sci-Fi"],
      countries: ["United States"],
      type: "movie",
      featured: true
    },
    {
      title: "Gladiator II",
      description: "Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius is forced to enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.",
      year: 2024,
      duration: 148,
      rating: 7.1,
      quality: "HD",
      poster: "https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
      genres: ["Action", "Adventure", "Drama"],
      countries: ["United States"],
      type: "movie",
      featured: false
    },
    {
      title: "Red One",
      description: "After Santa Claus (codename: Red One) is kidnapped, the North Pole's Head of Security must team up with the world's most infamous bounty hunter in a globe-trotting, action-packed mission to save Christmas.",
      year: 2024,
      duration: 123,
      rating: 6.9,
      quality: "HD",
      poster: "https://image.tmdb.org/t/p/w500/cdqLnri3NEGcmfnqwk2TSIYtddg.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/cdqLnri3NEGcmfnqwk2TSIYtddg.jpg",
      genres: ["Action", "Adventure", "Comedy"],
      countries: ["United States"],
      type: "movie",
      featured: false
    },
    {
      title: "Breaking Bad",
      description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
      year: 2008,
      duration: 47,
      rating: 9.5,
      quality: "HD",
      poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
      genres: ["Drama", "Crime", "Thriller"],
      countries: ["United States"],
      type: "tv",
      featured: false
    }
  ];

  for (const movie of sampleMovies) {
    await db.insert(movies).values(movie);
  }

  console.log("Database seeded successfully!");
}

seed().catch(console.error);
