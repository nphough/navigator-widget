import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getAPI } from '@/lib/api';
import { ListingsResponse, ListingsParams } from '@/lib/types';
import { useFilterParams } from '@/store/filters';
import { useDebounce } from './useDebounce';

export function useListings(options?: { enabled?: boolean }) {
  const filterParams = useFilterParams();
  const debouncedQuery = useDebounce(filterParams.query, 300);

  // Create stable query params object
  const queryParams: ListingsParams = {
    ...filterParams,
    query: debouncedQuery,
  };

  return useQuery<ListingsResponse>({
    queryKey: ['listings', queryParams],
    queryFn: () => getAPI().getListings(queryParams),
    enabled: options?.enabled ?? true,
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useInfiniteListings(options?: { enabled?: boolean }) {
  const filterParams = useFilterParams();
  const debouncedQuery = useDebounce(filterParams.query, 300);

  // Create stable query params object
  const baseParams: ListingsParams = {
    ...filterParams,
    query: debouncedQuery,
    limit: 24,
  };

  return useInfiniteQuery<ListingsResponse>({
    queryKey: ['listings-infinite', baseParams],
    queryFn: ({ pageParam }) => {
      const params = { ...baseParams };
      if (pageParam) {
        params.cursor = pageParam as string;
      }
      return getAPI().getListings(params);
    },
    enabled: options?.enabled ?? true,
    getNextPageParam: (lastPage) => lastPage.cursor || undefined,
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}