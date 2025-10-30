import type { Author } from "../types/Author"
import type { Book } from "../types/Book"

interface BookSearchResultsProps {
	searchResults: Book[]
	authors: Author[]
	isSearching: boolean
	onSelectBook: (book: Book) => void
	onClearResults: () => void
}

const hasMatchingAuthor = (
	bookAuthor: string | null | undefined,
	authors: Author[]
) => {
	if (!bookAuthor) {
		return false
	}

	return authors.some(
		(author) => author.name.toLowerCase() === bookAuthor.toLowerCase()
	)
}

const BookSearchResults = ({
	searchResults,
	authors,
	isSearching,
	onSelectBook,
	onClearResults,
}: BookSearchResultsProps) => {
	if (!isSearching && searchResults.length === 0) {
		return null
	}

	return (
		<div className="relative animate-fade-in">
			<div className="surface-panel mt-2 overflow-hidden">
				<div className="flex items-center justify-between border-b border-shadow-muted px-5 py-3">
					<h3 className="text-xs font-semibold uppercase tracking-[0.35em] text-soft-gray">
						Google Books matches
					</h3>
					<button type="button" onClick={onClearResults} className="btn-ghost h-9 px-3 text-xs">
						Clear results
					</button>
				</div>

				{isSearching ? (
					<div className="px-5 py-6 text-sm text-soft-gray">Searching Google Books…</div>
				) : searchResults.length === 0 ? (
					<div className="px-5 py-6 text-sm text-soft-gray">No books found. Try a different title.</div>
				) : (
					<ul className="max-h-96 overflow-auto scrollbar-thin">
						{searchResults.map((book, index) => {
							const matchFound = hasMatchingAuthor(book.author, authors)

							return (
								<li
									key={`${book.isbn || book.title}-${book.publishedDate || "unknown"}`}
									className={`border-b border-shadow-light ${index === searchResults.length - 1 ? "border-b-0" : ""}`}
								>
									<button
										type="button"
										onClick={() => onSelectBook(book)}
										className="search-result-button flex w-full gap-4 px-5 py-4 text-left"
									>
										<div className="flex h-20 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-shadow-muted bg-cream">
											{book.thumbnail ? (
												<img
													src={book.thumbnail}
													alt={book.title}
													className="h-full w-full object-cover"
													loading="lazy"
												/>
											) : (
												<span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-soft-gray">
													No cover
												</span>
											)}
										</div>

										<div className="flex flex-1 flex-col gap-2">
											<p className="text-sm font-semibold text-rich-black">{book.title}</p>
											<p className="text-xs text-soft-gray">
												{book.author ?? "Unknown author"}
												{book.publishedDate ? ` • ${book.publishedDate}` : ""}
											</p>
											<div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-charcoal-muted">
												<span>
													ISBN:
													{book.isbn ? (
														<span className="ml-1 text-rich-black">{book.isbn}</span>
													) : (
														<span className="ml-1 text-error">No ISBN available</span>
													)}
												</span>
												{matchFound ? (
													<span className="tag-pill bg-success-soft text-success">Author match</span>
												) : (
													<span className="tag-pill bg-warning-soft text-warning">Select author manually</span>
												)}
											</div>
										</div>
									</button>
								</li>
							)
							})}
						</ul>
					)}
			</div>
		</div>
	)
}

export default BookSearchResults
