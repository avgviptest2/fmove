import { Link } from 'wouter';

export default function Footer() {
  const footerLinks = [
    { href: '/', label: 'Home' },
    { href: '/movies', label: 'Movies' },
    { href: '/tv-series', label: 'TV Series' },
    { href: '/genres', label: 'Genres' },
    { href: '/countries', label: 'Countries' },
  ];

  return (
    <footer className="bg-dark-secondary border-t border-gray-800 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-400">
          <div className="bg-accent-cyan inline-block px-4 py-2 rounded text-white font-bold text-lg mb-4">
            FMOVIES
          </div>
          <p className="mb-4">fmovies.to - Just a better place for watching online movies for free!</p>
          <p className="text-sm mb-6">
            FMovies does not store any content or video on its own server and only links to it.
          </p>
          <div className="flex justify-center space-x-6 flex-wrap">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className="text-gray-400 hover:text-accent-cyan transition-colors cursor-pointer">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
