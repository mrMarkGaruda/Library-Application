import { Calendar, Hash, Pencil, Trash2 } from "lucide-react"
import placeholderCover from "../assets/book-placeholder.svg"
import type { Author } from "../types/Author"
import type { Book } from "../types/Book"

interface BookCardProps {
	book: Book
	author: Author
	onEdit?: (book: Book) => void | Promise<void>
	onDelete?: (book: Book) => void | Promise<void>
	onPreview?: (book: Book) => void
}

const BookCard = ({ book, author, onEdit, onDelete, onPreview }: BookCardProps) => {
	return (
		<article className="card-surface card-hover flex h-full flex-col overflow-hidden">
			<div className="relative aspect-[2/3] w-full overflow-hidden bg-cream">
				<img
					src={book.coverUrl || placeholderCover}
					alt={book.title}
					className="h-full w-full object-cover"
					loading="lazy"
					onError={(event) => {
						if (event.currentTarget.src === placeholderCover) {
							return
						}
						event.currentTarget.src = placeholderCover
					}}
				/>
			</div>
			<div className="flex flex-1 flex-col gap-5 px-5 pb-6 pt-5">
				<header className="space-y-2">
					{author.country ? (
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-soft-gray">
							{author.country}
						</p>
					) : null}
					<h3 className="text-2xl font-semibold text-rich-black">{book.title}</h3>
					<p className="text-sm text-soft-gray">by {author.name}</p>
				</header>
				<p className="line-clamp-4 text-sm leading-6 text-charcoal-strong">{book.description}</p>
				<dl className="space-y-2 text-xs font-medium text-charcoal-muted">
					<div className="flex items-center gap-2">
						<Calendar className="h-3.5 w-3.5 text-forest" aria-hidden="true" />
						<dt className="sr-only">Published</dt>
						<dd>Published {book.publishedYear}</dd>
					</div>
					<div className="flex items-center gap-2">
						<Hash className="h-3.5 w-3.5 text-forest" aria-hidden="true" />
						<dt className="sr-only">ISBN</dt>
						<dd>{book.isbn}</dd>
					</div>
				</dl>
				{(onPreview || onEdit || onDelete) && (
					<footer className="mt-auto flex items-center justify-between gap-3 border-t border-shadow-light pt-4">
						{onPreview && (
							<button
								type="button"
								onClick={() => onPreview(book)}
								className="btn-ghost h-10 flex-1 justify-center text-xs"
							>
								Preview
							</button>
						)}
						{onEdit && (
							<button
								type="button"
								onClick={() => onEdit(book)}
								className="btn-secondary h-10 px-4 text-xs"
							>
								<Pencil className="h-3.5 w-3.5" aria-hidden="true" />
								Edit details
							</button>
						)}
						{onDelete && (
							<button
								type="button"
								onClick={() => onDelete(book)}
								className="btn-ghost h-10 px-4 text-xs text-error"
							>
								<Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
								Remove
							</button>
						)}
					</footer>
				)}
			</div>
		</article>
	)
}

export default BookCard
