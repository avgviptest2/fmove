import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/movies', label: 'Movies' },
    { href: '/tv-series', label: 'TV Series' },
    { href: '/genres', label: 'Genres' },
    { href: '/countries', label: 'Countries' },
  ];

  return (
    <header className="bg-dark-secondary border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="bg-accent-cyan px-3 py-1 rounded font-bold text-lg text-white cursor-pointer">
              FMOVIES
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`transition-colors font-medium cursor-pointer ${
                    location === link.href
                      ? 'text-accent-cyan'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Input
                type="text"
                placeholder="Enter Movies or Series name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-dark-tertiary border-gray-700 rounded-md px-4 py-2 pr-10 w-64 focus:outline-none focus:border-accent-cyan text-sm text-white placeholder-gray-400"
              />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-accent-cyan p-1"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-300 hover:text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`transition-colors cursor-pointer ${
                      location === link.href
                        ? 'text-accent-cyan'
                        : 'text-gray-300 hover:text-white'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
            
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mt-4 sm:hidden">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search movies or series..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-dark-tertiary border-gray-700 rounded-md px-4 py-2 pr-10 w-full focus:outline-none focus:border-accent-cyan text-sm text-white placeholder-gray-400"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-accent-cyan p-1"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
