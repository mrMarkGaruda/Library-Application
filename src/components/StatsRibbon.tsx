import type { Author } from "../types/Author"
import type { Book } from "../types/Book"

type StatsRibbonProps = {
	authors: Author[]
	books: Book[]
}

const StatsRibbon = ({ authors, books }: StatsRibbonProps) => {
	const totalAuthors = authors.length
	const totalBooks = books.length

	const newestPublication = books
		.slice()
		.sort((a, b) => (b.publishedYear ?? 0) - (a.publishedYear ?? 0))[0]

	const categorySet = new Set<string>()
	for (const book of books) {
		book.categories?.forEach((category) => {
			const trimmed = category.trim()
			if (trimmed) {
				categorySet.add(trimmed)
			}
		})
	}

	const categoryCount = categorySet.size
	const latestBadge =
		newestPublication && newestPublication.publishedYear > 0
			? String(newestPublication.publishedYear)
			: "—"
	const latestSummary = newestPublication
		? `${newestPublication.title}${
				newestPublication.publishedYear ? ` · ${newestPublication.publishedYear}` : ""
			}`
		: "Publication year unavailable."
	const categorySummary = categoryCount > 0
		? `${categoryCount} ${categoryCount === 1 ? "category" : "categories"} represented`
		: "Categories not specified in this collection."

	return (
		<section className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-shadow-muted bg-white px-6 py-5 text-sm text-soft-gray shadow-soft transition-all duration-300 md:grid-cols-3">
			<div className="flex items-center gap-3">
				<span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-forest-soft text-forest">
					{totalBooks}
				</span>
				<div className="opacity-80">
					<p className="text-xs font-semibold uppercase tracking-[0.3em] text-soft-gray">
						Titles
					</p>
					<p className="text-sm font-semibold text-charcoal">{totalBooks} books in this catalog</p>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-info-soft text-info">
					{totalAuthors}
				</span>
				<div className="opacity-80">
					<p className="text-xs font-semibold uppercase tracking-[0.3em] text-soft-gray">
						Authors
					</p>
					<p className="text-sm font-semibold text-charcoal">{totalAuthors} writers featured</p>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-success-soft text-success">
					{latestBadge}
				</span>
				<div className="opacity-80">
					<p className="text-xs font-semibold uppercase tracking-[0.3em] text-soft-gray">
						Latest Release
					</p>
					<p className="text-sm font-semibold text-charcoal">{latestSummary}</p>
					<p className="text-xs text-soft-gray">{categorySummary}</p>
				</div>
			</div>
		</section>
	)
}

export default StatsRibbon
