import type { Author } from "../types/Author"
import type { Book } from "../types/Book"

type StatsRibbonProps = {
	authors: Author[]
	books: Book[]
	lastSynced: Date | null
	isSyncing: boolean
}

const formatRelativeSync = (lastSynced: Date | null) => {
	if (!lastSynced) {
		return "Syncing now"
	}
	const diff = Date.now() - lastSynced.getTime()
	if (diff < 60_000) {
		return "Just now"
	}
	if (diff < 3_600_000) {
		const mins = Math.round(diff / 60_000)
		return `${mins} min${mins === 1 ? "" : "s"} ago`
	}
	return lastSynced.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	})
}

const StatsRibbon = ({ authors, books, lastSynced, isSyncing }: StatsRibbonProps) => {
	const totalAuthors = authors.length
	const totalBooks = books.length
	const mostRecentTitle = books
		.slice()
		.sort((a, b) => (b.publishedYear ?? 0) - (a.publishedYear ?? 0))[0]
	const lastSyncedLabel = isSyncing ? "Updating now" : formatRelativeSync(lastSynced)

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
					<p className="text-sm font-semibold text-charcoal">{totalBooks} curated books</p>
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
					<p className="text-sm font-semibold text-charcoal">{totalAuthors} active voices</p>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-success-soft text-success">
					{isSyncing ? "SYNC" : "LIVE"}
				</span>
				<div className="opacity-80">
					<p className="text-xs font-semibold uppercase tracking-[0.3em] text-soft-gray">
						Library Cloud
					</p>
					<p className="text-sm font-semibold text-charcoal">{lastSyncedLabel}</p>
					{mostRecentTitle && (
						<p className="text-xs text-soft-gray">
							Newest: {mostRecentTitle.title} · {mostRecentTitle.publishedYear ?? "—"}
						</p>
					)}
				</div>
			</div>
		</section>
	)
}

export default StatsRibbon
