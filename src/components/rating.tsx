import { cn, getRatingTier, getRatingLabel } from "@/lib/utils"

interface RatingBadgeProps {
  rating: number
  isDetail?: boolean
  className?: string
}

const tierStyles: Record<string, string> = {
  none: "bg-surface-3 text-text-faint",
  low: "bg-destructive/15 text-red-400 border border-destructive/20",
  mid: "bg-gold/12 text-gold border border-gold/20",
  good: "bg-info/12 text-info border border-info/20",
  great: "bg-success/12 text-success border border-success/20",
  perfect:
    "bg-gradient-to-br from-gold/18 to-success/18 text-gold-hover border border-gold/30",
}

export function RatingBadge({ rating, isDetail, className }: RatingBadgeProps) {
  const tier = getRatingTier(rating)
  const label = getRatingLabel(rating)

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center min-w-[36px] h-7 px-2 rounded-lg font-sans text-[0.85rem] font-bold",
        "transition-transform duration-250 cursor-default relative overflow-hidden",
        "hover:scale-110",
        tierStyles[tier],
        isDetail && "animate-rating-reveal",
        tier === "perfect" && "drop-shadow-[0_0_10px_rgba(212,160,83,0.3)]",
        className
      )}
    >
      {label}
    </span>
  )
}

interface RatingInputProps {
  value: number
  onChange: (rating: number) => void
}

export function RatingInput({ value, onChange }: RatingInputProps) {
  return (
    <div className="flex gap-1 flex-wrap items-center" role="radiogroup" aria-label="Book rating">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          type="button"
          role="radio"
          aria-label={`Rate ${num}`}
          aria-checked={value === num}
          tabIndex={0}
          onClick={() => {
            onChange(num)
          }}
          className={cn(
            "w-[34px] h-[34px] rounded-lg border font-sans text-[0.88rem] font-semibold cursor-pointer",
            "flex items-center justify-center relative overflow-hidden",
            "transition-all duration-200",
            value === num
              ? "bg-primary text-primary-foreground border-primary scale-110 shadow-[0_0_12px_var(--color-gold-glow),0_2px_8px_rgba(0,0,0,0.2)]"
              : "bg-surface-2 border-border text-text-dim hover:border-primary hover:text-gold-hover hover:bg-surface-3 hover:scale-105"
          )}
        >
          {num}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(0)}
        className="px-2.5 py-1 border-none bg-transparent text-text-faint font-sans text-[0.72rem] cursor-pointer uppercase tracking-wider hover:text-destructive transition-colors"
        aria-label="Clear rating"
      >
        Clear
      </button>
    </div>
  )
}
