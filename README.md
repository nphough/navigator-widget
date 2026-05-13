# Navigator Widget

An embeddable widget that allows AF beverage brands to display their Navigator listings on their own websites.

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Data**: Pulls live listings from Navigator's production database
- **Interactive Map**: Google Maps integration with clustering and location search
- **Smart Filtering**: Filter by type, category, location, and AF status
- **Dynamic Height**: Iframe automatically resizes based on content
- **Origin Protection**: API keys restricted to allowed domains for security

## Architecture

```
Partner Website
    ↓ (loader script)
Widget Domain (iframe)
    ↓ (server-side proxy)
Navigator API
    ↓ (database queries)
Production Database
```

## Setup

### Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your actual values:
   - `NAVIGATOR_API_BASE`: URL to Navigator's main API
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps JavaScript API key
   - `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`: Google Places API key

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Test the widget locally**:
   Create a test HTML file:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <title>Widget Test</title>
   </head>
   <body>
       <h1>My Brand Website</h1>
       <div id="navigator-widget"></div>
       <script src="http://localhost:3000/embed.js?k=pk_test_your_api_key"></script>
   </body>
   </html>
   ```

### Production Deployment

1. **Deploy to Vercel**:
   - Connect this repository to a new Vercel project
   - Set production domain to `widget.afnavigator.com`
   - Configure environment variables in Vercel dashboard

2. **DNS Configuration**:
   Add CNAME record: `widget.afnavigator.com` → `cname.vercel-dns.com`

## Usage

### Basic Integration

Add this code to your website where you want the widget to appear:

```html
<div id="navigator-widget"></div>
<script src="https://widget.afnavigator.com/embed.js?k=YOUR_API_KEY"></script>
```

### Advanced Integration

You can customize the container:

```html
<div id="navigator-widget" style="max-width: 800px; margin: 0 auto;"></div>
<script src="https://widget.afnavigator.com/embed.js?k=YOUR_API_KEY"></script>
```

## API Key Management

API keys are provisioned through the Navigator backend. Contact Navigator support to:
1. Create a widget API key for your brand
2. Configure allowed origins for security
3. Set rate limits appropriate for your traffic

## Browser Support

- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile browsers**: iOS Safari 14+, Android Chrome 90+
- **Features required**: ES2018, Fetch API, ResizeObserver

## Security

- **Origin validation**: API keys only work from configured domains
- **Rate limiting**: Protects Navigator's API from abuse
- **HTTPS only**: All production traffic uses secure connections
- **CSP friendly**: Widget respects Content Security Policies

## Performance

- **Edge caching**: API responses cached at Vercel's edge
- **Image optimization**: Next.js automatic image optimization
- **Bundle size**: ~150KB gzipped (including React)
- **Load time**: <2 seconds on 3G connection

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server locally
npm run start

# Run linter
npm run lint

# Type checking
npm run type-check
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NAVIGATOR_API_BASE` | Yes | Navigator's API base URL |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Yes | Google Maps JavaScript API key |
| `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` | Yes | Google Places API key |
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | No | Custom Google Maps style ID |

## Troubleshooting

### Widget doesn't load
- Check that API key is valid and starts with `pk_`
- Verify domain is in the key's allowed origins list
- Check browser console for error messages

### Height issues
- Ensure iframe-resizer is working (check console)
- CSS on parent page might interfere with height calculation

### Map doesn't appear
- Verify Google Maps API key has Maps JavaScript API enabled
- Check API key restrictions allow widget domain
- Ensure Places API is also enabled for autocomplete

## Support

For widget integration support, contact Navigator technical support with:
- Your API key (first 16 characters only)
- Partner domain where widget is embedded
- Browser and device information
- Console error messages if any