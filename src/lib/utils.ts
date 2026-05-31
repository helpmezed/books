import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ""
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

export function getRatingTier(r: number): string {
  if (!r || r === 0) return "none"
  if (r <= 3) return "low"
  if (r <= 5) return "mid"
  if (r <= 7) return "good"
  if (r <= 9) return "great"
  return "perfect"
}

export function getRatingLabel(rating: number): string {
  if (!rating || rating === 0) return "—"
  return rating === 10 ? "10 ✦" : `${rating}/10`
}
