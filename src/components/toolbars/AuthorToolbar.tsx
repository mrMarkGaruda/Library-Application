import type { ReactNode } from "react"

type AuthorToolbarProps = {
	sortOption: "alphabetical" | "books-desc" | "birth-new" | "birth-old"
	onSortChange: (option: AuthorToolbarProps["sortOption"]) => void
	disabled?: boolean
	actions?: ReactNode
}

const AuthorToolbar = ({
	sortOption,
	onSortChange,
	disabled = false,
	actions,
}: AuthorToolbarProps) => {
	return (
		<section className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-shadow-muted bg-white/90 px-5 py-4 text-sm shadow-soft animate-fade-in">
			<label className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-soft-gray">
				Sort authors
				<select
					value={sortOption}
					onChange={(event) => onSortChange(event.target.value as AuthorToolbarProps["sortOption"])}
					disabled={disabled}
					className="form-field mt-2 h-11 w-52 rounded-full border-shadow-light text-sm font-medium"
				>
					<option value="alphabetical">Name A → Z</option>
					<option value="books-desc">Most books</option>
					<option value="birth-new">Youngest</option>
					<option value="birth-old">Oldest</option>
				</select>
			</label>
			{actions && <div className="flex flex-1 justify-end">{actions}</div>}
		</section>
	)
}

export default AuthorToolbar
