import { Suspense } from 'react';
import { Widget } from '@/components/widget/Widget';
import { getAPI, initializeAPI } from '@/lib/api';

interface EmbedPageProps {
  searchParams: { k?: string };
}

async function fetchBrandData(apiKey: string) {
  try {
    // Initialize API with the key
    const api = initializeAPI(apiKey);
    
    // Server-side fetch to validate the key and get brand data
    const brandResponse = await fetch(
      `${process.env.NAVIGATOR_API_BASE || 'https://afnavigator.com'}/api/public/v1/widget/brand?k=${apiKey}`,
      {
        headers: {
          'Origin': process.env.NODE_ENV === 'production' 
            ? 'https://widget.afnavigator.com'
            : 'http://localhost:3000',
        },
      }
    );

    if (!brandResponse.ok) {
      throw new Error(`API responded with status: ${brandResponse.status}`);
    }

    const brandData = await brandResponse.json();
    return brandData.brand;
  } catch (error) {
    console.error('Failed to fetch brand data:', error);
    return null;
  }
}

function WidgetError({ message }: { message: string }) {
  return (
    <div className="widget-container">
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Widget Error
          </h3>
          <p className="text-gray-600 text-sm">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

function WidgetLoading() {
  return (
    <div className="widget-container">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Navigator Widget...</p>
        </div>
      </div>
    </div>
  );
}

export default async function EmbedPage({ searchParams }: EmbedPageProps) {
  const apiKey = searchParams.k;

  // Validate API key
  if (!apiKey) {
    return (
      <WidgetError message="API key is required. Please check your embed code includes the correct API key parameter." />
    );
  }

  if (!apiKey.startsWith('pk_')) {
    return (
      <WidgetError message="Invalid API key format. API keys should start with 'pk_'." />
    );
  }

  // Fetch brand data server-side
  const brand = await fetchBrandData(apiKey);

  if (!brand) {
    return (
      <WidgetError message="Unable to load brand information. Please check that your API key is valid and active." />
    );
  }

  return (
    <div className="widget-container">
      <Suspense fallback={<WidgetLoading />}>
        <Widget brand={brand} apiKey={apiKey} />
      </Suspense>
    </div>
  );
}