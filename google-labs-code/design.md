# BookShelf — Design Notes

## Current State
- Dark theme with purple accent (#8b7cf7)
- Playfair Display (serif) for headings + Inter for body text
- Glassmorphism header with backdrop blur
- Card-based layout with hover lift effects
- Stats bar with animated count-up values
- Genre/status filter toolbar

## Identified Issues
1. **Font choice feels template-y** — Playfair Display + Inter combo is overused in dark themes
2. **Purple-heavy palette** feels generic and "cheap"
3. **Glassmorphism** can look dated and overdone
4. **Card design** lacks visual refinement — too much border/shadow noise
5. **Stats bar** feels disconnected from the rest of the layout
6. **Overall** looks like a dark-mode bootstrap template rather than a polished reading journal

## Improvements Applied
### Typography
- Replaced Playfair Display + Inter with **DM Sans** — a clean, modern geometric sans-serif
- Uses regular weights (400, 500, 600, 700) for a more natural, readable feel
- Removed the "display font" for titles — everything uses the same clean typeface

### Color Palette
- Shifted from purple-dominant to a **warm neutral dark** theme
- Accent color: soft amber/gold (#d4a053) for a more bookish, refined feel
- Backgrounds: deeper, richer dark tones with less blue
- Reduced visual noise — fewer competing colors

### Card Design
- Larger, more generous padding
- Subtle single-pixel borders instead of heavy outlines
- Refined hover state — gentle lift with soft shadow
- Cover images given more visual weight
- Cleaner action bar at bottom of cards

### Header
- Simplified — removed glassmorphism and glow effects
- Clean solid background with minimal decoration
- More whitespace, less visual clutter

### Overall Aesthetic
- Moved toward a **minimal, editorial** design language
- Less "web app template," more "curated reading journal"
- Consistent spacing and typographic rhythm
- Reduced animation/glow/pulse effects that scream "demo"