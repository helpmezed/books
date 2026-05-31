export interface Book {
  id: string
  title: string
  author: string
  genre: string
  status: "read" | "reading" | "tbr"
  dateRead: string
  pages: number
  cover: string
  rating: number
  review: string
  libraryId: string
  dateAdded: string
}

export interface Library {
  id: string
  name: string
  dateCreated: string
}

export type SortKey = "dateAdded" | "rating" | "title" | "dateRead"
export type SortDir = "asc" | "desc"
export type SortValue = `${SortKey}-${SortDir}`
