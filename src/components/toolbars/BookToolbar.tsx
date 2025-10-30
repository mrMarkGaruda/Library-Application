type AuthorOption = {
	id: number
	name: string
}

type BookToolbarProps = {
	sortOption: "recent" | "title-asc" | "title-desc" | "year-new" | "year-old"
	onSortChange: (option: BookToolbarProps["sortOption"]) => void
	authorFilter: number | "all"
	onAuthorFilterChange: (value: number | "all") => void
	yearFilter: "all" | "modern" | "classic"
	onYearFilterChange: (value: "all" | "modern" | "classic") => void
	authors: AuthorOption[]
	disabled?: boolean
}

const BookToolbar = ({
	sortOption,
	onSortChange,
	authorFilter,
	onAuthorFilterChange,
	yearFilter,
	onYearFilterChange,
	authors,
	disabled = false,
}: BookToolbarProps) => {
	return (
		<section className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-shadow-muted bg-white px-5 py-4 text-sm shadow-soft">
			<div className="flex flex-wrap items-center gap-4">
				<label className="text-xs font-semibold uppercase tracking-[0.3em] text-soft-gray">
					Sort by
					<select
						value={sortOption}
						onChange={(event) => onSortChange(event.target.value as BookToolbarProps["sortOption"])}
						disabled={disabled}
						className="form-field mt-2 h-10 w-44 rounded-full border-shadow-light text-xs font-semibold capitalize"
					>
						<option value="recent">Recently synced</option>
						<option value="title-asc">Title A → Z</option>
						<option value="title-desc">Title Z → A</option>
						<option value="year-new">Newest year</option>
						<option value="year-old">Oldest year</option>
					</select>
				</label>
				<label className="text-xs font-semibold uppercase tracking-[0.3em] text-soft-gray">
					Author
					<select
						value={authorFilter}
						onChange={(event) => {
							const value = event.target.value
							onAuthorFilterChange(value === "all" ? "all" : Number(value))
						}}
						disabled={disabled}
						className="form-field mt-2 h-10 w-48 rounded-full border-shadow-light text-xs font-semibold"
					>
						<option value="all">All authors</option>
						{authors.map((author) => (
							<option key={author.id} value={author.id}>
								{author.name}
							</option>
						))}
					</select>
				</label>
			</div>
			<label className="text-xs font-semibold uppercase tracking-[0.3em] text-soft-gray">
				Era
				<select
					value={yearFilter}
					onChange={(event) => onYearFilterChange(event.target.value as BookToolbarProps["yearFilter"])}
					disabled={disabled}
					className="form-field mt-2 h-10 w-40 rounded-full border-shadow-light text-xs font-semibold"
				>
					<option value="all">All time</option>
					<option value="modern">Modern (&lt;= 30 yrs)</option>
					<option value="classic">Classic (&gt; 30 yrs)</option>
				</select>
			</label>
		</section>
	)
}

export default BookToolbar
