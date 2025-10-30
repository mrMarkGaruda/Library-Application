import { useEffect, useMemo, useState } from "react"
import { AlertCircle, BookOpen, CheckCircle2 } from "lucide-react"
import BookCard from "./components/BookCard"
import AuthorCard from "./components/AuthorCard"
import SearchBar from "./components/SearchBar"
import NavigationTabs from "./components/NavogationTabs"
import StatsRibbon from "./components/StatsRibbon"
import BookToolbar from "./components/toolbars/BookToolbar"
import AuthorToolbar from "./components/toolbars/AuthorToolbar"
import BookDetailsModal from "./components/BookDetailsModal"
import AddBookForm from "./components/tabs/AddBookForm"
import AddAuthorForm from "./components/tabs/AddAuthorForm"
import QuickIsbnAdd from "./components/forms/QuickIsbnAdd"
import { libraryAuthors, libraryBooks } from "./data/libraryData"
import type { Book } from "./types/Book"
import type { Author } from "./types/Author"

type BookSortOption = "recent" | "title-asc" | "title-desc" | "year-new" | "year-old"
type BookYearFilter = "all" | "modern" | "classic"
type AuthorSortOption = "alphabetical" | "books-desc" | "birth-new" | "birth-old"

type ToastTone = "success" | "info" | "warning"

type ToastMessage = {
message: string
tone: ToastTone
}

const sanitizeIsbn = (value: string) => value.replace(/[^0-9Xx]/g, "")

const App = () => {
const [activeTab, setActiveTab] = useState<"books" | "authors" | "create">("books")
const [searchTerm, setSearchTerm] = useState("")
const [bookSort, setBookSort] = useState<BookSortOption>("recent")
const [bookYearFilter, setBookYearFilter] = useState<BookYearFilter>("all")
const [bookCategoryFilter, setBookCategoryFilter] = useState<string>("all")
const [authorSort, setAuthorSort] = useState<AuthorSortOption>("alphabetical")
const [previewBook, setPreviewBook] = useState<Book | null>(null)
const [authors, setAuthors] = useState<Author[]>(() => libraryAuthors.map((author) => ({ ...author })))
const [books, setBooks] = useState<Book[]>(() => libraryBooks.map((book) => ({ ...book })))
const [toast, setToast] = useState<ToastMessage | null>(null)

const normalizedSearch = searchTerm.trim().toLowerCase()

const showToast = (message: string, tone: ToastTone = "success") => {
setToast({ message, tone })
}

useEffect(() => {
if (!toast) {
return
}
const timeoutId = window.setTimeout(() => setToast(null), 3600)
return () => window.clearTimeout(timeoutId)
}, [toast])

const ensureAuthorByName = (rawName: string): { author: Author; created: boolean } => {
const normalized = (rawName ?? "Unknown author").trim() || "Unknown author"
const existing = authors.find((author) => author.name.toLowerCase() === normalized.toLowerCase())
if (existing) {
return { author: existing, created: false }
}

let resolved: Author | undefined
let created = false

setAuthors((prev) => {
const prevExisting = prev.find((author) => author.name.toLowerCase() === normalized.toLowerCase())
if (prevExisting) {
resolved = prevExisting
return prev
}
const nextId = prev.reduce((max, author) => Math.max(max, author.id ?? 0), 0) + 1
const nextAuthor: Author = {
id: nextId,
name: normalized,
bio: "",
birthYear: 0,
country: "",
}
resolved = nextAuthor
created = true
return [...prev, nextAuthor]
})

return {
author: resolved ?? {
id: 0,
name: normalized,
bio: "",
birthYear: 0,
country: "",
},
created,
}
}

const addBookToCollection = (
incoming: Book,
{ allowAuthorCreation = false }: { allowAuthorCreation?: boolean } = {}
): "added" | "duplicate" => {
const cleanedIsbn = sanitizeIsbn(incoming.isbn)
const duplicate = cleanedIsbn
? books.some((book) => sanitizeIsbn(book.isbn) === cleanedIsbn)
: books.some((book) => book.title.trim().toLowerCase() === incoming.title.trim().toLowerCase())

if (duplicate) {
return "duplicate"
}

let author = incoming.authorId ? authors.find((candidate) => candidate.id === incoming.authorId) : undefined
const candidateName = incoming.authorNames?.[0] ?? incoming.author ?? author?.name

if (!author && candidateName) {
const lowerName = candidateName.trim().toLowerCase()
author = authors.find((candidate) => candidate.name.toLowerCase() === lowerName)
}

let createdAuthor = false
if (!author && allowAuthorCreation && candidateName) {
const ensured = ensureAuthorByName(candidateName)
author = ensured.author
createdAuthor = ensured.created
}

const authorId = author?.id ?? incoming.authorId ?? 0
const normalizedAuthorNames =
author
? [author.name]
: incoming.authorNames?.length
? incoming.authorNames
: candidateName
? [candidateName]
: undefined

const sanitizedCover =
incoming.coverUrl && incoming.coverUrl.startsWith("http://")
? incoming.coverUrl.replace("http://", "https://")
: incoming.coverUrl

const nextBookId = books.reduce((max, book) => (book.id && book.id > max ? book.id : max), 0) + 1
const normalizedCategories = incoming.categories?.filter((category) => category.trim().length > 0)

const normalizedBook: Book = {
...incoming,
id: nextBookId,
authorId,
authorIds: authorId ? [authorId] : incoming.authorIds,
authorNames: normalizedAuthorNames,
author: normalizedAuthorNames?.[0] ?? incoming.author ?? null,
isbn: cleanedIsbn || incoming.isbn,
coverUrl: sanitizedCover,
categories: normalizedCategories,
}

setBooks((prev) => [...prev, normalizedBook])

const toastMessage =
createdAuthor && author
? `Added "${normalizedBook.title}" and created ${author.name}.`
: `Added "${normalizedBook.title}" to your library.`
showToast(toastMessage)

return "added"
}

const handleManualBookSubmit = async (book: Book) => {
const outcome = addBookToCollection(book, { allowAuthorCreation: false })
if (outcome === "duplicate") {
throw new Error("This ISBN is already in your library.")
}
}

const handleQuickIsbnResolve = async (book: Book): Promise<"added" | "duplicate"> => {
const outcome = addBookToCollection(book, { allowAuthorCreation: true })
if (outcome === "duplicate") {
showToast("That book is already in your library.", "info")
}
return outcome
}

const handleAuthorSubmit = async (authorInput: Author) => {
const normalizedName = authorInput.name.trim()
if (normalizedName.length === 0) {
throw new Error("Author name is required.")
}
const duplicate = authors.some((author) => author.name.toLowerCase() === normalizedName.toLowerCase())
if (duplicate) {
throw new Error(`${normalizedName} is already part of this library.`)
}

const nextAuthorId = authors.reduce((max, author) => (author.id && author.id > max ? author.id : max), 0) + 1
const authorToStore: Author = {
...authorInput,
id: nextAuthorId,
name: normalizedName,
}
setAuthors((prev) => [...prev, authorToStore])
showToast(`Added ${authorToStore.name}.`)
}

const authorBookCount = useMemo(() => {
const counts = new Map<number, number>()
for (const book of books) {
const authorIds = book.authorIds?.length ? book.authorIds : [book.authorId]
for (const id of authorIds ?? []) {
if (!id) {
continue
}
counts.set(id, (counts.get(id) ?? 0) + 1)
}
}
return counts
}, [books])

const availableCategories = useMemo(() => {
	const categoryMap = new Map<string, string>()
	for (const book of books) {
		for (const category of book.categories ?? []) {
			const trimmed = category.trim()
			if (trimmed.length === 0) {
				continue
			}
			const key = trimmed.toLowerCase()
			if (!categoryMap.has(key)) {
				categoryMap.set(key, trimmed)
			}
		}
	}
	return Array.from(categoryMap.values()).sort((a, b) => a.localeCompare(b))
}, [books])

useEffect(() => {
	if (bookCategoryFilter !== "all" && !availableCategories.includes(bookCategoryFilter)) {
		setBookCategoryFilter("all")
	}
}, [availableCategories, bookCategoryFilter])

const matchesSearch = (value: string | null | undefined, search: string) =>
value ? value.toLowerCase().includes(search) : false

const handleTabChange = (tab: string) => {
const safeTab = tab === "authors" ? "authors" : tab === "create" ? "create" : "books"
setActiveTab(safeTab)
}

const filteredBooks = useMemo(() => {
const search = normalizedSearch
const modernCutoff = new Date().getFullYear() - 30

return books
.filter((book) => {
if (search.length > 0) {
const titleMatches = book.title.toLowerCase().includes(search)
const authorMatches = book.authorNames?.some((name) => name.toLowerCase().includes(search))
const descriptionMatches = matchesSearch(book.description, search)
const categoriesMatch = book.categories?.some((category) => category.toLowerCase().includes(search))
if (!titleMatches && !authorMatches && !descriptionMatches && !categoriesMatch) {
return false
}
}

if (bookYearFilter === "modern" && book.publishedYear && book.publishedYear < modernCutoff) {
return false
}

if (bookYearFilter === "classic" && book.publishedYear && book.publishedYear >= modernCutoff) {
return false
}

if (bookCategoryFilter !== "all") {
	const targetCategory = bookCategoryFilter.toLowerCase()
	const categories = book.categories?.map((category) => category.trim().toLowerCase()) ?? []
	if (!categories.some((category) => category === targetCategory)) {
		return false
	}
}

return true
})
.sort((a, b) => {
switch (bookSort) {
case "title-asc":
return a.title.localeCompare(b.title)
case "title-desc":
return b.title.localeCompare(a.title)
case "year-new":
return (b.publishedYear ?? 0) - (a.publishedYear ?? 0)
case "year-old":
return (a.publishedYear ?? 0) - (b.publishedYear ?? 0)
case "recent":
default: {
const fallbackA = a.publishedYear || a.id || 0
const fallbackB = b.publishedYear || b.id || 0
return fallbackB - fallbackA
}
}
})
}, [bookCategoryFilter, books, bookSort, bookYearFilter, normalizedSearch])

const filteredAuthors = useMemo(() => {
const search = normalizedSearch
return authors
.filter((author) => {
if (search.length === 0) {
return true
}
return author.name.toLowerCase().includes(search) || matchesSearch(author.bio, search)
})
.sort((a, b) => {
switch (authorSort) {
case "books-desc":
return (authorBookCount.get(b.id ?? 0) ?? 0) - (authorBookCount.get(a.id ?? 0) ?? 0)
case "birth-new":
return (b.birthYear ?? 0) - (a.birthYear ?? 0)
case "birth-old":
return (a.birthYear ?? 0) - (b.birthYear ?? 0)
case "alphabetical":
default:
return a.name.localeCompare(b.name)
}
})
}, [authorBookCount, authorSort, authors, normalizedSearch])

const handlePreviewBook = (book: Book) => {
setPreviewBook(book)
}

return (
<div className="min-h-screen bg-cream text-charcoal">
{toast && (
<div className="pointer-events-none fixed right-6 top-6 z-50 animate-fade-in">
<div
className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm shadow-soft ${
toast.tone === "success"
? "border-success-soft bg-success-soft text-success"
: toast.tone === "warning"
? "border-warning-soft bg-warning-soft text-warning"
: "border-info-soft bg-info-soft text-info"
}`}
>
{toast.tone === "success" ? (
<CheckCircle2 className="h-4 w-4" aria-hidden="true" />
) : (
<AlertCircle className="h-4 w-4" aria-hidden="true" />
)}
<span className="font-medium">{toast.message}</span>
</div>
</div>
)}

<header className="relative border-b border-shadow-light">
<div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
<div className="flex flex-wrap items-center justify-between gap-8">
<div className="flex items-center gap-4">
<span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest text-white shadow-soft">
<BookOpen className="h-7 w-7" aria-hidden="true" />
</span>
<div className="space-y-2">
<p className="text-xs font-semibold uppercase tracking-[0.3em] text-soft-gray">
Curated collection
</p>
<h1 className="text-4xl font-semibold text-rich-black">Books & Authors Library</h1>
<p className="max-w-xl text-sm text-soft-gray">
The ultimate self-improvement reading list, carefully curated to inspire and educate.
</p>
</div>
</div>
<div className="flex flex-col items-end gap-2 text-right text-[0.75rem] text-soft-gray">
<span className="font-semibold uppercase tracking-[0.3em] text-forest">
Offline-first dataset
</span>
<span>
Loaded from <code className="rounded bg-forest-soft px-1.5 py-0.5 text-forest">books_data.json</code>
</span>
</div>
</div>
</div>
</header>

<NavigationTabs
activeTab={activeTab}
onTabChange={handleTabChange}
tabs={[
	{ id: "books", label: "Books", count: books.length },
	{ id: "authors", label: "Authors", count: authors.length },
	{ id: "create", label: "Add", count: null },
]}
rightSlot={
	<SearchBar
		searchTerm={searchTerm}
		onSearchChange={setSearchTerm}
		className="md:min-w-[18rem] md:max-w-xs"
	/>
}
/>

<main className="mx-auto w-full max-w-6xl space-y-12 px-6 py-12">
<StatsRibbon books={books} authors={authors} />

{activeTab === "books" && (
<>
<BookToolbar
sortOption={bookSort}
onSortChange={setBookSort}
yearFilter={bookYearFilter}
onYearFilterChange={setBookYearFilter}
categoryFilter={bookCategoryFilter}
onCategoryFilterChange={setBookCategoryFilter}
categoryOptions={availableCategories}
actions={
<button
type="button"
onClick={() => handleTabChange("create")}
className="btn-secondary h-11 px-5"
>
Add book
</button>
}
/>

{filteredBooks.length > 0 ? (
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
{filteredBooks.map((book) => (
<BookCard
key={book.id ?? `${book.title}-${book.isbn}`}
book={book}
onPreview={handlePreviewBook}
/>
))}
</div>
) : (
<div className="col-span-full rounded-2xl border border-shadow-muted bg-white px-10 py-14 text-center shadow-soft">
<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-forest-soft text-forest">
<BookOpen className="h-8 w-8" aria-hidden="true" />
</div>
<h3 className="mb-2 text-2xl font-semibold text-rich-black">No books found</h3>
<p className="mx-auto max-w-md text-sm text-soft-gray">
Try a different search phrase or adjust the era filter to explore the full collection.
</p>
</div>
)}
</>
)}

{activeTab === "authors" && (
<>
<AuthorToolbar
sortOption={authorSort}
onSortChange={setAuthorSort}
actions={
<button
type="button"
onClick={() => handleTabChange("create")}
className="btn-secondary h-11 px-5"
>
Add author
</button>
}
/>

{filteredAuthors.length > 0 ? (
<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
{filteredAuthors.map((author) => (
<AuthorCard
key={author.id ?? author.name}
author={author}
bookCount={authorBookCount.get(author.id ?? 0) ?? 0}
/>
))}
</div>
) : (
<div className="col-span-full rounded-2xl border border-shadow-muted bg-white px-10 py-14 text-center shadow-soft">
<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-forest-soft text-forest">
<BookOpen className="h-8 w-8" aria-hidden="true" />
</div>
<h3 className="mb-2 text-2xl font-semibold text-rich-black">No authors found</h3>
<p className="mx-auto max-w-md text-sm text-soft-gray">
Refine your search to discover every writer represented in this dataset.
</p>
</div>
)}
</>
)}

{activeTab === "create" && (
<section className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
<div className="space-y-8">
<div className="surface-panel animate-float-in space-y-6 p-8">
<header className="space-y-2">
<p className="text-xs font-semibold uppercase tracking-[0.35em] text-soft-gray">
Quick add
</p>
<h2 className="text-2xl font-semibold text-rich-black">Drop in an ISBN</h2>
<p className="text-sm text-soft-gray">
Let Google Books prefill the essentials, then refine the record before saving.
</p>
</header>

<QuickIsbnAdd onResolve={handleQuickIsbnResolve} variant="embedded" className="w-full" />
</div>

<AddBookForm
authors={authors}
onSubmit={handleManualBookSubmit}
className="max-w-none lg:mx-0"
/>
</div>

<AddAuthorForm
onSubmit={handleAuthorSubmit}
className="max-w-none lg:mx-0 lg:sticky lg:top-32"
/>
</section>
)}

<BookDetailsModal book={previewBook} onClose={() => setPreviewBook(null)} />
</main>
</div>
)
}

export default App
