import { authorsService } from "./authorsService"
import { booksService } from "./booksService"
import { libraryStore } from "../utils/localLibraryStore"
import { staticAuthors, staticBooks } from "../mockData/staticData"
import { serverAuthors, serverBooks } from "../data/serverSeedCsv"
import type { Author } from "../types/Author"
import type { Book } from "../types/Book"

const cloneAuthors = (authors: Author[]): Author[] => authors.map((author) => ({ ...author }))
const cloneBooks = (books: Book[]): Book[] => books.map((book) => ({ ...book }))

export type SeedSource = "static" | "server"

const DEFAULT_SEED: SeedSource = "static"

const seedCatalogs: Record<SeedSource, { authors: Author[]; books: Book[] }> = {
	static: {
		authors: staticAuthors,
		books: staticBooks,
	},
	server: {
		authors: serverAuthors,
		books: serverBooks,
	},
}

const isSeedSource = (value: unknown): value is SeedSource => value === "static" || value === "server"

const loadSeedFromStore = (): SeedSource => {
	const stored = libraryStore.getSeedSource()
	if (isSeedSource(stored)) {
		return stored
	}
	return DEFAULT_SEED
}

let activeSeed: SeedSource = loadSeedFromStore()

const setActiveSeed = (seed: SeedSource) => {
	activeSeed = seed
	libraryStore.setSeedSource(seed)
}

const ensureSeedConsistency = () => {
	setActiveSeed(loadSeedFromStore())
}

const latencyRange = { min: 140, max: 320 }
const randomLatency = () =>
	Math.floor(
		latencyRange.min + Math.random() * (latencyRange.max - latencyRange.min)
	)

const wait = (duration: number) =>
	new Promise((resolve) => {
		setTimeout(resolve, duration)
	})

const ensureSeededLibrary = () => {
	ensureSeedConsistency()
	if (libraryStore.hasPersistedData()) {
		return
	}
	const dataset = seedCatalogs[activeSeed]
	const authors = cloneAuthors(dataset.authors)
	const books = cloneBooks(dataset.books)
	libraryStore.saveAll(authors, books)
}

const readLocalAuthors = () =>
	cloneAuthors(libraryStore.loadAuthors() ?? seedCatalogs[activeSeed].authors)

const readLocalBooks = () =>
	cloneBooks(libraryStore.loadBooks() ?? seedCatalogs[activeSeed].books)

const getNextAuthorId = (authors: Author[]) =>
	authors.reduce((acc, author) => Math.max(acc, author.id ?? 0), 0) + 1

const getNextBookId = (books: Book[]) =>
	books.reduce((acc, book) => Math.max(acc, book.id ?? 0), 0) + 1

export type GatewayMeta = {
	timestamp: number
	latency: number
	fallbackUsed: boolean
}

export type SnapshotResult = {
	authors: Author[]
	books: Book[]
	meta: GatewayMeta
}

export type OperationResult<T> = SnapshotResult & {
	entity: T
}

const attemptRemote = async <T>(operation: () => Promise<T>, fallback: () => T): Promise<{ data: T; meta: GatewayMeta }> => {
	const latency = randomLatency()
	const timestamp = Date.now()

	// The server seed is a bundled dataset; avoid remote calls to keep it authoritative.
	if (activeSeed === "server") {
		await wait(latency)
		return {
			data: fallback(),
			meta: {
				timestamp,
				latency,
				fallbackUsed: false,
			},
		}
	}

	try {
		const data = await operation()
		await wait(latency)
		return {
			data,
			meta: {
				timestamp,
				latency,
				fallbackUsed: false,
			},
		}
	} catch (error) {
		console.debug("Falling back to cached library data", error)
		await wait(latency)
		return {
			data: fallback(),
			meta: {
				timestamp,
				latency,
				fallbackUsed: true,
			},
		}
	}
}

export const libraryGateway = {
	initialize: () => {
		ensureSeededLibrary()
	},

	syncSnapshot: async (): Promise<SnapshotResult> => {
		ensureSeededLibrary()

		const authorsFallback = () => cloneAuthors(readLocalAuthors())
		const booksFallback = () => cloneBooks(readLocalBooks())

		const [authorsResponse, booksResponse] = await Promise.all([
			attemptRemote(() => authorsService.getAllAuthors(), authorsFallback),
			attemptRemote(() => booksService.getAllBooks(), booksFallback),
		])

		const authors = cloneAuthors(authorsResponse.data)
		const books = cloneBooks(booksResponse.data)

		libraryStore.saveAll(authors, books)

		return {
			authors,
			books,
			meta: {
				timestamp: Date.now(),
				latency: Math.max(authorsResponse.meta.latency, booksResponse.meta.latency),
				fallbackUsed: authorsResponse.meta.fallbackUsed || booksResponse.meta.fallbackUsed,
			},
		}
	},

	getSeedSource: (): SeedSource => {
		ensureSeedConsistency()
		return activeSeed
	},

	createAuthor: async (author: Omit<Author, "id">): Promise<OperationResult<Author>> => {
		ensureSeededLibrary()
		const authors = readLocalAuthors()
		const books = readLocalBooks()
		const nextId = getNextAuthorId(authors)
		const draftAuthor: Author = { ...author, id: nextId }
		const optimisticAuthors = [...authors, draftAuthor]
		libraryStore.saveAuthors(optimisticAuthors)

		const result = await attemptRemote(
			async () => {
				const persisted = await authorsService.createAuthor(author)
				const normalized: Author = {
					...persisted,
					id: persisted.id ?? draftAuthor.id,
				}
				const reconciled = optimisticAuthors.map((existing) =>
					existing.id === draftAuthor.id ? normalized : existing
				)
				libraryStore.saveAuthors(reconciled)
				return normalized
			},
			() => draftAuthor
		)

		const nextAuthors = cloneAuthors(libraryStore.loadAuthors() ?? optimisticAuthors)
		const nextBooks = cloneBooks(libraryStore.loadBooks() ?? books)
		return {
			authors: nextAuthors,
			books: nextBooks,
			entity: result.data,
			meta: result.meta,
		}
	},

	updateAuthor: async (author: Author): Promise<OperationResult<Author>> => {
		ensureSeededLibrary()
		const authors = readLocalAuthors()
		const books = readLocalBooks()

		const optimisticAuthors = authors.map((existing) =>
			existing.id === author.id ? { ...existing, ...author } : existing
		)
		libraryStore.saveAuthors(optimisticAuthors)

		const result = await attemptRemote(
			async () => {
				if (author.id == null) {
					return author
				}
				const payload = { ...author }
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { id, ...rest } = payload
				const persisted = await authorsService.updateAuthor(author.id, rest)
				const normalized: Author = {
					...persisted,
					id: persisted.id ?? author.id,
				}
				const reconciled = optimisticAuthors.map((existing) =>
					existing.id === author.id ? normalized : existing
				)
				libraryStore.saveAuthors(reconciled)
				return normalized
			},
			() => author
		)

		const nextAuthors = cloneAuthors(libraryStore.loadAuthors() ?? optimisticAuthors)
		const nextBooks = cloneBooks(libraryStore.loadBooks() ?? books)
		return {
			authors: nextAuthors,
			books: nextBooks,
			entity: result.data,
			meta: result.meta,
		}
	},

	deleteAuthor: async (author: Author): Promise<SnapshotResult> => {
		ensureSeededLibrary()
		const authors = readLocalAuthors()
		const books = readLocalBooks()

		const remainingAuthors = authors.filter((existing) => existing.id !== author.id)
		const remainingBooks = books.filter((book) => book.authorId !== author.id)
		libraryStore.saveAll(remainingAuthors, remainingBooks)

		const deletionMeta = await attemptRemote(
			async () => {
				if (author.id != null) {
					await authorsService.deleteAuthor(author.id)
				}
				return null
			},
			() => null
		)

		const syncedAuthors = cloneAuthors(libraryStore.loadAuthors() ?? remainingAuthors)
		const syncedBooks = cloneBooks(libraryStore.loadBooks() ?? remainingBooks)
		return {
			authors: syncedAuthors,
			books: syncedBooks,
			meta: {
				timestamp: deletionMeta.meta.timestamp,
				latency: deletionMeta.meta.latency,
				fallbackUsed: deletionMeta.meta.fallbackUsed,
			},
		}
	},

	createBook: async (book: Omit<Book, "id">): Promise<OperationResult<Book>> => {
		ensureSeededLibrary()
		const authors = readLocalAuthors()
		const books = readLocalBooks()
		const nextId = getNextBookId(books)
		const draftBook: Book = { ...book, id: nextId }
		const optimisticBooks = [...books, draftBook]
		libraryStore.saveBooks(optimisticBooks)

		const result = await attemptRemote(
			async () => {
				const payload = { ...book }
				const persisted = await booksService.createBook(payload)
				const normalized: Book = {
					...persisted,
					id: persisted.id ?? draftBook.id,
				}
				const reconciled = optimisticBooks.map((existing) =>
					existing.id === draftBook.id ? normalized : existing
				)
				libraryStore.saveBooks(reconciled)
				return normalized
			},
			() => draftBook
		)

		const nextBooks = cloneBooks(libraryStore.loadBooks() ?? optimisticBooks)
		const nextAuthors = cloneAuthors(libraryStore.loadAuthors() ?? authors)
		return {
			authors: nextAuthors,
			books: nextBooks,
			entity: result.data,
			meta: result.meta,
		}
	},

	updateBook: async (book: Book): Promise<OperationResult<Book>> => {
		ensureSeededLibrary()
		const authors = readLocalAuthors()
		const books = readLocalBooks()

		const optimisticBooks = books.map((existing) =>
			existing.id === book.id ? { ...existing, ...book } : existing
		)
		libraryStore.saveBooks(optimisticBooks)

		const result = await attemptRemote(
			async () => {
				if (book.id == null) {
					return book
				}
				const payload = { ...book }
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { id, ...rest } = payload
				const persisted = await booksService.updateBook(book.id, rest)
				const normalized: Book = {
					...persisted,
					id: persisted.id ?? book.id,
				}
				const reconciled = optimisticBooks.map((existing) =>
					existing.id === book.id ? normalized : existing
				)
				libraryStore.saveBooks(reconciled)
				return normalized
			},
			() => book
		)

		const nextBooks = cloneBooks(libraryStore.loadBooks() ?? optimisticBooks)
		const nextAuthors = cloneAuthors(libraryStore.loadAuthors() ?? authors)
		return {
			authors: nextAuthors,
			books: nextBooks,
			entity: result.data,
			meta: result.meta,
		}
	},

	deleteBook: async (book: Book): Promise<SnapshotResult> => {
		ensureSeededLibrary()
		const authors = readLocalAuthors()
		const books = readLocalBooks()

		const remainingBooks = books.filter((existing) => existing.id !== book.id)
		libraryStore.saveBooks(remainingBooks)

		const deletionMeta = await attemptRemote(
			async () => {
				if (book.id != null) {
					await booksService.deleteBook(book.id)
				}
				return null
			},
			() => null
		)

		const syncedAuthors = cloneAuthors(libraryStore.loadAuthors() ?? authors)
		const syncedBooks = cloneBooks(libraryStore.loadBooks() ?? remainingBooks)
		return {
			authors: syncedAuthors,
			books: syncedBooks,
			meta: {
				timestamp: deletionMeta.meta.timestamp,
				latency: deletionMeta.meta.latency,
				fallbackUsed: deletionMeta.meta.fallbackUsed,
			},
		}
	},

	resetDemoData: async (seed: SeedSource = DEFAULT_SEED): Promise<SnapshotResult> => {
		setActiveSeed(seed)
		libraryStore.clear()
		const dataset = seedCatalogs[seed]
		const authors = cloneAuthors(dataset.authors)
		const books = cloneBooks(dataset.books)
		libraryStore.saveAll(authors, books)

		const { meta } = await attemptRemote(
			async () => {
				await Promise.resolve()
				return null
			},
			() => null
		)

		return {
			authors,
			books,
			meta,
		}
	},
}
