import type { Book } from "@/lib/types"
import { BookCard } from "./book-card"
import { EmptyState } from "./empty-state"

interface BookGridProps {
  books: Book[]
  totalBooks: number
  activeLibraryId: string
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onView: (id: string) => void
  onAddBook: () => void
}

export function BookGrid({
  books,
  totalBooks,
  activeLibraryId,
  onEdit,
  onDelete,
  onView,
  onAddBook,
}: BookGridProps) {
  if (books.length === 0 && totalBooks === 0) {
    return <EmptyState onAdd={onAddBook} />
  }

  if (books.length === 0) {
    const isLibView = activeLibraryId !== "all"
    return (
      <div className="col-span-full text-center py-16 px-6 text-text-faint">
        <div className="text-[3rem] mb-3">
          {isLibView ? "📖" : "🔍"}
        </div>
        <h3 className="text-foreground text-[1.2rem] mb-2 font-semibold">
          {isLibView ? "No books in this library" : "No books found"}
        </h3>
        <p>
          {isLibView
            ? "Add books to this library or switch to a different one."
            : "Try adjusting your search or filters."}
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-[1280px] mx-auto px-7 pb-[60px] grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4 max-sm:grid-cols-1 max-sm:px-4 max-sm:pb-[40px]">
      {books.map((book, index) => (
        <BookCard
          key={book.id}
          book={book}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  )
}
