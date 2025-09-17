# Facilitator Documentation

This is the documentation website for the HyperEVM USDT0 Facilitator API.

## Configuration

### Changing the API URL

To update the facilitator API URL for production deployment:

1. **Update the configuration file**: Edit `src/lib/config.ts`
   ```typescript
   export const FACILITATOR_URL = process.env.NEXT_PUBLIC_FACILITATOR_URL || 'https://your-new-api-url.com'
   ```

2. **Set environment variable** (recommended for production):
   ```bash
   NEXT_PUBLIC_FACILITATOR_URL=https://your-new-api-url.com
   ```

3. **Current hosted URL**: `https://a2aonhypeevm.onrender.com`

### Environment Variables

- `NEXT_PUBLIC_FACILITATOR_URL`: The base URL for the facilitator API (defaults to the hosted URL)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Deployment

The documentation will automatically use the configured API URL. No additional changes needed when deploying to production.