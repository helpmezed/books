import type { Book } from "@/lib/types"
import { cn, formatDate } from "@/lib/utils"
import { RatingBadge } from "./rating"
import { Pencil, Trash2 } from "lucide-react"
import { useState } from "react"

interface BookCardProps {
  book: Book
  index: number
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onView: (id: string) => void
}

export function BookCard({ book, index, onEdit, onDelete, onView }: BookCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const hasImage = !!book.cover
  const delay = Math.min(index * 0.05, 0.5)

  const statusLabel =
    book.status === "read" ? "✓ Read" : book.status === "reading" ? "📖 Reading" : "📋 TBR"
  const statusClass =
    book.status === "read"
      ? "bg-success-glow text-success"
      : book.status === "reading"
      ? "bg-gold-subtle text-gold-hover"
      : "bg-gold/10 text-gold"

  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-xl overflow-hidden relative opacity-0 animate-card-enter",
        "transition-all duration-250 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        "hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.35),0_0_0_1px_rgba(212,160,83,0.15)] hover:border-primary/25 group"
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="absolute inset-0 rounded-xl opacity-0 pointer-events-none transition-opacity duration-300 shadow-[inset_0_1px_0_rgba(212,160,83,0.08)] group-hover:opacity-100" />

      <div className="flex gap-4 p-4 pb-3">
        <div
          className={cn(
            "w-[76px] h-[114px] rounded-md object-cover flex-shrink-0 bg-surface-2 flex items-center justify-center text-3xl relative shadow-[3px_3px_10px_rgba(0,0,0,0.3)] cursor-pointer overflow-hidden",
            hasImage && !imageLoaded && "animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-surface-2 via-surface-3 to-surface-2"
          )}
          onClick={() => onView(book.id)}
          role="button"
          tabIndex={0}
          aria-label={`View ${book.title} details`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onView(book.id)
          }}
        >
          {book.cover ? (
            <img
              src={book.cover}
              alt=""
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.currentTarget.style.display = "none"
                setImageLoaded(true)
              }}
              className={cn("w-full h-full object-cover transition-opacity duration-300", imageLoaded ? "opacity-100" : "opacity-0")}
            />
          ) : (
            "📖"
          )}
          {!book.cover && !imageLoaded && "📖"}
        </div>

        <div className="flex-1 min-w-0">
          <div
            className="font-sans text-base font-semibold text-foreground mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer transition-colors group-hover:text-gold-hover"
            onClick={() => onView(book.id)}
          >
            {book.title}
          </div>
          <div className="text-text-dim text-[0.84rem] mb-2">{book.author}</div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-gold-subtle text-gold-hover px-2.5 py-0.5 rounded-full text-[0.7rem] font-medium uppercase tracking-wide border border-gold/10 group-hover:animate-[tag-wiggle_0.5s_cubic-bezier(0.34,1.56,0.64,1)]">
              {book.genre}
            </span>
            <span className={cn("inline-flex items-center gap-1 text-[0.72rem] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide", statusClass)}>
              {statusLabel}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1.5 mb-0.5">
            <RatingBadge rating={book.rating} />
          </div>
        </div>
      </div>

      {book.review && (
        <div className="px-4 pb-1 text-text-dim text-[0.84rem] italic leading-relaxed line-clamp-2 border-l-2 border-border ml-4 mr-4 pl-3">
          {book.review}
        </div>
      )}

      <div className="px-4 py-2.5 flex items-center justify-end gap-2 border-t border-border mt-1.5">
        <span className="text-text-faint text-[0.76rem]">
          {book.dateRead ? `📅 ${formatDate(book.dateRead)}` : ""}
        </span>
        {book.pages ? (
          <span className="text-text-faint text-[0.76rem]">
            · {book.pages.toLocaleString()}p
          </span>
        ) : null}
        <div className="flex-1"></div>
        <button
          onClick={() => onEdit(book.id)}
          className="p-1.5 bg-surface-2 text-text-dim border border-border rounded-sm hover:bg-surface-3 hover:border-border-hover hover:text-foreground transition-all flex items-center justify-center cursor-pointer active:scale-95"
          aria-label={`Edit ${book.title}`}
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(book.id)}
          className="p-1.5 bg-surface-2 text-text-dim border border-border rounded-sm hover:bg-destructive hover:border-destructive/50 hover:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
          aria-label={`Delete ${book.title}`}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
