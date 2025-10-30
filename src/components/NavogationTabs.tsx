interface NavigationTabsProps {
	activeTab: string
	setActiveTab: (tab: string) => void
	booksCount: number
	authorsCount: number
}

const NavigationTabs = ({
	activeTab,
	setActiveTab,
	booksCount,
	authorsCount,
}: NavigationTabsProps) => {
	const tabs = [
		{ id: "books", label: "Books", count: booksCount },
		{ id: "authors", label: "Authors", count: authorsCount },
		{ id: "add-book", label: "Add Book", count: null },
		{ id: "add-author", label: "Add Author", count: null },
	]

	return (
		<nav className="sticky top-0 z-30 border-b border-shadow bg-cream-glass backdrop-blur">
			<div className="mx-auto max-w-6xl px-6">
				<div
					role="tablist"
					aria-label="Library sections"
					className="flex flex-wrap items-center gap-4 text-sm font-semibold text-charcoal"
				>
					{tabs.map((tab) => {
						const isActive = activeTab === tab.id
						return (
							<button
								key={tab.id}
								type="button"
								role="tab"
								aria-selected={isActive}
								className={`relative pb-4 pt-5 transition-colors tab-label ${
									isActive ? "tab-label-active" : ""
								}`}
								onClick={() => setActiveTab(tab.id)}
							>
								<span className="flex items-center gap-2 text-base">
									{tab.label}
									{tab.count !== null && (
										<span className="rounded-full bg-forest-soft px-2 py-0.5 text-xs font-semibold text-forest">
											{tab.count}
										</span>
									)}
								</span>

								{isActive && (
									<span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-forest" aria-hidden="true" />
								)}
							</button>
						)
					})}
				</div>
			</div>
		</nav>
	)
}

export default NavigationTabs
