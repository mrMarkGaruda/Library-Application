import type { Author } from "../types/Author"
import type { Book } from "../types/Book"

const AUTHORS_KEY = "library_app_authors"
const BOOKS_KEY = "library_app_books"
const SEED_KEY = "library_app_seed_source"

const isBrowser = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined"

const readJson = <T>(key: string): T | null => {
	if (!isBrowser()) {
		return null
	}

	try {
		const raw = window.localStorage.getItem(key)
		if (!raw) {
			return null
		}

		return JSON.parse(raw) as T
	} catch (error) {
		console.warn(`Failed to read ${key} from localStorage`, error)
		return null
	}
}

const writeJson = <T>(key: string, value: T) => {
	if (!isBrowser()) {
		return
	}

	try {
		window.localStorage.setItem(key, JSON.stringify(value))
	} catch (error) {
		console.warn(`Failed to write ${key} to localStorage`, error)
	}
}

const readString = (key: string): string | null => {
	if (!isBrowser()) {
		return null
	}

	try {
		return window.localStorage.getItem(key)
	} catch (error) {
		console.warn(`Failed to read ${key} from localStorage`, error)
		return null
	}
}

const writeString = (key: string, value: string) => {
	if (!isBrowser()) {
		return
	}

	try {
		window.localStorage.setItem(key, value)
	} catch (error) {
		console.warn(`Failed to write ${key} to localStorage`, error)
	}
}

export const libraryStore = {
	loadAuthors: (): Author[] | null => readJson<Author[]>(AUTHORS_KEY),
	loadBooks: (): Book[] | null => readJson<Book[]>(BOOKS_KEY),
	saveAuthors: (authors: Author[]) => writeJson(AUTHORS_KEY, authors),
	saveBooks: (books: Book[]) => writeJson(BOOKS_KEY, books),
	saveAll: (authors: Author[], books: Book[]) => {
		writeJson(AUTHORS_KEY, authors)
		writeJson(BOOKS_KEY, books)
	},
	getSeedSource: () => readString(SEED_KEY),
	setSeedSource: (seedSource: string) => writeString(SEED_KEY, seedSource),
	hasPersistedData: () => {
		const authors = libraryStore.loadAuthors()
		const books = libraryStore.loadBooks()
		return Boolean(authors?.length) && Boolean(books?.length)
	},
	clear: () => {
		if (!isBrowser()) {
			return
		}
		window.localStorage.removeItem(AUTHORS_KEY)
		window.localStorage.removeItem(BOOKS_KEY)
	},
}
