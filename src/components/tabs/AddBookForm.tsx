import { useEffect, useRef, useState, type FormEvent } from "react"
import type { Author } from "../../types/Author"
import type { Book } from "../../types/Book"
import { searchBooksByTitle } from "../../services/googleBooksService"
import BookSearchResults from "../BookSearchResults"


interface AddBookFormProps {
	authors: Author[]
	onSubmit: (book: Book) => Promise<void> | void
	onCancel?: () => void
	onSuccess?: () => void
initialValues?: Book
mode?: "create" | "edit"
}

const defaultBookValues = (): Book => ({
	title: "",
	authorId: 0,
	isbn: "",
	publishedYear: new Date().getFullYear(),
	description: "",
	coverUrl: "",
})

const AddBookForm = ({
	authors,
	onSubmit,
	onCancel,
	onSuccess,
	initialValues,
	mode = "create",
}: AddBookFormProps) => {
	const [formData, setFormData] = useState<Book>(
		initialValues ?? defaultBookValues()
	)

	const [errors, setErrors] = useState<Partial<Record<keyof Book, string>>>({})
	const [submissionError, setSubmissionError] = useState<string | null>(null)
	const [searchResults, setSearchResults] = useState<Book[]>([])
	const [isSearching, setIsSearching] = useState(false)
	const [isbnNotFound, setIsbnNotFound] = useState(false)
	const searchRequestIdRef = useRef(0)
const skipInitialSearchRef = useRef(mode === "edit")

	useEffect(() => {
		if (initialValues) {
			setFormData(initialValues)
			skipInitialSearchRef.current = true
			setSearchResults([])
		}
	}, [initialValues])

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]:
				name === "authorId" || name === "publishedYear"
					? parseInt(value) || 0
					: value,
		}))
		// Clear error when user starts typing
		if (errors[name as keyof Book]) {
			setErrors((prev) => ({ ...prev, [name]: "" }))
		}

		if (name === "isbn") {
			setIsbnNotFound(false)
		}
	}

	useEffect(() => {
		const trimmedTitle = formData.title.trim()

		if (trimmedTitle.length < 3) {
			searchRequestIdRef.current += 1
			setSearchResults([])
			setIsSearching(false)
			setIsbnNotFound(false)
			return
		}

		if (skipInitialSearchRef.current) {
			skipInitialSearchRef.current = false
			return
		}

		const requestId = ++searchRequestIdRef.current
		setIsSearching(true)

		const timeoutId = window.setTimeout(async () => {
			try {
				const results = await searchBooksByTitle(trimmedTitle)

				if (searchRequestIdRef.current === requestId) {
					setSearchResults(results)
					setIsbnNotFound(results.length > 0 && results.every((book) => !book.isbn))
				}
			} catch (error) {
				if (searchRequestIdRef.current === requestId) {
					console.error("Error searching books:", error)
					setSearchResults([])
				}
			} finally {
				if (searchRequestIdRef.current === requestId) {
					setIsSearching(false)
				}
			}
		}, 350)

		return () => {
			window.clearTimeout(timeoutId)
		}
	}, [formData.title])

	const handleSelectGoogleBook = (book: Book) => {
		const sanitizedCoverUrl = book.coverUrl.startsWith("http://")
			? book.coverUrl.replace("http://", "https://")
			: book.coverUrl

		const yearFromBook = book.publishedDate
			? Number.parseInt(book.publishedDate.substring(0, 4), 10)
			: Number.NaN

		const matchedAuthor = book.author
			? authors.find(
					(author) => author.name.toLowerCase() === book.author?.toLowerCase()
				)
			: undefined

		setFormData((prev) => ({
			...prev,
			title: book.title || prev.title,
			description: book.description || prev.description,
			coverUrl: sanitizedCoverUrl || prev.coverUrl,
			publishedYear: Number.isFinite(yearFromBook) ? yearFromBook : prev.publishedYear,
			isbn: book.isbn || prev.isbn,
			authorId: matchedAuthor?.id ?? prev.authorId,
		}))

		setErrors((prev) => {
			const next = { ...prev }
			if (book.isbn) {
				delete next.isbn
			}
			if (matchedAuthor?.id) {
				delete next.authorId
			}
			return next
		})

		if (!matchedAuthor && book.author) {
			setErrors((prev) => ({
				...prev,
				authorId: "No matching author found locally. Please select one.",
			}))
		}

		setSearchResults([])
		setIsbnNotFound(!book.isbn)
	}

	const handleClearSearchResults = () => {
		searchRequestIdRef.current += 1
		setSearchResults([])
		setIsSearching(false)
		setIsbnNotFound(false)
	}

	const validate = (): boolean => {
		const newErrors: Partial<Record<keyof Book, string>> = {}

		if (!formData.title.trim()) {
			newErrors.title = "Title is required"
		}

		if (!formData.authorId || formData.authorId === 0) {
			newErrors.authorId = "Please select an author"
		}

		if (!formData.isbn.trim()) {
			newErrors.isbn = "ISBN is required"
		} else if (!/^[0-9-]+$/.test(formData.isbn)) {
			newErrors.isbn = "ISBN should only contain numbers and hyphens"
		}

		if (isbnNotFound) {
			newErrors.isbn = "Provide an ISBN when the Google Books result does not include one"
		}

		if (
			!formData.publishedYear ||
			formData.publishedYear < 1000 ||
			formData.publishedYear > new Date().getFullYear()
		) {
			newErrors.publishedYear = "Please enter a valid publication year"
		}

		if (!formData.description.trim()) {
			newErrors.description = "Description is required"
		}

		if (!formData.coverUrl.trim()) {
			newErrors.coverUrl = "Cover URL is required"
		} else if (!/^https?:\/\/.+/.test(formData.coverUrl)) {
			newErrors.coverUrl =
				"Please enter a valid URL (starting with http:// or https://)"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!validate()) {
			return
		}

		try {
			await Promise.resolve(onSubmit(formData))
			setSubmissionError(null)
			if (mode === "create") {
				setFormData(defaultBookValues())
			}
			setErrors({})
			onSuccess?.()
		} catch (error) {
			console.error("Failed to submit book:", error)
			setSubmissionError(
				error instanceof Error
					? error.message
					: "Unable to save book. Please try again."
			)
		}
	}

	const heading = mode === "edit" ? "Edit Book" : "Add New Book"
	const submitLabel = mode === "edit" ? "Save Changes" : "Add Book"

	return (
		<section className="mx-auto max-w-2xl rounded-3xl bg-white p-10 shadow-soft">
			<header className="mb-8 space-y-2">
				<p className="text-xs font-semibold uppercase tracking-[0.35em] text-soft-gray">
					Book details
				</p>
				<h2 className="text-3xl font-semibold text-rich-black">{heading}</h2>
				<p className="text-sm text-soft-gray">
					Search Google Books to speed things up, then polish the details to fit your library.
				</p>
			</header>

			{submissionError && (
				<div className="mb-6 rounded-xl border border-error-soft bg-error-soft px-4 py-3 text-sm text-error">
					{submissionError}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Title Input */}
				<div>
					<label htmlFor="title" className="input-label">
						Title *
					</label>
					<input
						type="text"
						id="title"
						name="title"
						value={formData.title}
						onChange={handleChange}
						className="form-field"
						aria-invalid={errors.title ? "true" : "false"}
						placeholder="Enter book title"
					/>
					{errors.title && (
						<p className="mt-2 text-xs font-medium text-error">{errors.title}</p>
					)}
				</div>

				<BookSearchResults
					searchResults={searchResults}
					authors={authors}
					isSearching={isSearching}
					onSelectBook={handleSelectGoogleBook}
					onClearResults={handleClearSearchResults}
				/>

				{/* Author Select */}
				<div>
					<label htmlFor="authorId" className="input-label">
						Author *
					</label>
					<select
						id="authorId"
						name="authorId"
						value={formData.authorId}
						onChange={handleChange}
						className="form-field"
						aria-invalid={errors.authorId ? "true" : "false"}
					>
						<option value={0}>Select an author</option>
						{authors.map((author) => (
							<option key={author.id} value={author.id}>
								{author.name}
							</option>
						))}
					</select>
					{errors.authorId && (
						<p className="mt-2 text-xs font-medium text-error">{errors.authorId}</p>
					)}
				</div>

				{/* ISBN and Published Year in a grid */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{/* ISBN Input */}
					<div>
						<label htmlFor="isbn" className="input-label">
							ISBN *
						</label>
						<input
							type="text"
							id="isbn"
							name="isbn"
							value={formData.isbn}
							onChange={handleChange}
							className="form-field"
							aria-invalid={errors.isbn ? "true" : "false"}
							placeholder="e.g., 978-0-123456-78-9"
						/>
						{errors.isbn && (
							<p className="mt-2 text-xs font-medium text-error">{errors.isbn}</p>
						)}
						{isbnNotFound && !errors.isbn && (
							<p className="mt-2 text-xs font-medium text-warning">
								The selected Google Books result did not include an ISBN. Provide one manually before saving.
							</p>
						)}
					</div>

					{/* Published Year Input */}
					<div>
						<label htmlFor="publishedYear" className="input-label">
							Published Year *
						</label>
						<input
							type="number"
							id="publishedYear"
							name="publishedYear"
							value={formData.publishedYear}
							onChange={handleChange}
							min="1000"
							max={new Date().getFullYear()}
							className="form-field"
							aria-invalid={errors.publishedYear ? "true" : "false"}
							placeholder="e.g., 2023"
						/>
						{errors.publishedYear && (
							<p className="mt-2 text-xs font-medium text-error">
								{errors.publishedYear}
							</p>
						)}
					</div>
				</div>

				{/* Description Input */}
				<div>
					<label htmlFor="description" className="input-label">
						Description *
					</label>
					<textarea
						id="description"
						name="description"
						value={formData.description}
						onChange={handleChange}
						rows={4}
						className="form-field resize-none"
						aria-invalid={errors.description ? "true" : "false"}
						placeholder="Enter a brief description of the book"
					/>
					{errors.description && (
						<p className="mt-2 text-xs font-medium text-error">{errors.description}</p>
					)}
				</div>

				{/* Cover URL Input */}
				<div>
					<label htmlFor="coverUrl" className="input-label">
						Cover Image URL *
					</label>
					<input
						type="url"
						id="coverUrl"
						name="coverUrl"
						value={formData.coverUrl}
						onChange={handleChange}
						className="form-field"
						aria-invalid={errors.coverUrl ? "true" : "false"}
						placeholder="https://example.com/cover.jpg"
					/>
					{errors.coverUrl && (
						<p className="mt-2 text-xs font-medium text-error">{errors.coverUrl}</p>
					)}
					{formData.coverUrl && !errors.coverUrl && (
						<div className="mt-2">
							<p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-soft-gray">
								Preview
							</p>
							<img
								src={formData.coverUrl}
								alt="Book cover preview"
								className="h-36 w-28 rounded-lg border border-shadow-light object-cover"
								onError={(e) => {
									e.currentTarget.style.display = "none"
								}}
							/>
						</div>
					)}
				</div>

				{/* Form Actions */}
				<div className="flex flex-col gap-3 pt-6 sm:flex-row">
					<button
						type="submit"
						className="btn-primary flex-1"
					>
						{submitLabel}
					</button>
					{onCancel && (
						<button
							type="button"
							onClick={onCancel}
							className="btn-secondary flex-1"
						>
							Cancel
						</button>
					)}
				</div>
			</form>
		</section>
	)
}

export default AddBookForm
