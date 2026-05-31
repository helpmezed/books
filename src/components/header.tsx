import { useRef, useEffect } from "react"
import { Search, Plus, Settings, Upload, Download } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  searchQuery: string
  setSearchQuery: (q: string) => void
  onAddBook: () => void
  onExport: () => void
  onImport: (content: string) => void
}

export function Header({
  searchQuery,
  setSearchQuery,
  onAddBook,
  onExport,
  onImport,
}: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        onImport(event.target.result as string)
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Keyboard shortcut for Add Book
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        const tag = document.activeElement?.tagName
        if (tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
          e.preventDefault()
          onAddBook()
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onAddBook])

  return (
    <header className="bg-surface border-b border-border py-3.5 sticky top-0 z-[100]">
      <div className="max-w-[1280px] mx-auto px-7 flex items-center justify-between flex-wrap gap-3.5 max-sm:flex-col max-sm:items-stretch">
        <div className="flex items-center gap-2.5 text-[1.2rem] font-semibold text-foreground">
          <span className="text-[1.4rem] inline-block animate-logo-bounce">📚</span>
          Book<span className="text-primary">Shelf</span>
        </div>

        <div className="flex items-center gap-2.5 max-sm:flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint w-[14px] h-[14px] pointer-events-none" />
            <Input
              type="text"
              placeholder="Search books, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface-2 border-border rounded-sm py-2 px-3.5 pl-9 text-foreground font-sans text-[0.88rem] w-[240px] h-9 focus-visible:ring-primary/20 focus-visible:border-primary max-sm:w-full transition-all duration-200"
              aria-label="Search books"
            />
          </div>

          <Button
            onClick={onAddBook}
            className="bg-primary text-primary-foreground hover:bg-gold-hover hover:-translate-y-[1px] font-medium font-sans h-9 px-4 rounded-sm transition-all duration-200"
            aria-label="Add a new book"
          >
            <Plus className="mr-1.5 w-[14px] h-[14px]" />
            Add Book
            <span
              className="inline-block px-1.5 py-0.5 text-[0.68rem] text-text-faint bg-surface-2 border border-border rounded ml-2"
              aria-hidden="true"
            >
              Ctrl+N
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-text-dim hover:text-foreground hover:bg-surface-2 h-9 w-9 rounded-sm"
                aria-label="Settings"
              >
                <Settings className="w-[18px] h-[18px]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-surface border-border text-foreground">
              <DropdownMenuItem onClick={onExport} className="cursor-pointer hover:bg-surface-2 font-sans py-2.5">
                <Download className="mr-2 h-4 w-4" />
                <span>Export Library (JSON)</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer hover:bg-surface-2 font-sans py-2.5"
              >
                <Upload className="mr-2 h-4 w-4" />
                <span>Import Library (JSON)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </header>
  )
}
