import { Libraries } from '@react-google-maps/api';

export const GOOGLE_MAPS_LIBRARIES: Libraries = ['places', 'geometry', 'geocoding'];

export const GOOGLE_MAPS_OPTIONS = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  fullscreenControl: false,
  mapTypeControl: false,
  gestureHandling: 'cooperative' as const,
  styles: [
    // Default Google Maps styling for phase 1
    // Can be customized later for branding
  ],
};

export const DEFAULT_CENTER = {
  lat: 39.8283, // US geographic center
  lng: -98.5795,
};

export const DEFAULT_ZOOM = 4;

// Map bounds for the continental US
export const US_BOUNDS = {
  north: 49.3457868, // Northern border
  south: 24.9493, // Southern border including Florida Keys
  east: -66.9513812, // Eastern border
  west: -124.7844079, // Western border
};

export function getMapBounds(items: Array<{ lat: number | null; lng: number | null }>) {
  const validPoints = items.filter(item => item.lat !== null && item.lng !== null) as Array<{ lat: number; lng: number }>;
  
  if (validPoints.length === 0) {
    return null;
  }

  const lats = validPoints.map(p => p.lat);
  const lngs = validPoints.map(p => p.lng);

  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs),
  };
}

export function getCenterFromBounds(bounds: { north: number; south: number; east: number; west: number }) {
  return {
    lat: (bounds.north + bounds.south) / 2,
    lng: (bounds.east + bounds.west) / 2,
  };
}

export function getZoomFromBounds(
  bounds: { north: number; south: number; east: number; west: number },
  mapWidth: number,
  mapHeight: number
): number {
  const WORLD_DIM = { height: 256, width: 256 };
  const ZOOM_MAX = 21;

  function latRad(lat: number) {
    const sin = Math.sin((lat * Math.PI) / 180);
    const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
    return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
  }

  function zoom(mapPx: number, worldPx: number, fraction: number) {
    return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
  }

  const latFraction = (latRad(bounds.north) - latRad(bounds.south)) / Math.PI;
  const lngDiff = bounds.east - bounds.west;
  const lngFraction = lngDiff < 0 ? lngDiff + 360 : lngDiff;
  const lngFractionFinal = lngFraction / 360;

  const latZoom = zoom(mapHeight, WORLD_DIM.height, latFraction);
  const lngZoom = zoom(mapWidth, WORLD_DIM.width, lngFractionFinal);

  return Math.min(latZoom, lngZoom, ZOOM_MAX);
}