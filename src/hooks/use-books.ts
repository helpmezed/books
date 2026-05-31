import { useState, useCallback, useEffect } from "react"
import type { Book } from "@/lib/types"
import { genId } from "@/lib/utils"

const STORAGE_KEY = "bookshelf"

function loadBooks(): Book[] {
  if (!localStorage.getItem("bookshelf_cleared_v1")) {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.setItem("bookshelf_cleared_v1", "1")
  }
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
}

function persistBooks(books: Book[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
}

export function useBooks() {
  const [books, setBooks] = useState<Book[]>(loadBooks)

  useEffect(() => {
    persistBooks(books)
  }, [books])

  const addBook = useCallback((bookData: Omit<Book, "id" | "dateAdded">) => {
    const newBook: Book = {
      ...bookData,
      id: genId(),
      dateAdded: new Date().toISOString(),
    }
    setBooks((prev) => [...prev, newBook])
    return newBook
  }, [])

  const updateBook = useCallback((id: string, bookData: Partial<Book>) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...bookData } : b))
    )
  }, [])

  const deleteBook = useCallback((id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const exportBooks = useCallback(
    (libraries: { id: string; name: string; dateCreated: string }[]) => {
      const data = { books, libraries }
      const dataStr = JSON.stringify(data, null, 2)
      const blob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `bookshelf-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      return books.length
    },
    [books]
  )

  const importBooks = useCallback(
    (fileContent: string): { added: number; error?: string; libraries?: any[] } => {
      try {
        const imported = JSON.parse(fileContent)
        let importedBooks: Book[]
        let importedLibraries: any[] = []

        if (Array.isArray(imported)) {
          importedBooks = imported
        } else if (imported.books && Array.isArray(imported.books)) {
          importedBooks = imported.books
          importedLibraries = imported.libraries || []
        } else {
          return { added: 0, error: "Invalid file format." }
        }

        const existingIds = new Set(books.map((b) => b.id))
        let addedCount = 0
        const newBooks: Book[] = []

        for (const book of importedBooks) {
          if (!book.id) book.id = genId()
          if (!existingIds.has(book.id)) {
            if (!book.dateAdded) book.dateAdded = new Date().toISOString()
            newBooks.push(book)
            addedCount++
          }
        }

        if (newBooks.length > 0) {
          setBooks((prev) => [...prev, ...newBooks])
        }

        return { added: addedCount, libraries: importedLibraries }
      } catch {
        return { added: 0, error: "Failed to parse JSON file." }
      }
    },
    [books]
  )

  return {
    books,
    addBook,
    updateBook,
    deleteBook,
    exportBooks,
    importBooks,
  }
}
