import { BookOpen, User2 } from "lucide-react"
import type { Author } from "../types/Author"

interface AuthorCardProps {
	author: Author
	bookCount: number
}

const AuthorCard = ({ author, bookCount }: AuthorCardProps) => {
	const hasBio = author.bio.trim().length > 0
	const description = hasBio
		? author.bio
		: `Appears in ${bookCount === 1 ? "1 book" : `${bookCount} books`} from this collection.`

	return (
		<article className="card-surface card-hover flex h-full flex-col gap-5 p-6 animate-float-in">
				<header className="flex items-center gap-4">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-soft text-forest">
						<User2 className="h-7 w-7" aria-hidden="true" />
					</div>
					<div className="space-y-1">
					<h3 className="text-xl font-semibold text-rich-black">{author.name}</h3>
						{author.birthYear ? (
							<p className="text-xs font-medium uppercase tracking-[0.2em] text-soft-gray">
								Born {author.birthYear}
							</p>
						) : null}
					</div>
				</header>

			<p className="flex-1 text-sm leading-6 text-charcoal-strong">{description}</p>

				<div className="flex flex-wrap items-center justify-between gap-3 border-t border-shadow-light pt-4 text-sm font-semibold text-forest">
					<span className="inline-flex items-center gap-2">
						<BookOpen className="h-4 w-4" aria-hidden="true" />
						{bookCount} {bookCount === 1 ? "book" : "books"} in library
					</span>
				</div>
			</article>
		)
}

export default AuthorCard
