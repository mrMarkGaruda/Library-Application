import type { Book } from "../types/Book"
import { staticBooks } from "../mockData/staticData"

const MOCK_LATENCY_MS = 500

const withLatency = <T>(value: T): Promise<T> =>
	new Promise((resolve) => {
		setTimeout(() => resolve(value), MOCK_LATENCY_MS)
	})

export const booksService = {
	getAllBooks: async (): Promise<Book[]> => {
		return withLatency(staticBooks.map((book: Book) => ({ ...book })))
	},

	getBookById: async (id: number): Promise<Book> => {
		const found = staticBooks.find((book: Book) => book.id === id)
		if (!found) {
			throw new Error("Book not found")
		}
		return withLatency({ ...found })
	},

	createBook: async () => {
		throw new Error("Book creation is unavailable in offline mode")
	},

	updateBook: async () => {
		throw new Error("Book updates are unavailable in offline mode")
	},

	deleteBook: async () => {
		throw new Error("Book deletion is unavailable in offline mode")
	},
}
