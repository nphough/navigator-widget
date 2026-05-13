import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useFilterStore } from '@/store/filters';
import { getCurrentLocation, GeolocationError } from '@/lib/geolocation';

// Icons
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const radiusOptions = [
  { value: '5', label: '5 miles' },
  { value: '10', label: '10 miles' },
  { value: '25', label: '25 miles' },
  { value: '50', label: '50 miles' },
  { value: '100', label: '100 miles' },
];

export function SearchBar() {
  const {
    query,
    radius,
    setQuery,
    setNear,
    setRadius,
  } = useFilterStore();

  const [searchText, setSearchText] = useState(query);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const autocompleteRef = useRef<any>(null);

  // Update internal state when store changes
  useEffect(() => {
    setSearchText(query);
  }, [query]);

  // Handle search text changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchText);
  };

  // Handle "Use my location" button
  const handleUseMyLocation = async () => {
    setLocationLoading(true);
    try {
      const location = await getCurrentLocation();
      setNear(location);
      setLocationInput('Your location');
    } catch (error) {
      if (error instanceof GeolocationError) {
        alert(`Location access failed: ${error.message}`);
      } else {
        alert('Failed to get your location. Please try again.');
      }
    } finally {
      setLocationLoading(false);
    }
  };

  // Handle radius changes
  const handleRadiusChange = (value: string) => {
    setRadius(parseInt(value));
  };

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google?.maps?.places) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteRef.current,
        {
          fields: ['geometry', 'formatted_address'],
          types: ['geocode'],
        }
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          setNear(location);
          setLocationInput(place.formatted_address || '');
        }
      });
    }
  }, [setNear]);

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <form onSubmit={handleSearchSubmit} className="space-y-4">
        {/* Search and Location Row */}
        <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
          {/* Text Search */}
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search businesses and events..."
              value={searchText}
              onChange={handleSearchChange}
              leftIcon={<SearchIcon />}
            />
          </div>

          {/* Location Input */}
          <div className="flex-1">
            <div className="flex space-x-2">
              <Input
                ref={autocompleteRef}
                type="text"
                placeholder="Enter location..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                leftIcon={<LocationIcon />}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleUseMyLocation}
                disabled={locationLoading}
                className="whitespace-nowrap"
              >
                {locationLoading ? (
                  <div className="loading-spinner" />
                ) : (
                  'Use My Location'
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Radius and Search Button Row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="w-full sm:w-40">
            <Select
              label="Radius"
              options={radiusOptions}
              value={radius.toString()}
              onChange={handleRadiusChange}
            />
          </div>
          
          <Button
            type="submit"
            className="sm:w-auto w-full"
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  );
}