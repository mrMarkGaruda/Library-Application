import { useCallback, useEffect, useRef, useState } from "react"
import type { MouseEvent as ReactMouseEvent } from "react"
import { ArrowUpRight, Calendar, Hash, X } from "lucide-react"
import placeholderCover from "../assets/book-placeholder.svg"
import type { Book } from "../types/Book"

type BookDetailsModalProps = {
	book: Book | null
	onClose: () => void
}

const BookDetailsModal = ({ book, onClose }: BookDetailsModalProps) => {
	const EXIT_ANIMATION_MS = 320
	const [isExiting, setIsExiting] = useState(false)
	const exitTimerRef = useRef<number | null>(null)
	const previousOverflowRef = useRef<string>("")

	const initiateClose = useCallback(() => {
		if (!book || isExiting) {
			return
		}
		setIsExiting(true)
		exitTimerRef.current = window.setTimeout(() => {
			exitTimerRef.current = null
			onClose()
		}, EXIT_ANIMATION_MS)
	}, [book, isExiting, onClose])

	useEffect(() => {
		if (!book) {
			return
		}
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				initiateClose()
			}
		}
		document.addEventListener("keydown", handleKeyDown)
		return () => document.removeEventListener("keydown", handleKeyDown)
	}, [book, initiateClose])

	useEffect(() => {
		setIsExiting(false)
		if (exitTimerRef.current) {
			window.clearTimeout(exitTimerRef.current)
			exitTimerRef.current = null
		}
	}, [book])

	useEffect(() => {
		return () => {
			if (exitTimerRef.current) {
				window.clearTimeout(exitTimerRef.current)
			}
		}
	}, [])

	useEffect(() => {
		if (!book) {
			return
		}
		const body = document.body
		previousOverflowRef.current = body.style.overflow
		body.style.overflow = "hidden"
		return () => {
			body.style.overflow = previousOverflowRef.current
		}
	}, [book])

	const handleBackdropClick = (event: ReactMouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) {
			initiateClose()
		}
	}

	if (!book) {
		return null
	}

	const authorLine = book.authorNames?.length
		? book.authorNames.join(", ")
		: book.author ?? "Unknown author"
	const categories = (book.categories ?? []).filter((category) => category.trim().length > 0)
	const publishedLabel = book.publishedYear > 0 ? book.publishedYear : "Not available"
	const isbnLabel = book.isbn && book.isbn.trim().length > 0 ? book.isbn : "No ISBN"
	const coverSrc = book.coverUrl ? book.coverUrl : placeholderCover
	const pageCountLabel = book.pageCount && book.pageCount > 0 ? `${book.pageCount} pages` : null
	const languageLabel = book.language ? book.language.toUpperCase() : null
	const infoLink = book.infoLink ?? book.previewLink ?? null

	const backdropClassName = `fixed inset-0 z-50 flex items-center justify-center bg-[rgba(16,16,16,0.75)] px-4 py-8 backdrop-blur ${
		isExiting ? "animate-backdrop-fade-out" : "animate-backdrop-fade"
	}`
	const modalClassName = `relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-cream shadow-lift ${
		isExiting ? "animate-modal-exit" : "animate-modal-enter"
	}`

	return (
		<div className={backdropClassName} onMouseDown={handleBackdropClick} role="presentation">
			<div onMouseDown={(event) => event.stopPropagation()} className={modalClassName}>
				<div className="flex justify-end px-10 pt-10">
					<button
						type="button"
						onClick={initiateClose}
						className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white shadow-soft transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(44,95,79,0.4)]"
						aria-label="Close book preview"
					>
						<X className="h-4 w-4" aria-hidden="true" />
						<span>Close</span>
					</button>
				</div>
				<div className="flex-1 overflow-y-auto px-10 pb-10">
					<div className="grid gap-8 pt-6 md:grid-cols-[minmax(0,1fr)_260px]">
						<section className="space-y-6">
							<header className="max-w-2xl space-y-3">
								<p className="text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-soft-gray">
									Featured title
								</p>
								<h2 className="text-4xl font-semibold text-rich-black">{book.title}</h2>
								<p className="text-sm font-medium text-charcoal">By {authorLine}</p>
								{categories.length > 0 && (
									<ul className="flex flex-wrap gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-soft-gray">
										{categories.map((category) => (
											<li
												key={`${book.id}-modal-category-${category}`}
												className="rounded-full border border-shadow-light bg-white/60 px-3 py-1"
											>
												{category}
											</li>
										))}
									</ul>
								)}
							</header>
							<section className="space-y-4">
								<h3 className="text-xs font-semibold uppercase tracking-[0.35em] text-soft-gray">Synopsis</h3>
								<p className="text-base leading-7 text-charcoal-strong">
									{book.description?.trim().length ? book.description : "No description is available for this title just yet."}
								</p>
							</section>
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="rounded-2xl border border-shadow-light bg-white/70 px-5 py-4">
									<p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-soft-gray">Publication</p>
									<div className="mt-2 flex items-center gap-3 text-sm font-medium text-charcoal">
										<Calendar className="h-4 w-4 text-forest" aria-hidden="true" />
										<span>{publishedLabel}</span>
									</div>
								</div>
								<div className="rounded-2xl border border-shadow-light bg-white/70 px-5 py-4">
									<p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-soft-gray">ISBN</p>
									<div className="mt-2 flex items-center gap-3 text-sm font-medium text-charcoal">
										<Hash className="h-4 w-4 text-forest" aria-hidden="true" />
										<span>{isbnLabel}</span>
									</div>
								</div>
								{pageCountLabel && (
									<div className="rounded-2xl border border-shadow-light bg-white/70 px-5 py-4">
										<p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-soft-gray">Length</p>
										<p className="mt-2 text-sm font-medium text-charcoal">{pageCountLabel}</p>
									</div>
								)}
								{languageLabel && (
									<div className="rounded-2xl border border-shadow-light bg-white/70 px-5 py-4">
										<p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-soft-gray">Language</p>
										<p className="mt-2 text-sm font-medium text-charcoal">{languageLabel}</p>
									</div>
								)}
							</div>
						</section>
						<aside className="space-y-6">
							<div className="rounded-3xl border border-shadow-light bg-white/60 p-6">
								<p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-soft-gray">Cover preview</p>
								<div className="mt-4 flex items-start gap-4">
									<div className="h-36 w-28 overflow-hidden rounded-xl border border-shadow-muted bg-cream">
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
									<p className="flex-1 text-xs leading-5 text-charcoal-muted">
										Covers come straight from data sources and may appear low-resolution. Use the synopsis and metadata for the most accurate snapshot.
									</p>
								</div>
							</div>
							{infoLink && (
								<a
									href={infoLink}
									target="_blank"
									rel="noreferrer"
									className="group inline-flex w-full items-center justify-between rounded-2xl border border-forest bg-forest text-white px-5 py-4 text-sm font-semibold transition hover:brightness-95"
								>
									<span>Open this title online</span>
									<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
								</a>
							)}
						</aside>
					</div>
				</div>
			</div>
		</div>
	)
}

export default BookDetailsModal
