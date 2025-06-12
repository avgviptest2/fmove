
import { db } from "../server/db";
import { movies } from "@shared/schema";

async function seed() {
  console.log("Seeding database with sample data...");
  
  const sampleMovies = [
    // Featured movie
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
    // Recent movies
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
      title: "Venom: The Last Dance",
      description: "Eddie and Venom are on the run. Hunted by both of their worlds and with the net closing in, the duo are forced into a devastating decision that will bring the curtains down on Venom and Eddie's last dance.",
      year: 2024,
      duration: 109,
      rating: 6.2,
      quality: "HD",
      poster: "https://image.tmdb.org/t/p/w500/aosm8NMQ3UyoBVpSxyimorCQykC.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/aosm8NMQ3UyoBVpSxyimorCQykC.jpg",
      genres: ["Action", "Sci-Fi", "Thriller"],
      countries: ["United States"],
      type: "movie",
      featured: false
    },
    {
      title: "Terrifier 3",
      description: "Art the Clown unleashes chaos on the unsuspecting residents of Miles County as they peacefully drift off to sleep on Christmas Eve.",
      year: 2024,
      duration: 125,
      rating: 6.9,
      quality: "HD",
      poster: "https://image.tmdb.org/t/p/w500/63xYQj1BwRFielxsBDXvHIJyXVm.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/63xYQj1BwRFielxsBDXvHIJyXVm.jpg",
      genres: ["Horror", "Thriller"],
      countries: ["United States"],
      type: "movie",
      featured: false
    },
    {
      title: "Smile 2",
      description: "About to embark on a new world tour, global pop sensation Skye Riley begins experiencing increasingly terrifying and inexplicable events.",
      year: 2024,
      duration: 127,
      rating: 6.8,
      quality: "HD",
      poster: "https://image.tmdb.org/t/p/w500/aE85MnPIsSoSs3978Noo16BRsKN.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/aE85MnPIsSoSs3978Noo16BRsKN.jpg",
      genres: ["Horror", "Mystery", "Thriller"],
      countries: ["United States"],
      type: "movie",
      featured: false
    },
    // Classic movies
    {
      title: "The Avengers",
      description: "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
      year: 2012,
      duration: 143,
      rating: 8.0,
      quality: "HD",
      poster: "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
      genres: ["Action", "Adventure", "Sci-Fi"],
      countries: ["United States"],
      type: "movie",
      featured: false
    },
    {
      title: "Avatar",
      description: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
      year: 2009,
      duration: 162,
      rating: 7.9,
      quality: "HD",
      poster: "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
      genres: ["Action", "Adventure", "Fantasy", "Sci-Fi"],
      countries: ["United States"],
      type: "movie",
      featured: false
    },
    {
      title: "Titanic",
      description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
      year: 1997,
      duration: 194,
      rating: 7.9,
      quality: "HD",
      poster: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
      genres: ["Drama", "Romance"],
      countries: ["United States"],
      type: "movie",
      featured: false
    },
    {
      title: "The Dark Knight",
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      year: 2008,
      duration: 152,
      rating: 9.0,
      quality: "HD",
      poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      genres: ["Action", "Crime", "Drama"],
      countries: ["United States"],
      type: "movie",
      featured: false
    },
    // Korean movies
    {
      title: "Parasite",
      description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
      year: 2019,
      duration: 132,
      rating: 8.5,
      quality: "HD",
      poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
      genres: ["Comedy", "Thriller", "Drama"],
      countries: ["South Korea"],
      type: "movie",
      featured: false
    },
    {
      title: "Train to Busan",
      description: "A father and his daughter board a train heading from Seoul to Busan, but when a zombie outbreak breaks out in the country, passengers must fight for their lives.",
      year: 2016,
      duration: 118,
      rating: 7.6,
      quality: "HD",
      poster: "https://image.tmdb.org/t/p/w500/1NgFtPJnyhIqH7dWREqPdP3FpqO.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/1NgFtPJnyhIqH7dWREqPdP3FpqO.jpg",
      genres: ["Action", "Horror", "Thriller"],
      countries: ["South Korea"],
      type: "movie",
      featured: false
    },
    // TV Series
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
    },
    {
      title: "Stranger Things",
      description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
      year: 2016,
      duration: 51,
      rating: 8.7,
      quality: "HD",
      poster: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
      genres: ["Drama", "Fantasy", "Horror"],
      countries: ["United States"],
      type: "tv",
      featured: false
    },
    {
      title: "Game of Thrones",
      description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
      year: 2011,
      duration: 57,
      rating: 9.2,
      quality: "HD",
      poster: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
      genres: ["Action", "Adventure", "Drama"],
      countries: ["United States"],
      type: "tv",
      featured: false
    },
    {
      title: "The Witcher",
      description: "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.",
      year: 2019,
      duration: 60,
      rating: 8.2,
      quality: "HD",
      poster: "https://image.tmdb.org/t/p/w500/cZ0d3rtvXPVvuiX22sP79K3Hmjz.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/cZ0d3rtvXPVvuiX22sP79K3Hmjz.jpg",
      genres: ["Action", "Adventure", "Drama"],
      countries: ["United States"],
      type: "tv",
      featured: false
    },
    {
      title: "Squid Game",
      description: "Hundreds of cash-strapped contestants accept an invitation to compete in children's games for a tempting prize, but the stakes are deadly.",
      year: 2021,
      duration: 56,
      rating: 8.0,
      quality: "HD",
      poster: "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
      genres: ["Action", "Drama", "Mystery"],
      countries: ["South Korea"],
      type: "tv",
      featured: false
    },
    {
      title: "The Boys",
      description: "A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers.",
      year: 2019,
      duration: 60,
      rating: 8.7,
      quality: "HD",
      poster: "https://image.tmdb.org/t/p/w500/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg",
      genres: ["Action", "Comedy", "Crime"],
      countries: ["United States"],
      type: "tv",
      featured: false
    },
    {
      title: "Wednesday",
      description: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends — and foes — at Nevermore Academy.",
      year: 2022,
      duration: 50,
      rating: 8.1,
      quality: "HD",
      poster: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
      genres: ["Comedy", "Crime", "Family"],
      countries: ["United States"],
      type: "tv",
      featured: false
    },
    // Anime
    {
      title: "Demon Slayer: Mugen Train",
      description: "Tanjiro Kamado, joined with Inosuke Hashibira, a boy raised by boars who wears a boar's head, and Zenitsu Agatsuma, a scared boy who reveals his true power when he sleeps, boards the Infinity Train on a new mission.",
      year: 2020,
      duration: 117,
      rating: 8.2,
      quality: "HD",
      poster: "https://image.tmdb.org/t/p/w500/h8Rb9gBr48ODIwYUttZNYeMWeKU.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/h8Rb9gBr48ODIwYUttZNYeMWeKU.jpg",
      genres: ["Animation", "Action", "Adventure"],
      countries: ["Japan"],
      type: "movie",
      featured: false
    },
    {
      title: "Your Name",
      description: "Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?",
      year: 2016,
      duration: 106,
      rating: 8.4,
      quality: "HD",
      poster: "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/q719jXXEzOoYaps6babgKnONONX.jpg",
      genres: ["Animation", "Romance", "Supernatural"],
      countries: ["Japan"],
      type: "movie",
      featured: false
    }
  ];

  // Clear existing data first
  await db.delete(movies);

  for (const movie of sampleMovies) {
    await db.insert(movies).values(movie);
  }

  console.log(`Database seeded successfully with ${sampleMovies.length} movies and TV shows!`);
}

seed().catch(console.error);
