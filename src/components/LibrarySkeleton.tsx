type LibrarySkeletonProps = {
	variant: "books" | "authors"
}

const cardCount = {
	books: 6,
	authors: 4,
}

const LibrarySkeleton = ({ variant }: LibrarySkeletonProps) => {
	const count = cardCount[variant]
	const gridClass =
		variant === "books"
			? "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
			: "grid grid-cols-1 gap-6 md:grid-cols-2"

	return (
		<div className={gridClass}>
			{Array.from({ length: count }).map((_, index) => (
				<div
					key={index}
					className="card-surface flex h-full animate-pulse flex-col overflow-hidden"
				>
					{variant === "books" && <div className="aspect-[2/3] w-full bg-cream" />}
					<div className="flex flex-grow flex-col gap-4 px-6 py-6">
						<div className="space-y-2">
							<div className="h-4 w-1/3 rounded-full bg-shadow" />
							<div className="h-6 w-2/3 rounded-full bg-shadow" />
							<div className="h-4 w-1/2 rounded-full bg-shadow" />
						</div>
						<div className="space-y-2 opacity-90">
							<div className="h-3 w-full rounded-full bg-shadow" />
							<div className="h-3 w-5/6 rounded-full bg-shadow" />
							<div className="h-3 w-4/5 rounded-full bg-shadow" />
						</div>
						<div className="mt-auto flex gap-3 opacity-80">
							<div className="h-9 w-24 rounded-full bg-shadow" />
							<div className="h-9 w-24 rounded-full bg-shadow" />
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

export default LibrarySkeleton
