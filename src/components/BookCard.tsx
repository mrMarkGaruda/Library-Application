import { Calendar, Hash } from "lucide-react"
import placeholderCover from "../assets/book-placeholder.svg"
import type { Book } from "../types/Book"

interface BookCardProps {
	book: Book
	onPreview?: (book: Book) => void
}

const BookCard = ({ book, onPreview }: BookCardProps) => {
	const authorLine = book.authorNames?.length
		? book.authorNames.join(", ")
		: book.author ?? "Unknown author"
	const categories = (book.categories ?? []).filter((category) => category.trim().length > 0)
	const coverSrc = book.coverUrl ? book.coverUrl : placeholderCover
	const publishedLabel = book.publishedYear > 0 ? book.publishedYear : "Not available"
	const isbnLabel = book.isbn && book.isbn.trim().length > 0 ? book.isbn : "No ISBN"

	return (
		<article className="card-surface card-hover flex h-full flex-col gap-4 overflow-hidden p-5 animate-float-in">
			<div className="relative flex items-start gap-4">
				<div className="h-36 w-28 flex-shrink-0 overflow-hidden rounded-xl border border-shadow-light bg-cream">
					<img
						src={coverSrc}
						alt={book.title}
						className="h-full w-full object-cover"
						loading="lazy"
						onError={(event) => {
							if (event.currentTarget.src !== placeholderCover) {
								event.currentTarget.src = placeholderCover
							}
						}}
					/>
				</div>
				<div className="flex flex-1 flex-col gap-3">
					<header className="space-y-1">
						<h3 className="text-xl font-semibold text-rich-black">{book.title}</h3>
						<p className="text-sm text-soft-gray">{authorLine}</p>
					</header>
					<p className="line-clamp-3 text-sm leading-6 text-charcoal-strong">{book.description}</p>
				</div>
			</div>
			{categories.length > 0 && (
				<ul className="flex flex-wrap gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-soft-gray">
					{categories.slice(0, 4).map((category) => (
						<li
							key={`${book.id}-category-${category}`}
							className="rounded-full border border-shadow-light px-3 py-0.5"
						>
							{category}
						</li>
					))}
				</ul>
			)}
			<dl className="grid grid-cols-1 gap-2 text-xs font-medium text-charcoal-muted sm:grid-cols-2">
				<div className="flex items-center gap-2">
					<Calendar className="h-3.5 w-3.5 text-forest" aria-hidden="true" />
					<dt className="sr-only">Published</dt>
					<dd>Published {publishedLabel}</dd>
				</div>
				<div className="flex items-center gap-2">
					<Hash className="h-3.5 w-3.5 text-forest" aria-hidden="true" />
					<dt className="sr-only">ISBN</dt>
					<dd>{isbnLabel}</dd>
				</div>
			</dl>
			{onPreview && (
				<footer className="mt-1 flex items-center justify-end border-t border-shadow-light pt-3">
					<button
						type="button"
						onClick={() => onPreview(book)}
						className="btn-ghost h-9 px-4 text-xs"
					>
						Preview details
					</button>
				</footer>
			)}
		</article>
	)
}

export default BookCard
