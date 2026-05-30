# BookShelf — My Reading Journal

## What This Is
A personal book review and reading tracker web application. It's a single self-contained HTML file (`index.html`) with no external dependencies, frameworks, or build tools required. Open it directly in any modern browser.

## What It Does
- **Track books you've read, are reading, or want to read** with title, author, genre, status, date read, page count, star rating (1–5), and free-form review/notes.
- **Automatically finds book cover art** using the Open Library API (free, no API key). When you type a title, it auto-searches after a brief pause and shows matching cover thumbnails to pick from.
- **Dashboard stats** show total books tracked, books read, currently reading, average rating, and total pages read — with animated count-up on load.
- **Search** across titles, authors, and genres in real time.
- **Filter** by genre, reading status, and **sort** by date added, rating, title, or date read.
- **Detail view** — click any book card to see full details with cover and review.
- **Edit and delete** books from the detail view or card actions (with styled confirmation dialog).
- **Export / Import** your entire library as JSON for backup and portability.
- **Keyboard shortcut** — press `Ctrl+N` (or `Cmd+N` on Mac) to quickly add a new book.

## Design
- Premium dark theme with glassmorphism header
- Typography: Inter (body) + Playfair Display (headings) via Google Fonts
- Animated card entrance with staggered fade-in
- Smooth modal open/close transitions
- Cover image skeleton loading shimmer
- Scroll-to-top floating button
- Responsive design (mobile, tablet, desktop)
- Accessibility: ARIA labels, keyboard navigation, `prefers-reduced-motion` support

## Tech Details
- **Single file**: `book list/index.html` (~2200 lines)
- **Frontend only**: HTML + CSS + vanilla JavaScript (no build step, no npm, no frameworks)
- **Data storage**: `localStorage` — all data persists in the browser. No backend or database.
- **Cover art API**: [Open Library Search API](https://openlibrary.org/developers/api) — searches by title/author, falls back to ISBN-based cover lookup.
- **Desktop shortcut**: `BookShelf.lnk` on the Desktop points to the `index.html` file.

## File Structure
```
book list/
  index.html    ← The entire application (HTML + CSS + JS)
  README.md     ← This file
```

## How to Run
Just open `index.html` in a browser. No server needed.

## How to Modify
Edit `index.html` directly. All CSS is in `<style>` tags at the top, all JavaScript is in `<script>` tags at the bottom. The app uses a simple array of book objects stored in localStorage — see the `books` variable and the `persist()` function to understand the data model.