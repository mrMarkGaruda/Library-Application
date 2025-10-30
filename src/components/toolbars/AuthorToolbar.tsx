type AuthorToolbarProps = {
	sortOption: "alphabetical" | "books-desc" | "birth-new" | "birth-old"
	onSortChange: (option: AuthorToolbarProps["sortOption"]) => void
	disabled?: boolean
}

const AuthorToolbar = ({
	sortOption,
	onSortChange,
	disabled = false,
}: AuthorToolbarProps) => {
	return (
		<section className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-shadow-muted bg-white px-5 py-4 text-sm shadow-soft">
			<div className="flex flex-wrap items-center gap-4">
				<label className="text-xs font-semibold uppercase tracking-[0.3em] text-soft-gray">
					Sort authors
					<select
						value={sortOption}
						onChange={(event) => onSortChange(event.target.value as AuthorToolbarProps["sortOption"])}
						disabled={disabled}
						className="form-field mt-2 h-10 w-48 rounded-full border-shadow-light text-xs font-semibold"
					>
						<option value="alphabetical">Name A -&gt; Z</option>
						<option value="books-desc">Most books</option>
						<option value="birth-new">Youngest</option>
						<option value="birth-old">Oldest</option>
					</select>
				</label>
			</div>
		</section>
	)
}

export default AuthorToolbar
