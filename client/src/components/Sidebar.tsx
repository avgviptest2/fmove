import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GENRES, COUNTRIES, YEARS, SORT_OPTIONS } from '@/lib/constants';
import type { MovieFilters } from '@shared/schema';

interface SidebarProps {
  filters: MovieFilters;
  onFiltersChange: (filters: MovieFilters) => void;
}

export default function Sidebar({ filters, onFiltersChange }: SidebarProps) {
  const updateFilter = (key: keyof MovieFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <aside className="lg:col-span-1">
      <div className="bg-dark-secondary rounded-lg p-6 sticky top-24">
        <h3 className="text-lg font-semibold mb-4 text-accent-cyan">Filter</h3>
        
        {/* Sort By */}
        <div className="mb-6">
          <Label className="font-medium mb-3 block text-white">Sort by</Label>
          <Select 
            value={filters.sort || 'latest'} 
            onValueChange={(value) => updateFilter('sort', value)}
          >
            <SelectTrigger className="w-full bg-dark-tertiary border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-dark-tertiary border-gray-700">
              {SORT_OPTIONS.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="text-white hover:bg-dark-primary focus:bg-dark-primary"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Film Type */}
        <div className="mb-6">
          <Label className="font-medium mb-3 block text-white">Film Type</Label>
          <RadioGroup 
            value={filters.type || 'all'} 
            onValueChange={(value) => updateFilter('type', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" className="border-gray-600 text-accent-cyan" />
              <Label htmlFor="all" className="text-sm text-gray-300">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="movie" id="movies" className="border-gray-600 text-accent-cyan" />
              <Label htmlFor="movies" className="text-sm text-gray-300">Movies</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tv" id="tv-series" className="border-gray-600 text-accent-cyan" />
              <Label htmlFor="tv-series" className="text-sm text-gray-300">TV-Series</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Release Year */}
        <div className="mb-6">
          <Label className="font-medium mb-3 block text-white">Release Year</Label>
          <Select 
            value={filters.year || 'all'} 
            onValueChange={(value) => updateFilter('year', value === 'all' ? undefined : value)}
          >
            <SelectTrigger className="w-full bg-dark-tertiary border-gray-700 text-white">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent className="bg-dark-tertiary border-gray-700">
              <SelectItem 
                value="all"
                className="text-white hover:bg-dark-primary focus:bg-dark-primary"
              >
                All Years
              </SelectItem>
              {YEARS.map((year) => (
                <SelectItem 
                  key={year} 
                  value={year}
                  className="text-white hover:bg-dark-primary focus:bg-dark-primary"
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Genre */}
        <div className="mb-6">
          <Label className="font-medium mb-3 block text-white">Genre</Label>
          <Select 
            value={filters.genre || 'all'} 
            onValueChange={(value) => updateFilter('genre', value === 'all' ? undefined : value)}
          >
            <SelectTrigger className="w-full bg-dark-tertiary border-gray-700 text-white">
              <SelectValue placeholder="All Genres" />
            </SelectTrigger>
            <SelectContent className="bg-dark-tertiary border-gray-700 max-h-48">
              <SelectItem 
                value="all"
                className="text-white hover:bg-dark-primary focus:bg-dark-primary"
              >
                All Genres
              </SelectItem>
              {GENRES.map((genre) => (
                <SelectItem 
                  key={genre} 
                  value={genre}
                  className="text-white hover:bg-dark-primary focus:bg-dark-primary"
                >
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Country */}
        <div className="mb-6">
          <Label className="font-medium mb-3 block text-white">Country</Label>
          <Select 
            value={filters.country || 'all'} 
            onValueChange={(value) => updateFilter('country', value === 'all' ? undefined : value)}
          >
            <SelectTrigger className="w-full bg-dark-tertiary border-gray-700 text-white">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent className="bg-dark-tertiary border-gray-700 max-h-48">
              <SelectItem 
                value="all"
                className="text-white hover:bg-dark-primary focus:bg-dark-primary"
              >
                All Countries
              </SelectItem>
              {COUNTRIES.map((country) => (
                <SelectItem 
                  key={country} 
                  value={country}
                  className="text-white hover:bg-dark-primary focus:bg-dark-primary"
                >
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </aside>
  );
}
