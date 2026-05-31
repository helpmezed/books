import { BookOpen, CheckCircle, BookOpenCheck, Star, FileText } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

function AnimatedValue({ value, isFloat = false }: { value: number | string; isFloat?: boolean }) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    if (typeof value === "string") {
      setDisplayValue(value)
      return
    }

    let startTimestamp: number | null = null
    const duration = 400
    const startValue = typeof displayValue === "number" ? displayValue : 0
    const endValue = value

    if (startValue === endValue) return

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3) // easeOutCubic

      const current = startValue + (endValue - startValue) * ease
      setDisplayValue(isFloat ? Number(current.toFixed(1)) : Math.round(current))

      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }

    window.requestAnimationFrame(step)
  }, [value, isFloat])

  return <>{typeof displayValue === "number" ? displayValue.toLocaleString() : displayValue}</>
}

interface StatsBarProps {
  total: number
  read: number
  reading: number
  avgRating: string
  totalPages: number
}

export function StatsBar({ total, read, reading, avgRating, totalPages }: StatsBarProps) {
  const stats = [
    {
      label: "Books Tracked",
      value: total,
      icon: <BookOpen className="w-5 h-5 mb-1" />,
      colorClass: "before:bg-primary",
      delay: "0.05s",
    },
    {
      label: "Books Read",
      value: read,
      icon: <CheckCircle className="w-5 h-5 mb-1" />,
      colorClass: "before:bg-success",
      delay: "0.12s",
    },
    {
      label: "Reading Now",
      value: reading,
      icon: <BookOpenCheck className="w-5 h-5 mb-1" />,
      colorClass: "before:bg-info",
      delay: "0.19s",
    },
    {
      label: "Avg Rating",
      value: avgRating,
      icon: <Star className="w-5 h-5 mb-1" />,
      colorClass: "before:bg-gold",
      delay: "0.26s",
    },
    {
      label: "Pages Read",
      value: totalPages,
      icon: <FileText className="w-5 h-5 mb-1" />,
      colorClass: "before:bg-[#c47a9a]",
      delay: "0.33s",
    },
  ]

  return (
    <div className="max-w-[1280px] mx-auto mt-6 mb-6 px-7 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-sm:px-4 max-sm:gap-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            "bg-surface border border-border rounded-xl p-5 text-center relative overflow-hidden transition-all duration-200 hover:-translate-y-[1px] hover:border-border-hover animate-stat-pop",
            "before:absolute before:top-0 before:left-0 before:w-[3px] before:h-full before:rounded-r-[3px]",
            stat.colorClass,
            "max-sm:p-3.5 max-sm:px-3"
          )}
          style={{ animationDelay: stat.delay }}
        >
          <span className="text-[1.2rem] flex justify-center text-foreground" aria-hidden="true">
            {stat.icon}
          </span>
          <div className="font-sans text-[1.7rem] font-bold text-foreground leading-[1.2] max-sm:text-[1.4rem]">
            <AnimatedValue value={stat.value} isFloat={stat.label === "Avg Rating"} />
          </div>
          <div className="text-text-dim text-[0.75rem] font-medium mt-1 uppercase tracking-wider">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}
