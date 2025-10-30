import { libraryAuthors, libraryBooks } from "../data/libraryData"
import type { Author } from "../types/Author"
import type { Book } from "../types/Book"

export const staticAuthors: Author[] = libraryAuthors.map((author) => ({ ...author }))
export const staticBooks: Book[] = libraryBooks.map((book) => ({ ...book }))