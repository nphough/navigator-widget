import { useQuery } from '@tanstack/react-query';
import { getAPI } from '@/lib/api';
import { BrandResponse } from '@/lib/types';

export function useBrand() {
  return useQuery<BrandResponse>({
    queryKey: ['brand'],
    queryFn: () => getAPI().getBrand(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}