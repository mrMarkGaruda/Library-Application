import { useEffect } from "react"
import { Calendar, Hash, X } from "lucide-react"
import type { Author } from "../types/Author"
import type { Book } from "../types/Book"

type BookDetailsModalProps = {
	book: Book | null
	author: Author | null
	onClose: () => void
}

const BookDetailsModal = ({ book, author, onClose }: BookDetailsModalProps) => {
	useEffect(() => {
		if (!book) {
			return
		}
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose()
			}
		}
		document.addEventListener("keydown", handleKeyDown)
		return () => document.removeEventListener("keydown", handleKeyDown)
	}, [book, onClose])

	if (!book) {
		return null
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,26,26,0.55)] px-4 py-8">
			<div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-lift">
				<button
					type="button"
					onClick={onClose}
					className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-shadow-light text-soft-gray transition hover:text-charcoal"
					aria-label="Close book preview"
				>
					<X className="h-5 w-5" aria-hidden="true" />
				</button>
				<div className="grid gap-8 p-8 md:grid-cols-[240px,1fr]">
					<div className="overflow-hidden rounded-2xl border border-shadow-light bg-cream">
						{book.coverUrl ? (
							<img
								src={book.coverUrl}
								alt={book.title}
								className="h-full w-full object-cover"
								loading="lazy"
							/>
						) : (
							<div className="flex h-full items-center justify-center text-soft-gray">
								No cover available
							</div>
						)}
					</div>
					<div className="space-y-6">
						<header className="space-y-2">
							<p className="text-xs font-semibold uppercase tracking-[0.3em] text-soft-gray">
								{author?.country ?? "International"}
							</p>
							<h2 className="text-3xl font-semibold text-rich-black">{book.title}</h2>
							<p className="text-sm text-soft-gray">{author ? `by ${author.name}` : "Unknown author"}</p>
						</header>
						<p className="text-sm leading-6 text-charcoal-strong">{book.description}</p>
						<dl className="space-y-3 text-sm font-medium text-charcoal">
							<div className="flex items-center gap-3">
								<Calendar className="h-4 w-4 text-forest" aria-hidden="true" />
								<dt className="sr-only">Published</dt>
								<dd>Published {book.publishedYear ?? "Not available"}</dd>
							</div>
							<div className="flex items-center gap-3">
								<Hash className="h-4 w-4 text-forest" aria-hidden="true" />
								<dt className="sr-only">ISBN</dt>
								<dd>{book.isbn ?? "No ISBN"}</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>
		</div>
	)
}

export default BookDetailsModal
