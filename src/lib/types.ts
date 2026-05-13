// Mirror of API response types from the Navigator backend

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  logoUrl: string | null;
}

export interface BrandResponse {
  brand: Brand;
}

export interface ListingItem {
  entityType: 'business' | 'event';
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  categoryName: string | null;
  subcategoryName: string | null;
  city: string | null;
  state: string | null;
  formattedAddress: string | null;
  lat: number | null;
  lng: number | null;
  distanceMiles: number | null;
  format: 'IN_PERSON' | 'ONLINE' | 'HYBRID';
  alcoholFreeStatus: 'ALCOHOL_FREE' | 'HAS_AF_OPTIONS';
  website: string | null;
  detailUrl: string;
  startDateTime: string | null; // ISO8601 for events
  endDateTime: string | null; // ISO8601 for events
}

export interface CategoryFacet {
  id: string;
  name: string;
  count: number;
}

export interface SubcategoryFacet {
  id: string;
  parentId: string;
  name: string;
  count: number;
}

export interface Facets {
  categories: CategoryFacet[];
  subcategories: SubcategoryFacet[];
}

export interface ListingsResponse {
  items: ListingItem[];
  cursor: string | null;
  total: number;
  facets: Facets;
}

// Widget configuration and state types

export interface Location {
  lat: number;
  lng: number;
}

export interface FilterState {
  query: string;
  near: Location | null;
  radius: number; // miles, default 25
  types: ('business' | 'event')[];
  categoryIds: string[];
  subcategoryIds: string[];
  onlineOnly: boolean;
  afOnly: boolean;
  sort: 'relevance' | 'distance';
}

export interface ListingsParams extends Omit<FilterState, 'types'> {
  types?: string; // comma-separated for API
  categoryIds?: string; // comma-separated for API
  subcategoryIds?: string; // comma-separated for API
  near?: string; // lat,lng for API
  cursor?: string;
  limit?: number;
}

// Google Maps types
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

// UI State types
export interface UIState {
  isLoading: boolean;
  error: string | null;
  isMobile: boolean;
  showFilters: boolean;
  mapView: 'map' | 'list' | 'both';
}