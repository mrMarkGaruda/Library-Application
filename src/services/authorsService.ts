import type { Author } from "../types/Author"

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

export const authorsService = {
	getAllAuthors: async (): Promise<Author[]> => {
		const response = await fetch(`${API_BASE_URL}/authors`, {
			method: "GET",
			headers: defaultHeaders,
		})

		return handleResponse<Author[]>(response)
	},

	getAuthorById: async (id: number): Promise<Author> => {
		const response = await fetch(`${API_BASE_URL}/authors/${id}`, {
			method: "GET",
			headers: defaultHeaders,
		})

		return handleResponse<Author>(response)
	},

	createAuthor: async (author: Omit<Author, "id">): Promise<Author> => {
		const response = await fetch(`${API_BASE_URL}/authors`, {
			method: "POST",
			headers: defaultHeaders,
			body: JSON.stringify(author),
		})

		return handleResponse<Author>(response)
	},

	updateAuthor: async (id: number, author: Omit<Author, "id">): Promise<Author> => {
		const response = await fetch(`${API_BASE_URL}/authors/${id}`, {
			method: "PUT",
			headers: defaultHeaders,
			body: JSON.stringify(author),
		})

		return handleResponse<Author>(response)
	},

	deleteAuthor: async (id: number): Promise<void> => {
		const response = await fetch(`${API_BASE_URL}/authors/${id}`, {
			method: "DELETE",
			headers: defaultHeaders,
		})

		if (!response.ok) {
			throw new Error(`Failed request: ${response.status} ${response.statusText}`)
		}
	},
}
