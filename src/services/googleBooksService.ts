import type { Book } from "../types/Book"
import type { GoogleBookItem, GoogleBookResponse } from "../types/GoogleBook"

const GOOGLE_BOOKS_API = import.meta.env.VITE_GOOGLE_BOOKS_API

const transformGoogleBook = (item: GoogleBookItem): Book => {
	const volumeInfo = item.volumeInfo

	const isbn13 = volumeInfo.industryIdentifiers?.find(
		(identifier) => identifier.type === "ISBN_13"
	)
	const isbn10 = volumeInfo.industryIdentifiers?.find(
		(identifier) => identifier.type === "ISBN_10"
	)
	const isbn = isbn13?.identifier || isbn10?.identifier || ""

	return {
		id: 0,
		title: volumeInfo.title || "",
		authorId: 0,
		isbn,
		publishedYear: volumeInfo.publishedDate
			? parseInt(volumeInfo.publishedDate.substring(0, 4)) || 0
			: 0,
		description: volumeInfo.description || "",
		coverUrl: volumeInfo.imageLinks?.thumbnail || "",
		thumbnail: volumeInfo.imageLinks?.thumbnail,
		publishedDate: volumeInfo.publishedDate,
		author: volumeInfo.authors?.[0] || "Unknown Author",
	}
}

export const searchBooksByTitle = async (title: string): Promise<Book[]> => {
	try {
		const params = new URLSearchParams({
			q: `intitle:${title}`,
			country: "US",
			maxResults: "40",
		})

		const response = await fetch(`${GOOGLE_BOOKS_API}?${params.toString()}`)

		if (!response.ok) {
			throw new Error(`API request failed with status ${response.status}`)
		}

		const data: GoogleBookResponse = await response.json()

		if (!data.items || data.items.length === 0) {
			return []
		}

		return data.items.map(transformGoogleBook)
	} catch (error) {
		console.error("Error fetching books from Google Books API:", error)
		return []
	}
}
