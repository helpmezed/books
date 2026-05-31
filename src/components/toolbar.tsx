import type { SortValue } from "@/lib/types"

interface ToolbarProps {
  genres: string[]
  genreFilter: string
  setGenreFilter: (g: string) => void
  statusFilter: string
  setStatusFilter: (s: string) => void
  sortBy: SortValue
  setSortBy: (s: SortValue) => void
  bookCount: number
}

export function Toolbar({
  genres,
  genreFilter,
  setGenreFilter,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  bookCount,
}: ToolbarProps) {
  return (
    <div className="max-w-[1280px] mx-auto mb-4 px-7 flex items-center gap-2.5 flex-wrap max-sm:px-4">
      <select
        className="bg-surface-2 border border-border rounded-sm py-2 px-3 text-foreground font-sans text-[0.84rem] outline-none cursor-pointer transition-all duration-200 appearance-none bg-no-repeat bg-[right_10px_center] pr-7 focus:border-primary focus:shadow-[0_0_0_3px_var(--color-gold-glow)] focus:bg-surface-3"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23555a66' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")" }}
        value={genreFilter}
        onChange={(e) => setGenreFilter(e.target.value)}
        aria-label="Filter by genre"
      >
        <option value="">All Genres</option>
        {genres.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      <select
        className="bg-surface-2 border border-border rounded-sm py-2 px-3 text-foreground font-sans text-[0.84rem] outline-none cursor-pointer transition-all duration-200 appearance-none bg-no-repeat bg-[right_10px_center] pr-7 focus:border-primary focus:shadow-[0_0_0_3px_var(--color-gold-glow)] focus:bg-surface-3"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23555a66' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")" }}
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        aria-label="Filter by status"
      >
        <option value="">All Status</option>
        <option value="read">Read</option>
        <option value="reading">Reading</option>
        <option value="tbr">To Be Read</option>
      </select>

      <select
        className="bg-surface-2 border border-border rounded-sm py-2 px-3 text-foreground font-sans text-[0.84rem] outline-none cursor-pointer transition-all duration-200 appearance-none bg-no-repeat bg-[right_10px_center] pr-7 focus:border-primary focus:shadow-[0_0_0_3px_var(--color-gold-glow)] focus:bg-surface-3"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23555a66' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")" }}
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortValue)}
        aria-label="Sort by"
      >
        <option value="dateAdded-desc">Newest Added</option>
        <option value="dateAdded-asc">Oldest Added</option>
        <option value="rating-desc">Highest Rated</option>
        <option value="rating-asc">Lowest Rated</option>
        <option value="title-asc">Title A–Z</option>
        <option value="title-desc">Title Z–A</option>
        <option value="dateRead-desc">Recently Read</option>
      </select>

      <div className="flex-1"></div>
      
      <span className="text-text-faint text-[0.84rem] font-medium" aria-live="polite">
        {bookCount} book{bookCount !== 1 ? "s" : ""}
      </span>
    </div>
  )
}
