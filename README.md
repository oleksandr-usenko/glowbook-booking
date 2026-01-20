# Glowbook Booking

Public booking page for Glowbook masters. This is a standalone React application where customers can view services and book appointments with masters.

## Project Structure

This is a separate project from the main Glowbook mobile app, designed to be fully isolated and independently deployable.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from the example:

```bash
cp .env.example .env
```

3. Update the `.env` file with your API base URL if needed:

```
VITE_API_BASE_URL=https://your-api-url.com
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Page Structure

The booking page includes the following sections:

- **Header**: Master/business name
- **Master Info**: Master details and information
- **Services List**: List of available services
- **Booking Calendar**: Calendar and time slot selection
- **Footer**: Additional information

## Tech Stack

- React 19 + TypeScript
- Vite 7
- React Router - Client-side routing
- TanStack Query - Data fetching and caching
- Tailwind CSS - Utility-first styling
- shadcn/ui - Accessible component library
- Lucide React - Icon library

## Routing

The application uses dynamic routing based on master ID:

- `/{id}` - Master booking page where `id` is the master's unique identifier
- Example: `/abc123` will fetch and display services for master with ID `abc123`

The root path `/` redirects to `/demo` for testing purposes.

## API Integration

The application fetches data from the Glowbook API:

- **Services Endpoint**: `GET /services/{masterId}`
- Returns a list of services offered by the specified master

All API calls include the `ngrok-skip-browser-warning` header for development with ngrok tunnels.

## URL Generation

The URL to this booking page will be generated in the Glowbook mobile app and shared with customers. Each master gets a unique URL like: `https://booking.glowbook.com/{masterId}`

## Deployment

This project is configured for Vercel deployment. See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for detailed instructions.

### Quick Deploy to Vercel:

1. Push your code to GitHub/GitLab/Bitbucket
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variable:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** Your production API URL
4. Deploy!

**Important:** Don't commit `.env` file. Set environment variables in Vercel dashboard instead.

## Documentation

- [TanStack Query Guide](./TANSTACK_QUERY_GUIDE.md) - API integration patterns
- [Deployment Guide](./DEPLOYMENT.md) - Vercel deployment instructions
