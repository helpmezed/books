import { useState } from "react"
import { Pencil, Trash2, Plus, Library as LibraryIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Library } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface LibraryBarProps {
  libraries: Library[]
  activeLibraryId: string
  onSwitchLibrary: (id: string) => void
  onCreateLibrary: (name: string) => void
  onRenameLibrary: (id: string, newName: string) => void
  onDeleteLibrary: (id: string) => void
  getBookCount: (id: string) => number
  totalBooks: number
}

export function LibraryBar({
  libraries,
  activeLibraryId,
  onSwitchLibrary,
  onCreateLibrary,
  onRenameLibrary,
  onDeleteLibrary,
  getBookCount,
  totalBooks,
}: LibraryBarProps) {
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [libraryToDelete, setLibraryToDelete] = useState<Library | null>(null)

  const handleCreate = () => {
    const name = window.prompt("Library name:")
    if (name && name.trim()) {
      onCreateLibrary(name.trim())
    }
  }

  const handleRename = (lib: Library) => {
    const newName = window.prompt("Rename library:", lib.name)
    if (newName && newName.trim() && newName.trim() !== lib.name) {
      onRenameLibrary(lib.id, newName.trim())
    }
  }

  const confirmDelete = (lib: Library) => {
    setLibraryToDelete(lib)
    setIsDeleteAlertOpen(true)
  }

  const handleDelete = () => {
    if (libraryToDelete) {
      onDeleteLibrary(libraryToDelete.id)
    }
    setLibraryToDelete(null)
  }

  return (
    <>
      <div className="max-w-[1280px] mx-auto px-7 flex items-center gap-2 overflow-x-auto mt-4 no-scrollbar">
        <button
          onClick={() => onSwitchLibrary("all")}
          className={cn(
            "inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-surface border rounded-sm font-sans text-[0.84rem] font-medium whitespace-nowrap flex-shrink-0 transition-colors",
            activeLibraryId === "all"
              ? "bg-gold-subtle border-primary/30 text-gold-hover"
              : "border-border text-text-dim hover:bg-surface-2 hover:border-border-hover hover:text-foreground"
          )}
          aria-label="Show all books"
        >
          <span className="text-[1.1rem]">📚</span> All
          <span
            className={cn(
              "text-[0.72rem] px-1.5 py-[1px] rounded-[10px] ml-1",
              activeLibraryId === "all"
                ? "bg-primary/15 text-primary"
                : "bg-surface-3 text-text-faint"
            )}
          >
            {totalBooks}
          </span>
        </button>

        {libraries.map((lib) => {
          const isActive = activeLibraryId === lib.id
          const count = getBookCount(lib.id)
          return (
            <div key={lib.id} className="relative group flex-shrink-0">
              <button
                onClick={() => onSwitchLibrary(lib.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-surface border rounded-sm font-sans text-[0.84rem] font-medium whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-gold-subtle border-primary/30 text-gold-hover"
                    : "border-border text-text-dim hover:bg-surface-2 hover:border-border-hover hover:text-foreground"
                )}
                aria-label={`Show ${lib.name} library`}
              >
                <LibraryIcon className="w-3.5 h-3.5" />
                {lib.name}
                <span
                  className={cn(
                    "text-[0.72rem] px-1.5 py-[1px] rounded-[10px] ml-1",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "bg-surface-3 text-text-faint"
                  )}
                >
                  {count}
                </span>
                <span
                  className="w-4.5 h-4.5 rounded bg-transparent border-none text-text-faint text-[0.7rem] opacity-0 group-hover:opacity-100 transition-all hover:bg-surface-3 hover:text-foreground flex items-center justify-center ml-1"
                  title="Rename library"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRename(lib)
                  }}
                >
                  <Pencil className="w-3 h-3" />
                </span>
                <span
                  className="w-4.5 h-4.5 rounded bg-transparent border-none text-text-faint text-[0.7rem] opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/20 hover:text-destructive flex items-center justify-center"
                  title="Delete library"
                  onClick={(e) => {
                    e.stopPropagation()
                    confirmDelete(lib)
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </span>
              </button>
            </div>
          )
        })}

        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-transparent border border-dashed border-border rounded-sm text-text-faint font-sans text-[0.84rem] whitespace-nowrap flex-shrink-0 transition-colors hover:border-primary hover:text-primary hover:bg-gold-subtle"
          aria-label="Create new library"
        >
          <Plus className="w-3.5 h-3.5" /> New Library
        </button>
      </div>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="bg-surface border-border text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-text-dim">
              {libraryToDelete && getBookCount(libraryToDelete.id) > 0
                ? `Delete "${
                    libraryToDelete.name
                  }"? ${getBookCount(
                    libraryToDelete.id
                  )} book(s) will be moved to the first remaining library.`
                : `Delete "${
                    libraryToDelete?.name
                  }"? This can't be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-surface-2 text-foreground border-border hover:bg-surface-3">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-danger-hover"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
