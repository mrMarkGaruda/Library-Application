import { BookOpen, Pencil, Trash2, User2 } from "lucide-react"
import type { Author } from "../types/Author"

interface AuthorCardProps {
	author: Author
	bookCount: number
	onEdit?: (author: Author) => void | Promise<void>
	onDelete?: (author: Author) => void | Promise<void>
	onHighlightBooks?: (authorId: number) => void
}

const AuthorCard = ({ author, bookCount, onEdit, onDelete, onHighlightBooks }: AuthorCardProps) => {
		return (
			<article className="card-surface card-hover flex h-full flex-col gap-6 p-6">
				<header className="flex items-center gap-4">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-soft text-forest">
						<User2 className="h-7 w-7" aria-hidden="true" />
					</div>
					<div className="space-y-1">
						<h3 className="text-2xl font-semibold text-rich-black">{author.name}</h3>
						{author.birthYear ? (
							<p className="text-xs font-medium uppercase tracking-[0.2em] text-soft-gray">
								Born {author.birthYear}
							</p>
						) : null}
					</div>
				</header>

				<p className="flex-1 text-sm leading-6 text-charcoal-strong">{author.bio}</p>

				<div className="flex flex-wrap items-center justify-between gap-3 border-t border-shadow-light pt-4 text-sm font-semibold text-forest">
					<span className="inline-flex items-center gap-2">
						<BookOpen className="h-4 w-4" aria-hidden="true" />
						{bookCount} {bookCount === 1 ? "book" : "books"} in library
					</span>

					{(onHighlightBooks || onEdit || onDelete) && (
						<div className="flex flex-wrap items-center gap-2">
							{onHighlightBooks && author.id != null && (
								<button
									type="button"
									onClick={() => onHighlightBooks(author.id!)}
									className="btn-ghost h-9 px-4 text-xs"
								>
									View books
								</button>
							)}
							{onEdit && (
								<button
									type="button"
									onClick={() => onEdit(author)}
									className="btn-secondary h-9 px-4 text-xs"
								>
									<Pencil className="h-3.5 w-3.5" aria-hidden="true" />
									Edit author
								</button>
							)}
							{onDelete && (
								<button
									type="button"
									onClick={() => onDelete(author)}
									className="btn-ghost h-9 px-4 text-xs text-error"
								>
									<Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
									Remove
								</button>
							)}
						</div>
					)}
				</div>
			</article>
		)
}

export default AuthorCard
