import { Search } from "lucide-react"

interface SearchBarProps {
	searchTerm: string
	onSearchChange: (value: string) => void
}

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
	return (
		<div className="relative mx-auto w-full max-w-xl">
			<label htmlFor="library-global-search" className="sr-only">
				Search library
			</label>
			<Search
				className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-soft-gray"
				aria-hidden="true"
			/>
			<input
				id="library-global-search"
				type="search"
				placeholder="Search books or authors..."
				value={searchTerm}
				onChange={(event) => onSearchChange(event.target.value)}
				className="form-field rounded-full py-3 pl-14 pr-5 text-sm font-medium"
			/>
		</div>
	)
}

export default SearchBar
