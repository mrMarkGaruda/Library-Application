import type { Author } from "../types/Author"
import type { Book } from "../types/Book"

// Build the server dataset from the project CSV `_full-booklist.csv`.
// Vite provides a `?raw` import that inlines the file as a string at build time.
import booklistCsv from "../../_full-booklist.csv?raw"

const normalize = (s: string) => s.trim().replace(/^"|"$/g, "")

type RawEntry = { title: string; author: string; isbn: string }

const parseCsv = (raw: string): RawEntry[] => {
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (lines.length === 0) return []
  // Remove header if present like "Book,ISBN"
  if (/^book[,\s]*isbn$/i.test(lines[0])) {
    lines.shift()
  }

  return lines.map((line) => {
    // Split on the LAST comma to allow commas in titles
    const idx = line.lastIndexOf(",")
    const left = idx >= 0 ? line.slice(0, idx) : line
    const right = idx >= 0 ? line.slice(idx + 1) : ""
    const isbn = normalize(right)
    const titleAuthor = normalize(left)

    // Try to split title and author by the LAST ' - ' occurrence
    const dashIdx = titleAuthor.lastIndexOf(" - ")
    let title = titleAuthor
    let author = "Unknown"
    if (dashIdx >= 0) {
      title = normalize(titleAuthor.slice(0, dashIdx))
      author = normalize(titleAuthor.slice(dashIdx + 3))
    }

    return { title, author, isbn }
  })
}

const entries = parseCsv(String(booklistCsv))

// Build a unique authors list from entries and map them to numeric IDs
const authorMap = new Map<string, number>()
const authors: Author[] = []
let nextAuthorId = 1001
for (const e of entries) {
  const name = e.author || "Unknown"
  if (!authorMap.has(name)) {
    const id = nextAuthorId++
    authorMap.set(name, id)
  authors.push({ id, name, bio: "", birthYear: 0, country: "" })
  }
}

// Build book objects with incremental ids and an OpenLibrary coverUrl based on ISBN
const books: Book[] = []
let nextBookId = 5001
for (const e of entries) {
  const authorId = authorMap.get(e.author || "Unknown")!
  const cover = e.isbn ? `https://covers.openlibrary.org/b/isbn/${e.isbn}-L.jpg` : ""
  books.push({
    id: nextBookId++,
    title: e.title,
    authorId,
    isbn: e.isbn || "",
    publishedYear: 0,
    description: "",
    coverUrl: cover,
    author: e.author || null,
  })
}

export const serverAuthors: Author[] = authors
export const serverBooks: Book[] = books

// Info for debugging
export const serverSeedInfo = {
  authors: serverAuthors.length,
  books: serverBooks.length,
}
