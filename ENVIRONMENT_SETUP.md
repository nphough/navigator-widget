# Environment Variables Setup Guide

This guide walks you through setting up the required environment variables for the Navigator Widget deployment.

## Required Environment Variables

### 1. Navigator API Configuration

```bash
# Already set in production
NAVIGATOR_API_BASE=https://afnavigator.com
```

This tells the widget where to find Navigator's backend API endpoints.

### 2. Google Maps API Key (REQUIRED)

You'll need to get this from Google Cloud Console:

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Select your project** (the one with Navigator's existing Maps setup)
3. **Go to APIs & Services > Credentials**
4. **Create a new API key** specifically for the widget:
   - Click "Create Credentials" > "API Key"
   - Name it: "Navigator Widget - Production"

5. **Restrict the API key**:
   - Application restrictions: "HTTP referrers"
   - Add referrer: `https://widget.afnavigator.com/*`
   - API restrictions: Select these APIs only:
     - Maps JavaScript API
     - Places API (New)
     - Geocoding API

6. **Add to Vercel**:
```bash
npx vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY production --value "YOUR_ACTUAL_API_KEY_HERE"
npx vercel env add NEXT_PUBLIC_GOOGLE_PLACES_API_KEY production --value "YOUR_ACTUAL_API_KEY_HERE"
```

### 3. Optional: Google Maps Map ID

If you want custom map styling later:

```bash
npx vercel env add NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID production --value "your_map_id"
```

## Setting Development Environment Variables

For local development, copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```env
# Navigator API Configuration
NAVIGATOR_API_BASE=https://afnavigator.com

# Google Maps Configuration - ADD YOUR ACTUAL KEYS
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_actual_google_places_api_key

# Optional
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your_map_id_if_you_have_one

# Development
NODE_ENV=development
```

## Deployment Commands

### Deploy to Production

```bash
# First time deployment
npm run deploy

# Subsequent deployments
git add .
git commit -m "Update description"
git push
# Vercel will auto-deploy from GitHub
```

### Environment Variable Management

```bash
# List all environment variables
npx vercel env ls

# Add a new environment variable
npx vercel env add VARIABLE_NAME production --value "value"

# Remove an environment variable
npx vercel env rm VARIABLE_NAME production

# Pull environment variables to .env.local
npx vercel env pull .env.local
```

## Custom Domain Setup

Once you have the Google Maps API key set up, you can configure the custom domain:

1. **In Vercel Dashboard**:
   - Go to your navigator-widget project
   - Go to Settings > Domains
   - Add domain: `widget.afnavigator.com`

2. **In Cloudflare DNS**:
   - Add CNAME record: `widget` → `cname.vercel-dns.com`
   - Set to "DNS only" (not proxied)

## Testing the Deployment

After setting up environment variables and deploying:

1. **Test the widget embed**:
   Create a test HTML file:
   ```html
   <!DOCTYPE html>
   <html>
   <head><title>Widget Test</title></head>
   <body>
     <h1>Test Partner Site</h1>
     <div id="navigator-widget"></div>
     <script src="https://widget.afnavigator.com/embed.js?k=pk_test_your_key"></script>
   </body>
   </html>
   ```

2. **Check the endpoints**:
   ```bash
   # Health check
   curl https://widget.afnavigator.com/embed.js?k=test
   
   # Should return JavaScript loader
   ```

## Troubleshooting

### Maps Don't Load
- Check that `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set in Vercel
- Verify the API key has the correct restrictions
- Ensure Maps JavaScript API is enabled

### Widget Won't Load
- Check Vercel deployment logs
- Verify `NAVIGATOR_API_BASE` is set correctly
- Check that your domain is added to the API key's allowlist

### CORS Errors
- Ensure the origin domain is in your API key's allowlist
- Check that HTTPS is being used (not HTTP)

## Environment Variable Security

- **Never commit `.env.local`** to Git (it's in .gitignore)
- **Use different API keys** for development and production
- **Restrict API keys** to specific domains
- **Monitor usage** in Google Cloud Console

## Next Steps After Environment Setup

1. **Apply database migration** (see `NAVIGATOR_SCHEMA_CHANGES.md`)
2. **Deploy Navigator backend changes** (Part A)
3. **Create your first widget API key** using the provisioning script
4. **Test full integration** with a real brand

Your widget is now ready for deployment once the environment variables are configured!