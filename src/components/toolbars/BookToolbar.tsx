import type { ReactNode } from "react"

type BookToolbarProps = {
	sortOption: "recent" | "title-asc" | "title-desc" | "year-new" | "year-old"
	onSortChange: (option: BookToolbarProps["sortOption"]) => void
	yearFilter: "all" | "modern" | "classic"
	onYearFilterChange: (value: "all" | "modern" | "classic") => void
	categoryFilter: string
	onCategoryFilterChange: (value: string) => void
	categoryOptions: string[]
	disabled?: boolean
	actions?: ReactNode
}

const BookToolbar = ({
	sortOption,
	onSortChange,
	yearFilter,
	onYearFilterChange,
	categoryFilter,
	onCategoryFilterChange,
	categoryOptions,
	disabled = false,
	actions,
}: BookToolbarProps) => {
	return (
		<section className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-shadow-muted bg-white/90 px-5 py-4 text-sm shadow-soft animate-fade-in">
			<div className="flex flex-wrap items-center gap-6">
				<label className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-soft-gray">
					Sort by
					<select
						value={sortOption}
						onChange={(event) => onSortChange(event.target.value as BookToolbarProps["sortOption"])}
						disabled={disabled}
						className="form-field mt-2 h-11 w-48 rounded-full border-shadow-light text-sm font-medium capitalize"
					>
						<option value="recent">Newest arrivals</option>
						<option value="title-asc">Title A → Z</option>
						<option value="title-desc">Title Z → A</option>
						<option value="year-new">Newest year</option>
						<option value="year-old">Oldest year</option>
					</select>
				</label>
				<label className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-soft-gray">
					Era filter
					<select
						value={yearFilter}
						onChange={(event) =>
							onYearFilterChange(event.target.value as BookToolbarProps["yearFilter"])
						}
						disabled={disabled}
						className="form-field mt-2 h-11 w-44 rounded-full border-shadow-light text-sm font-medium"
					>
						<option value="all">All time</option>
						<option value="modern">Modern (&lt;= 30 yrs)</option>
						<option value="classic">Classics (&gt; 30 yrs)</option>
					</select>
				</label>
				<label className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-soft-gray">
					Type
					<select
						value={categoryFilter}
						onChange={(event) => onCategoryFilterChange(event.target.value)}
						disabled={disabled || categoryOptions.length === 0}
						className="form-field mt-2 h-11 w-48 rounded-full border-shadow-light text-sm font-medium"
					>
						<option value="all">All types</option>
						{categoryOptions.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
				</label>
			</div>
			{actions && <div className="flex flex-1 justify-end">{actions}</div>}
		</section>
	)
}

export default BookToolbar
