import type { Book } from "@/lib/types"
import { cn, formatDate } from "@/lib/utils"
import { RatingBadge } from "./rating"
import { Pencil, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface BookDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  book: Book | null
  libName: string
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function BookDetailDialog({
  open,
  onOpenChange,
  book,
  libName,
  onEdit,
  onDelete,
}: BookDetailDialogProps) {
  if (!book) return null

  const statusLabel =
    book.status === "read" ? "✓ Read" : book.status === "reading" ? "📖 Reading" : "📋 TBR"
  const statusClass =
    book.status === "read"
      ? "bg-success-glow text-success"
      : book.status === "reading"
      ? "bg-gold-subtle text-gold-hover"
      : "bg-gold/10 text-gold"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] bg-surface border-border text-foreground max-h-[90vh] overflow-y-auto p-0 shadow-xl [&>button]:right-4 [&>button]:top-4 [&>button]:bg-surface/50 [&>button]:backdrop-blur [&>button]:rounded-md [&>button]:w-8 [&>button]:h-8 [&>button]:flex [&>button]:items-center [&>button]:justify-center">
        <DialogHeader className="sr-only">
          <DialogTitle>Book Details</DialogTitle>
        </DialogHeader>
        
        <div className="p-5.5">
          <div className="w-full max-h-[300px] rounded-xl mb-4.5 bg-surface-2 flex items-center justify-center text-[3.5rem] min-h-[160px] relative overflow-hidden shadow-md">
            {book.cover ? (
              <img
                src={book.cover}
                alt={`${book.title} cover`}
                className="w-full max-h-[300px] object-cover rounded-xl animate-fade-zoom"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                  e.currentTarget.parentElement!.innerHTML = "📖"
                }}
              />
            ) : (
              "📖"
            )}
            <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-t from-surface to-transparent pointer-events-none rounded-b-xl" />
          </div>

          <div className="text-[1.3rem] font-semibold mb-1 leading-tight">{book.title}</div>
          <div className="text-text-dim text-[0.92rem] mb-3">by {book.author}</div>

          <div className="flex gap-2 flex-wrap mb-4">
            <span className="bg-gold-subtle text-gold-hover px-2.5 py-0.5 rounded-full text-[0.7rem] font-medium uppercase tracking-wide border border-gold/10">
              {book.genre}
            </span>
            <span className={cn("inline-flex items-center gap-1 text-[0.72rem] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide", statusClass)}>
              {statusLabel}
            </span>
            <span className="bg-info/10 text-info px-2.5 py-0.5 rounded-full text-[0.7rem] font-medium uppercase tracking-wide border border-info/15 inline-flex items-center gap-1">
              📖 {libName}
            </span>
            {book.dateRead && (
              <span className="text-text-faint text-[0.76rem] flex items-center h-[22px]">
                📅 {formatDate(book.dateRead)}
              </span>
            )}
            {book.pages ? (
              <span className="text-text-faint text-[0.76rem] flex items-center h-[22px]">
                📄 {book.pages.toLocaleString()} pages
              </span>
            ) : null}
          </div>

          <div className="mb-3.5 flex items-center gap-2">
            <RatingBadge rating={book.rating} isDetail />
          </div>

          {book.review && (
            <>
              <div className="text-[0.72rem] font-semibold text-primary uppercase tracking-[0.08em] mb-2 mt-4">
                Review
              </div>
              <div className="text-text-dim leading-relaxed whitespace-pre-wrap italic border-l-[3px] border-primary pl-3.5 ml-1 bg-surface-2/30 p-2 rounded-r-md">
                {book.review}
              </div>
            </>
          )}

          <div className="mt-5 flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onOpenChange(false)
                onEdit(book.id)
              }}
              className="bg-surface-2 border-border text-foreground hover:bg-surface-3 hover:border-border-hover font-sans h-8"
            >
              <Pencil className="w-3.5 h-3.5 mr-1.5" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onDelete(book.id)
              }}
              className="font-sans h-8 hover:bg-danger-hover"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
