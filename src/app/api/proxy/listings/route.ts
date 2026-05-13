import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('k');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key required' },
        { status: 400 }
      );
    }

    const navigatorApiBase = process.env.NAVIGATOR_API_BASE || 'https://afnavigator.com';
    const url = new URL(`${navigatorApiBase}/api/public/v1/widget/listings`);
    
    // Forward all query parameters to Navigator's API
    for (const [key, value] of searchParams.entries()) {
      url.searchParams.set(key, value);
    }

    // Forward the request to Navigator's API
    const response = await fetch(url.toString(), {
      headers: {
        'Origin': request.headers.get('Origin') || 'https://widget.afnavigator.com',
        'Referer': request.headers.get('Referer') || 'https://widget.afnavigator.com',
        'User-Agent': request.headers.get('User-Agent') || 'Navigator-Widget/1.0',
      },
    });

    // Get response data
    const data = await response.json();

    // Return the response with appropriate headers
    const nextResponse = NextResponse.json(data, {
      status: response.status,
      statusText: response.statusText,
    });

    // Copy cache headers from Navigator
    const cacheControl = response.headers.get('cache-control');
    if (cacheControl) {
      nextResponse.headers.set('Cache-Control', cacheControl);
    }

    return nextResponse;

  } catch (error) {
    console.error('Listings proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}