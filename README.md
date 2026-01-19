# Glowbook Booking

Public booking page for Glowbook masters. This is a standalone React application where customers can view services and book appointments with masters.

## Project Structure

This is a separate project from the main Glowbook mobile app, designed to be fully isolated and independently deployable.

## Setup

Install dependencies:

```bash
npm install
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

- React 19
- Vite 7
- Modern CSS (no frameworks for now, keep it simple)

## URL Generation

The URL to this booking page will be generated in the Glowbook mobile app and shared with customers.
