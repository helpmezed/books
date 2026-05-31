import { useState, useCallback, useEffect } from "react"
import type { Library } from "@/lib/types"
import { genId } from "@/lib/utils"

const LIBRARIES_KEY = "bookshelf_libraries"
const ACTIVE_LIB_KEY = "bookshelf_activeLib"

function loadLibraries(): Library[] {
  const libs = JSON.parse(localStorage.getItem(LIBRARIES_KEY) || "[]")
  if (libs.length === 0) {
    const defaultLib: Library = {
      id: genId(),
      name: "My Library",
      dateCreated: new Date().toISOString(),
    }
    libs.push(defaultLib)
    localStorage.setItem(LIBRARIES_KEY, JSON.stringify(libs))
  }
  return libs
}

function loadActiveLibraryId(): string {
  return localStorage.getItem(ACTIVE_LIB_KEY) || "all"
}

export function useLibraries() {
  const [libraries, setLibraries] = useState<Library[]>(loadLibraries)
  const [activeLibraryId, setActiveLibraryId] = useState<string>(loadActiveLibraryId)

  useEffect(() => {
    localStorage.setItem(LIBRARIES_KEY, JSON.stringify(libraries))
  }, [libraries])

  useEffect(() => {
    localStorage.setItem(ACTIVE_LIB_KEY, activeLibraryId)
  }, [activeLibraryId])

  const switchLibrary = useCallback((id: string) => {
    setActiveLibraryId(id)
  }, [])

  const createLibrary = useCallback((name: string): Library | null => {
    if (!name.trim()) return null
    const lib: Library = {
      id: genId(),
      name: name.trim(),
      dateCreated: new Date().toISOString(),
    }
    setLibraries((prev) => [...prev, lib])
    setActiveLibraryId(lib.id)
    return lib
  }, [])

  const renameLibrary = useCallback((id: string, newName: string): boolean => {
    if (!newName.trim()) return false
    setLibraries((prev) =>
      prev.map((l) => (l.id === id ? { ...l, name: newName.trim() } : l))
    )
    return true
  }, [])

  const deleteLibrary = useCallback(
    (id: string): string | null => {
      const remaining = libraries.filter((l) => l.id !== id)
      if (remaining.length === 0) {
        const defaultLib: Library = {
          id: genId(),
          name: "My Library",
          dateCreated: new Date().toISOString(),
        }
        remaining.push(defaultLib)
      }
      const targetLibId = remaining[0].id
      setLibraries(remaining)
      if (activeLibraryId === id) {
        setActiveLibraryId("all")
      }
      return targetLibId
    },
    [libraries, activeLibraryId]
  )

  const getLibName = useCallback(
    (id: string): string => {
      const lib = libraries.find((l) => l.id === id)
      return lib ? lib.name : "Unknown"
    },
    [libraries]
  )

  const mergeLibraries = useCallback(
    (imported: Library[]) => {
      const existingIds = new Set(libraries.map((l) => l.id))
      const newLibs = imported.filter((l) => !existingIds.has(l.id))
      if (newLibs.length > 0) {
        setLibraries((prev) => [...prev, ...newLibs])
      }
    },
    [libraries]
  )

  return {
    libraries,
    activeLibraryId,
    switchLibrary,
    createLibrary,
    renameLibrary,
    deleteLibrary,
    getLibName,
    mergeLibraries,
  }
}
