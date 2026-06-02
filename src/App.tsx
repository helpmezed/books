import { useState, useMemo } from "react"
import { useBooks } from "./hooks/use-books"
import { useLibraries } from "./hooks/use-libraries"
import type { Book, SortValue, SortKey, SortDir } from "./lib/types"

import { Header } from "./components/header"
import { LibraryBar } from "./components/library-bar"
import { StatsBar } from "./components/stats-bar"
import { Toolbar } from "./components/toolbar"
import { BookGrid } from "./components/book-grid"
import { BookFormDialog } from "./components/book-form-dialog"
import { BookDetailDialog } from "./components/book-detail-dialog"
import { ScrollToTop } from "./components/scroll-to-top"
import { Toaster } from "sonner"
import { toast } from "sonner"

export default function App() {
  const {
    books,
    addBook,
    updateBook,
    deleteBook,
    exportBooks,
    importBooks,
  } = useBooks()

  const {
    libraries,
    activeLibraryId,
    switchLibrary,
    createLibrary,
    renameLibrary,
    deleteLibrary,
    getLibName,
    mergeLibraries,
  } = useLibraries()

  // State
  const [searchQuery, setSearchQuery] = useState("")
  const [genreFilter, setGenreFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [sortBy, setSortBy] = useState<SortValue>("dateAdded-desc")

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [viewingBookId, setViewingBookId] = useState<string | null>(null)

  // Derived state
  const scopeBooks =
    activeLibraryId === "all"
      ? books
      : books.filter((b) => b.libraryId === activeLibraryId)

  const getBookCount = (libId: string) => {
    return books.filter((b) => b.libraryId === libId).length
  }

  const allGenres = useMemo(() => {
    return Array.from<string>(new Set(scopeBooks.map((b) => b.genre))).sort()
  }, [scopeBooks])

  const filteredAndSortedBooks = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    const [sortKey, sortDir] = sortBy.split("-") as [SortKey, SortDir]

    const result = scopeBooks.filter((b) => {
      const matchQuery =
        !query ||
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query) ||
        b.genre.toLowerCase().includes(query)

      const matchGenre = !genreFilter || b.genre === genreFilter
      const matchStatus = !statusFilter || b.status === statusFilter

      return matchQuery && matchGenre && matchStatus
    })

    result.sort((a, b) => {
      let valA: string | number, valB: string | number
      switch (sortKey) {
        case "title":
          valA = a.title.toLowerCase()
          valB = b.title.toLowerCase()
          return sortDir === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA)
        case "rating":
          valA = a.rating
          valB = b.rating
          break
        case "dateAdded":
          valA = new Date(a.dateAdded || 0).getTime()
          valB = new Date(b.dateAdded || 0).getTime()
          break
        case "dateRead":
          valA = new Date(a.dateRead || 0).getTime()
          valB = new Date(b.dateRead || 0).getTime()
          break
        default:
          return 0
      }
      if (typeof valA === "string" && typeof valB === "string") {
        return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA)
      }
      return sortDir === "asc" ? (valA as number) - (valB as number) : (valB as number) - (valA as number)
    })

    return result
  }, [scopeBooks, searchQuery, genreFilter, statusFilter, sortBy])

  // Stats
  const readBooks = scopeBooks.filter((b) => b.status === "read")
  const readingBooks = scopeBooks.filter((b) => b.status === "reading")
  const ratedBooks = scopeBooks.filter((b) => b.rating > 0)
  const avgRating =
    ratedBooks.length > 0
      ? (
          ratedBooks.reduce((s, b) => s + b.rating, 0) / ratedBooks.length
        ).toFixed(1)
      : "—"
  const totalPages = readBooks.reduce((s, b) => s + (b.pages || 0), 0)

  // Handlers
  const handleAddBook = () => {
    setEditingBook(null)
    setIsFormOpen(true)
  }

  const handleEditBook = (id: string) => {
    const book = books.find((b) => b.id === id)
    if (book) {
      setEditingBook(book)
      setIsFormOpen(true)
    }
  }

  const handleDeleteBook = (id: string) => {
    const book = books.find((b) => b.id === id)
    if (!book) return

    if (
      window.confirm(`Remove "${book.title}" from your shelf? This can't be undone.`)
    ) {
      deleteBook(id)
      setIsDetailOpen(false)
      toast.success("Book removed.")
    }
  }

  const handleViewBook = (id: string) => {
    setViewingBookId(id)
    setIsDetailOpen(true)
  }

  const handleSaveBook = (bookData: Omit<Book, "id" | "dateAdded">) => {
    if (editingBook) {
      updateBook(editingBook.id, bookData)
      toast.success("Book updated!")
    } else {
      addBook(bookData)
      toast.success("Book added!")
    }
  }

  const handleExport = () => {
    const count = exportBooks(libraries)
    toast.success(`Exported ${count} book(s) and ${libraries.length} librarie(s)!`)
  }

  const handleImport = (content: string) => {
    const res = importBooks(content)
    if (res.error) {
      toast.error(res.error)
    } else {
      if (res.libraries) {
        mergeLibraries(res.libraries)
      }
      toast.success(`Imported ${res.added} new book(s)!`)
    }
  }

  const viewingBook = viewingBookId
    ? books.find((b) => b.id === viewingBookId) || null
    : null

  return (
    <>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddBook={handleAddBook}
        onExport={handleExport}
        onImport={handleImport}
      />

      <LibraryBar
        libraries={libraries}
        activeLibraryId={activeLibraryId}
        onSwitchLibrary={switchLibrary}
        onCreateLibrary={(name) => {
          const lib = createLibrary(name)
          if (lib) toast.success(`Library "${lib.name}" created!`)
        }}
        onRenameLibrary={(id, name) => {
          if (renameLibrary(id, name)) toast.success("Library renamed!")
        }}
        onDeleteLibrary={(id) => {
          deleteLibrary(id)
          toast.success("Library deleted.")
        }}
        getBookCount={getBookCount}
        totalBooks={books.length}
      />

      <StatsBar
        total={scopeBooks.length}
        read={readBooks.length}
        reading={readingBooks.length}
        avgRating={avgRating}
        totalPages={totalPages}
      />

      <Toolbar
        genres={allGenres}
        genreFilter={genreFilter}
        setGenreFilter={setGenreFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        bookCount={filteredAndSortedBooks.length}
      />

      <BookGrid
        books={filteredAndSortedBooks}
        totalBooks={books.length}
        activeLibraryId={activeLibraryId}
        onEdit={handleEditBook}
        onDelete={handleDeleteBook}
        onView={handleViewBook}
        onAddBook={handleAddBook}
      />

      <BookFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        book={editingBook}
        libraries={libraries}
        activeLibraryId={activeLibraryId}
        onSave={handleSaveBook}
      />

      <BookDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        book={viewingBook}
        libName={viewingBook ? getLibName(viewingBook.libraryId) : ""}
        onEdit={handleEditBook}
        onDelete={handleDeleteBook}
      />

      <ScrollToTop />
      
      <Toaster 
        theme="dark" 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-foreground)',
          }
        }}
      />
    </>
  )
}
