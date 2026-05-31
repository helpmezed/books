import { useEffect, useState } from "react"
import type { Book, Library } from "@/lib/types"
import { useCoverLookup } from "@/hooks/use-cover-lookup"
import { RatingInput } from "./rating"
import { triggerConfetti } from "./confetti"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface BookFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  book: Book | null
  libraries: Library[]
  activeLibraryId: string
  onSave: (bookData: Omit<Book, "id" | "dateAdded">) => void
}

export function BookFormDialog({
  open,
  onOpenChange,
  book,
  libraries,
  activeLibraryId,
  onSave,
}: BookFormDialogProps) {
  const isEditing = !!book
  const {
    coverUrl,
    setCoverUrl,
    results,
    selectedIndex,
    isSearching,
    statusMessage,
    statusType,
    lookupCover,
    selectCover,
    reset: resetLookup,
    scheduleAutoLookup,
  } = useCoverLookup()

  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [genre, setGenre] = useState("")
  const [status, setStatus] = useState<"read" | "reading" | "tbr">("read")
  const [dateRead, setDateRead] = useState("")
  const [pages, setPages] = useState("")
  const [rating, setRating] = useState(0)
  const [libraryId, setLibraryId] = useState("")
  const [review, setReview] = useState("")

  useEffect(() => {
    if (open) {
      if (book) {
        setTitle(book.title)
        setAuthor(book.author === "Unknown" ? "" : book.author)
        setGenre(book.genre === "Uncategorized" ? "" : book.genre)
        setStatus(book.status)
        setDateRead(book.dateRead || "")
        setPages(book.pages ? String(book.pages) : "")
        setRating(book.rating)
        setLibraryId(
          book.libraryId || (libraries.length > 0 ? libraries[0].id : "")
        )
        setReview(book.review || "")
        if (book.cover) {
          setCoverUrl(book.cover)
        } else {
          resetLookup()
        }
      } else {
        setTitle("")
        setAuthor("")
        setGenre("")
        setStatus("read")
        setDateRead("")
        setPages("")
        setRating(0)
        setLibraryId(
          activeLibraryId !== "all"
            ? activeLibraryId
            : libraries.length > 0
            ? libraries[0].id
            : ""
        )
        setReview("")
        resetLookup()
      }
    }
  }, [open, book, activeLibraryId, libraries, resetLookup, setCoverUrl])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    scheduleAutoLookup(newTitle, author)
  }

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAuthor = e.target.value
    setAuthor(newAuthor)
    scheduleAutoLookup(title, newAuthor)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      alert("Please enter a book title.")
      return
    }

    onSave({
      title: title.trim(),
      author: author.trim() || "Unknown",
      genre: genre.trim() || "Uncategorized",
      status,
      dateRead,
      pages: parseInt(pages) || 0,
      cover: coverUrl.trim(),
      rating,
      review: review.trim(),
      libraryId: libraryId || (libraries.length > 0 ? libraries[0].id : ""),
    })

    if (!isEditing && rating >= 8) {
      triggerConfetti(rating)
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] bg-surface border-border text-foreground max-h-[90vh] overflow-y-auto p-6 shadow-xl">
        <form onSubmit={handleSave}>
          <DialogHeader className="pb-4 border-b border-border mb-4">
            <DialogTitle>{isEditing ? "Edit Book" : "Add Book"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[0.78rem] font-semibold text-text-dim uppercase tracking-wide">
                Book Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g. Dune"
                value={title}
                onChange={handleTitleChange}
                required
                className="bg-surface-2 border-border focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-sans text-[0.9rem]"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author" className="text-[0.78rem] font-semibold text-text-dim uppercase tracking-wide">
                Author *
              </Label>
              <Input
                id="author"
                placeholder="e.g. Frank Herbert"
                value={author}
                onChange={handleAuthorChange}
                className="bg-surface-2 border-border focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-sans text-[0.9rem]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
              <div className="space-y-2">
                <Label htmlFor="genre" className="text-[0.78rem] font-semibold text-text-dim uppercase tracking-wide">
                  Genre
                </Label>
                <Input
                  id="genre"
                  placeholder="e.g. Science Fiction"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="bg-surface-2 border-border focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-sans text-[0.9rem]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-[0.78rem] font-semibold text-text-dim uppercase tracking-wide">
                  Status
                </Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full h-10 rounded-md border border-border bg-surface-2 px-3 py-2 text-[0.9rem] font-sans ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-faint focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-no-repeat bg-[right_10px_center] pr-7 transition-all cursor-pointer"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23555a66' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")" }}
                >
                  <option value="read">Read</option>
                  <option value="reading">Reading</option>
                  <option value="tbr">To Be Read</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
              <div className="space-y-2">
                <Label htmlFor="dateRead" className="text-[0.78rem] font-semibold text-text-dim uppercase tracking-wide">
                  Date Read
                </Label>
                <Input
                  id="dateRead"
                  type="date"
                  value={dateRead}
                  onChange={(e) => setDateRead(e.target.value)}
                  className="bg-surface-2 border-border focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-sans text-[0.9rem] [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pages" className="text-[0.78rem] font-semibold text-text-dim uppercase tracking-wide">
                  Pages
                </Label>
                <Input
                  id="pages"
                  type="number"
                  min="1"
                  placeholder="e.g. 412"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  className="bg-surface-2 border-border focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-sans text-[0.9rem]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[0.78rem] font-semibold text-text-dim uppercase tracking-wide">
                Book Cover
              </Label>
              <div className="flex gap-3.5 items-start">
                <div
                  className={cn(
                    "w-[90px] h-[135px] rounded-sm bg-surface-2 border-2 border-dashed flex items-center justify-center text-4xl flex-shrink-0 overflow-hidden transition-all duration-200",
                    coverUrl ? "border-success border-solid" : "border-border"
                  )}
                >
                  {coverUrl ? (
                    <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    "📖"
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <Button
                    type="button"
                    onClick={() => lookupCover(title, author)}
                    disabled={isSearching}
                    className="w-fit bg-primary text-primary-foreground hover:bg-gold-hover h-9 font-sans font-medium transition-all"
                  >
                    {isSearching ? "⏳ Searching..." : <><Search className="w-4 h-4 mr-1.5" /> Find Cover</>}
                  </Button>
                  <div
                    className={cn(
                      "text-[0.76rem]",
                      statusType === "success" && "text-success",
                      statusType === "error" && "text-destructive",
                      statusType === "idle" && "text-text-faint"
                    )}
                  >
                    {statusMessage}
                  </div>
                  {results.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-1">
                      {results.map((r, i) => (
                        <img
                          key={r.thumbUrl}
                          src={r.thumbUrl}
                          alt={`Cover option ${i + 1}`}
                          className={cn(
                            "w-[52px] h-[78px] rounded border-2 cursor-pointer object-cover transition-all duration-150 hover:scale-[1.08] hover:shadow-[0_2px_10px_rgba(0,0,0,0.3)]",
                            selectedIndex === i ? "border-primary" : "border-transparent"
                          )}
                          onClick={() => selectCover(i)}
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      ))}
                    </div>
                  )}
                  <details className="mt-1">
                    <summary className="text-[0.76rem] text-text-faint cursor-pointer hover:text-text-dim select-none">
                      Or enter a cover URL manually
                    </summary>
                    <Input
                      type="url"
                      placeholder="https://..."
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                      className="mt-1.5 bg-surface-2 border-border font-sans h-8 text-[0.8rem]"
                    />
                  </details>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[0.78rem] font-semibold text-text-dim uppercase tracking-wide">
                Rating <span className="font-normal normal-case tracking-normal text-text-faint">(1–10)</span>
              </Label>
              <RatingInput value={rating} onChange={setRating} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="library" className="text-[0.78rem] font-semibold text-text-dim uppercase tracking-wide">
                Library
              </Label>
              <select
                id="library"
                value={libraryId}
                onChange={(e) => setLibraryId(e.target.value)}
                className="w-full h-10 rounded-md border border-border bg-surface-2 px-3 py-2 text-[0.9rem] font-sans ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-faint focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-no-repeat bg-[right_10px_center] pr-7 transition-all cursor-pointer"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23555a66' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")" }}
              >
                {libraries.map((lib) => (
                  <option key={lib.id} value={lib.id}>
                    {lib.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review" className="text-[0.78rem] font-semibold text-text-dim uppercase tracking-wide">
                Review / Notes
              </Label>
              <Textarea
                id="review"
                placeholder="Write your thoughts about this book..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="bg-surface-2 border-border focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-sans text-[0.9rem] min-h-[76px] resize-y"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter className="mt-6 pt-3.5 border-t border-border flex gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-surface-2 border-border text-foreground hover:bg-surface-3 hover:border-border-hover font-sans h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-gold-hover hover:-translate-y-[1px] font-medium font-sans h-9 transition-all"
            >
              Save Book
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
