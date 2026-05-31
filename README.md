# BookShelf

A beautiful, local-first web application for tracking your reading journey. Built with a warm, elegant dark mode design system and smooth micro-animations.

## Features
- **Local-First**: All your data stays on your device (in `localStorage`). Fast, private, and no signup required.
- **Smart Covers**: Auto-fetches high-quality book covers via the Open Library API.
- **Libraries**: Organize books into custom libraries (e.g., "Fiction", "Non-Fiction", "Reference").
- **Insights**: Track how many books you've read, your average rating, and total pages read.
- **Search & Filter**: Find books instantly. Sort by newest, highest rated, alphabetical, or recently read.
- **Data Portability**: Export your entire collection as JSON and import it on any other device.
- **Beautiful UI**: Built with a sleek amber/gold dark mode palette and fluid interactions.

## Tech Stack
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Data Persistence**: `localStorage` (No backend required)

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

## Deployment

This app is fully optimized for **Vercel**. Deploying is as simple as connecting your GitHub repository to Vercel. The build command (`npm run build`) and output directory (`dist`) will be automatically detected.
