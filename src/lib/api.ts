import { BrandResponse, ListingsResponse, ListingsParams } from './types';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithError(url: string, options?: RequestInit): Promise<Response> {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(
      errorData.error || `HTTP ${response.status}`,
      response.status,
      errorData.code
    );
  }
  
  return response;
}

export class NavigatorAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getBrand(): Promise<BrandResponse> {
    const url = new URL('/api/proxy/brand', window.location.origin);
    url.searchParams.set('k', this.apiKey);

    const response = await fetchWithError(url.toString());
    return response.json();
  }

  async getListings(params: ListingsParams = {}): Promise<ListingsResponse> {
    const url = new URL('/api/proxy/listings', window.location.origin);
    
    // Add API key
    url.searchParams.set('k', this.apiKey);

    // Add filter parameters
    if (params.query) {
      url.searchParams.set('q', params.query);
    }

    if (params.near) {
      url.searchParams.set('near', params.near);
    }

    if (params.radius !== undefined) {
      url.searchParams.set('radius', params.radius.toString());
    }

    if (params.types) {
      url.searchParams.set('types', params.types);
    }

    if (params.categoryIds) {
      url.searchParams.set('categoryIds', params.categoryIds);
    }

    if (params.subcategoryIds) {
      url.searchParams.set('subcategoryIds', params.subcategoryIds);
    }

    if (params.onlineOnly) {
      url.searchParams.set('onlineOnly', 'true');
    }

    if (params.afOnly) {
      url.searchParams.set('afOnly', 'true');
    }

    if (params.sort) {
      url.searchParams.set('sort', params.sort);
    }

    if (params.cursor) {
      url.searchParams.set('cursor', params.cursor);
    }

    if (params.limit) {
      url.searchParams.set('limit', params.limit.toString());
    }

    const response = await fetchWithError(url.toString());
    return response.json();
  }
}

// Singleton instance - will be initialized when API key is available
let apiInstance: NavigatorAPI | null = null;

export function initializeAPI(apiKey: string): NavigatorAPI {
  apiInstance = new NavigatorAPI(apiKey);
  return apiInstance;
}

export function getAPI(): NavigatorAPI {
  if (!apiInstance) {
    throw new Error('API not initialized. Call initializeAPI first.');
  }
  return apiInstance;
}

export { ApiError };