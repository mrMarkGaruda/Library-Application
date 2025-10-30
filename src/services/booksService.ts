import type { Book } from "../types/Book"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const defaultHeaders: HeadersInit = {
	"Content-Type": "application/json",
}

const handleResponse = async <T>(response: Response): Promise<T> => {
	if (!response.ok) {
		throw new Error(`Failed request: ${response.status} ${response.statusText}`)
	}

	return response.json() as Promise<T>
}

export const booksService = {
	getAllBooks: async (): Promise<Book[]> => {
		const response = await fetch(`${API_BASE_URL}/books`, {
			method: "GET",
			headers: defaultHeaders,
		})

		return handleResponse<Book[]>(response)
	},

	getBookById: async (id: number): Promise<Book> => {
		const response = await fetch(`${API_BASE_URL}/books/${id}`, {
			method: "GET",
			headers: defaultHeaders,
		})

		return handleResponse<Book>(response)
	},

	createBook: async (book: Omit<Book, "id">): Promise<Book> => {
		const response = await fetch(`${API_BASE_URL}/books`, {
			method: "POST",
			headers: defaultHeaders,
			body: JSON.stringify(book),
		})

		return handleResponse<Book>(response)
	},

	updateBook: async (id: number, book: Omit<Book, "id">): Promise<Book> => {
		const response = await fetch(`${API_BASE_URL}/books/${id}`, {
			method: "PUT",
			headers: defaultHeaders,
			body: JSON.stringify(book),
		})

		return handleResponse<Book>(response)
	},

	deleteBook: async (id: number): Promise<void> => {
		const response = await fetch(`${API_BASE_URL}/books/${id}`, {
			method: "DELETE",
			headers: defaultHeaders,
		})

		if (!response.ok) {
			throw new Error(`Failed request: ${response.status} ${response.statusText}`)
		}
	},
}
