import { useState, useCallback, useRef } from "react"

interface CoverResult {
  thumbUrl: string
  largeUrl: string
}

interface UseCoverLookupReturn {
  coverUrl: string
  setCoverUrl: (url: string) => void
  results: CoverResult[]
  selectedIndex: number
  isSearching: boolean
  statusMessage: string
  statusType: "idle" | "success" | "error"
  lookupCover: (title: string, author: string) => Promise<void>
  selectCover: (index: number) => void
  reset: () => void
  scheduleAutoLookup: (title: string, author: string) => void
}

export function useCoverLookup(): UseCoverLookupReturn {
  const [coverUrl, setCoverUrl] = useState("")
  const [results, setResults] = useState<CoverResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isSearching, setIsSearching] = useState(false)
  const [statusMessage, setStatusMessage] = useState(
    "Enter a title and click Find Cover, or it will auto-search."
  )
  const [statusType, setStatusType] = useState<"idle" | "success" | "error">("idle")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const reset = useCallback(() => {
    setCoverUrl("")
    setResults([])
    setSelectedIndex(-1)
    setIsSearching(false)
    setStatusMessage("Enter a title and click Find Cover, or it will auto-search.")
    setStatusType("idle")
  }, [])

  const selectCover = useCallback(
    (index: number) => {
      if (index >= 0 && index < results.length) {
        setSelectedIndex(index)
        setCoverUrl(results[index].largeUrl)
        setStatusMessage("Cover selected! It will be saved with your book.")
        setStatusType("success")
      }
    },
    [results]
  )

  const lookupCover = useCallback(async (title: string, author: string) => {
    if (!title.trim()) {
      setStatusMessage("Please enter a book title first.")
      setStatusType("error")
      return
    }

    setIsSearching(true)
    setStatusMessage("Searching Open Library...")
    setStatusType("idle")
    setResults([])

    try {
      const query = encodeURIComponent(title)
      const authorQuery = author ? `&author=${encodeURIComponent(author)}` : ""
      const url = `https://openlibrary.org/search.json?title=${query}${authorQuery}&limit=8&fields=title,author_name,cover_i,isbn`

      const resp = await fetch(url)
      if (!resp.ok) throw new Error("API request failed")
      const data = await resp.json()

      const coverIds: (number | string)[] = []
      for (const doc of data.docs || []) {
        if (doc.cover_i && !coverIds.includes(doc.cover_i)) {
          coverIds.push(doc.cover_i)
        }
        if (coverIds.length >= 8) break
      }

      if (coverIds.length === 0) {
        for (const doc of data.docs || []) {
          if (doc.isbn) {
            for (const isbn of doc.isbn.slice(0, 3)) {
              const imgUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
              try {
                const imgTest = await fetch(imgUrl, { method: "HEAD" })
                if (imgTest.ok) {
                  coverIds.push(`isbn:${isbn}`)
                }
              } catch {
                // skip
              }
              if (coverIds.length >= 8) break
            }
          }
          if (coverIds.length >= 8) break
        }
      }

      if (coverIds.length === 0) {
        setStatusMessage("No covers found. Try entering a URL manually.")
        setStatusType("error")
        setIsSearching(false)
        return
      }

      const newResults: CoverResult[] = coverIds.map((id) => {
        const isIsbn = typeof id === "string" && id.startsWith("isbn:")
        const key = isIsbn ? id.slice(5) : id
        const base = isIsbn ? "isbn" : "id"
        return {
          thumbUrl: `https://covers.openlibrary.org/b/${base}/${key}-M.jpg`,
          largeUrl: `https://covers.openlibrary.org/b/${base}/${key}-L.jpg`,
        }
      })

      setResults(newResults)
      if (newResults.length > 0) {
        setSelectedIndex(0)
        setCoverUrl(newResults[0].largeUrl)
        setStatusMessage(`Found ${coverIds.length} cover(s). Click another to change.`)
        setStatusType("success")
      }
    } catch (err) {
      console.error("Cover lookup error:", err)
      setStatusMessage("Error searching for covers. Check your connection.")
      setStatusType("error")
    }

    setIsSearching(false)
  }, [])

  const scheduleAutoLookup = useCallback(
    (title: string, author: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      if (title.trim().length >= 3) {
        debounceRef.current = setTimeout(() => {
          lookupCover(title, author)
        }, 1200)
      }
    },
    [lookupCover]
  )

  return {
    coverUrl,
    setCoverUrl,
    results,
    selectedIndex,
    isSearching,
    statusMessage,
    statusType,
    lookupCover,
    selectCover,
    reset,
    scheduleAutoLookup,
  }
}
