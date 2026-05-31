import { cn } from "@/lib/utils"

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-20 px-6 text-text-dim">
      <div
        className="text-[4rem] mb-4 leading-tight animate-float-icon"
        aria-hidden="true"
      >
        📚✨📖
      </div>
      <h3 className="text-[1.2rem] text-foreground mb-2 font-semibold">
        Your shelf is empty
      </h3>
      <p className="mb-6 text-text-faint max-w-[360px] mx-auto">
        Start your reading journey by adding your first book.
      </p>
      <button
        className={cn(
          "bg-primary text-primary-foreground border-none rounded-sm px-4 py-2",
          "font-sans text-[0.88rem] font-medium cursor-pointer transition-transform",
          "hover:bg-gold-hover hover:-translate-y-[1px] active:scale-95"
        )}
        onClick={onAdd}
      >
        + Add Your First Book
      </button>
    </div>
  )
}
