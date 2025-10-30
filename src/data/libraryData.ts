import booksData from "./books_data.json?raw"
import type { Author } from "../types/Author"
import type { Book } from "../types/Book"

type RawBook = {
	title: string
	subtitle?: string | null
	authors?: string[] | null
	publisher?: string | null
	publishedDate?: string | number | null
	description?: string | null
	categories?: string[] | null
	pageCount?: number | null
	language?: string | null
	previewLink?: string | null
	infoLink?: string | null
	thumbnail?: string | null
	smallThumbnail?: string | null
	isbn?: string | null
}

const UNKNOWN_AUTHOR = "Unknown author"

const parseYear = (value: RawBook["publishedDate"]): number => {
	if (typeof value === "number") {
		return value
	}
	if (!value) {
		return 0
	}
	const match = String(value).match(/\d{4}/)
	return match ? Number.parseInt(match[0] ?? "0", 10) : 0
}

const sanitizeDescription = (raw: RawBook): string => {
	const description = raw.description?.trim()
	if (description && description.length > 0) {
		return description
	}
	const subtitle = raw.subtitle?.trim()
	if (subtitle && subtitle.length > 0) {
		return subtitle
	}
	return "Description not provided."
}

const authorDirectory = new Map<string, Author>()

const ensureAuthor = (name: string | null | undefined): Author => {
	const normalizedName = (name ?? UNKNOWN_AUTHOR).trim() || UNKNOWN_AUTHOR
	const key = normalizedName.toLowerCase()
	const existing = authorDirectory.get(key)
	if (existing) {
		return existing
	}
	const nextId = authorDirectory.size + 1
	const author: Author = {
		id: nextId,
		name: normalizedName,
		bio: "",
		birthYear: 0,
		country: "",
	}
	authorDirectory.set(key, author)
	return author
}

// Ensure the placeholder author exists for orphaned entries.
ensureAuthor(UNKNOWN_AUTHOR)

const parsedBooks = JSON.parse(booksData) as RawBook[]

const books: Book[] = parsedBooks.map((raw, index) => {
	const associatedAuthors = (raw.authors?.length ? raw.authors : [UNKNOWN_AUTHOR])
		.map((authorName) => ensureAuthor(authorName))
	const authorIds = associatedAuthors.map((author) => author.id ?? 0)
	const primaryAuthorId = authorIds[0] ?? ensureAuthor(UNKNOWN_AUTHOR).id ?? 0
	const authorNames = associatedAuthors.map((author) => author.name)

	const coverUrl = raw.thumbnail ?? raw.smallThumbnail ?? ""

	return {
		id: index + 1,
		title: raw.title,
		authorId: primaryAuthorId,
		authorIds,
		authorNames,
		author: authorNames.join(", "),
		isbn: raw.isbn ?? "",
		publishedYear: parseYear(raw.publishedDate),
		description: sanitizeDescription(raw),
		coverUrl,
		thumbnail: raw.smallThumbnail ?? undefined,
		publishedDate: raw.publishedDate ? String(raw.publishedDate) : undefined,
		categories: raw.categories ?? undefined,
		pageCount: raw.pageCount ?? undefined,
		language: raw.language ?? undefined,
		previewLink: raw.previewLink ?? undefined,
		infoLink: raw.infoLink ?? undefined,
	}
})

const authors: Author[] = Array.from(authorDirectory.values()).sort((a, b) =>
	a.name.localeCompare(b.name)
)

export const libraryAuthors: Author[] = authors.map((author) => ({ ...author }))
export const libraryBooks: Book[] = books.map((book) => ({ ...book }))
