'use client';

import React, { useEffect, useState, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrandHeader } from './BrandHeader';
import { SearchBar } from './SearchBar';
import { ListingCard } from './ListingCard';
import { useBrand } from '@/hooks/useBrand';
import { useListings } from '@/hooks/useListings';
import { initializeAPI } from '@/lib/api';
import { Brand } from '@/lib/types';

interface WidgetProps {
  brand: Brand;
  apiKey: string;
}

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function WidgetContent({ brand, apiKey }: WidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [previousHeight, setPreviousHeight] = useState(0);

  // Initialize the API client
  useEffect(() => {
    initializeAPI(apiKey);
  }, [apiKey]);

  // Setup iframe resizer communication
  useEffect(() => {
    const sendHeightToParent = () => {
      if (widgetRef.current) {
        const height = widgetRef.current.scrollHeight;
        
        // Only send if height has changed significantly (avoid spam)
        if (Math.abs(height - previousHeight) > 10) {
          try {
            // Try different message formats for compatibility
            const message = {
              type: 'navigator-widget-height',
              height: height,
              iframeId: new URLSearchParams(window.location.search).get('iframeId'),
            };
            
            if (window.parent !== window) {
              window.parent.postMessage(message, '*');
              window.parent.postMessage(JSON.stringify(message), '*');
            }
            
            setPreviousHeight(height);
          } catch (error) {
            console.warn('Failed to communicate with parent frame:', error);
          }
        }
      }
    };

    // Send height on load and when content changes
    const observer = new ResizeObserver(sendHeightToParent);
    if (widgetRef.current) {
      observer.observe(widgetRef.current);
    }

    // Send initial height
    setTimeout(sendHeightToParent, 100);

    // Listen for requests from parent
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'getHeight') {
        sendHeightToParent();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      observer.disconnect();
      window.removeEventListener('message', handleMessage);
    };
  }, [previousHeight]);

  const { data: listings, isLoading, error } = useListings();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading listings...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Listings
            </h3>
            <p className="text-gray-600 text-sm">
              Unable to load listings. Please try again later.
            </p>
          </div>
        </div>
      );
    }

    if (!listings?.items || listings.items.length === 0) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Results Found
            </h3>
            <p className="text-gray-600 text-sm">
              No listings match your current search criteria. Try adjusting your filters or search terms.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4">
        <div className="space-y-4">
          {listings.items.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
            />
          ))}
        </div>
        
        {listings.total > listings.items.length && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Showing {listings.items.length} of {listings.total} results
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={widgetRef} className="widget-container min-h-[400px] bg-white">
      <BrandHeader brand={brand} />
      <SearchBar />
      {renderContent()}
    </div>
  );
}

export function Widget(props: WidgetProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WidgetContent {...props} />
    </QueryClientProvider>
  );
}