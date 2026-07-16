export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
  mapProviderKey: process.env.NEXT_PUBLIC_MAP_PROVIDER_KEY || '',
};
