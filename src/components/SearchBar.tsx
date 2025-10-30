import type { HTMLAttributes } from "react"
import { Search } from "lucide-react"

interface SearchBarProps extends Pick<HTMLAttributes<HTMLDivElement>, "className"> {
	searchTerm: string
	onSearchChange: (value: string) => void
}

const SearchBar = ({ searchTerm, onSearchChange, className = "" }: SearchBarProps) => {
	return (
		<div className={`relative w-full ${className}`}>
			<label htmlFor="library-global-search" className="sr-only">
				Search library
			</label>
			<Search
				className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-forest/50"
				aria-hidden="true"
			/>
			<input
				id="library-global-search"
				type="search"
				placeholder="Search the collection…"
				value={searchTerm}
				onChange={(event) => onSearchChange(event.target.value)}
				className="w-full rounded-2xl border border-shadow-light bg-white/80 py-3.5 pl-14 pr-5 text-sm font-medium text-charcoal shadow-soft transition focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/40"
			/>
		</div>
	)
}

export default SearchBar
