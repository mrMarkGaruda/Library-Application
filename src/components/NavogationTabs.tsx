import type { ReactNode } from "react"

interface NavigationTabsProps {
	activeTab: string
	onTabChange: (tab: string) => void
	tabs: Array<{ id: string; label: string; count?: number | null }>
	rightSlot?: ReactNode
}

const NavigationTabs = ({ activeTab, onTabChange, tabs, rightSlot }: NavigationTabsProps) => {
	return (
		<nav className="sticky top-0 z-30 border-b border-shadow bg-cream-frosted backdrop-blur-xl">
			<div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
				<div
					role="tablist"
					aria-label="Library sections"
					className="flex flex-wrap items-center gap-2 text-sm font-semibold text-charcoal"
				>
					{tabs.map((tab) => {
						const isActive = activeTab === tab.id
						const baseClasses =
							"relative rounded-xl px-4 py-2.5 transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest/40"
						const stateClasses = isActive
							? "bg-white text-forest shadow-soft"
							: "text-charcoal/70 hover:-translate-y-[1px] hover:bg-white/80 hover:text-forest hover:shadow-soft"
						return (
							<button
								key={tab.id}
								type="button"
								role="tab"
								aria-selected={isActive}
								className={`${baseClasses} ${stateClasses}`.trim()}
								onPointerDown={(event) => {
									if (event.button !== 0) {
										return
									}
									if (event.pointerType === "mouse" || event.pointerType === "touch" || event.pointerType === "pen") {
										onTabChange(tab.id)
									}
								}}
								onClick={() => onTabChange(tab.id)}
							>
								<span className="flex items-center gap-2 text-base">
									{tab.label}
									{typeof tab.count === "number" && (
										<span className="rounded-full bg-forest-soft px-2 py-0.5 text-xs font-semibold text-forest">
											{tab.count}
										</span>
									)}
								</span>
							</button>
						)
					})}
				</div>
				{rightSlot && <div className="w-full shrink-0 md:w-auto">{rightSlot}</div>}
			</div>
		</nav>
	)
}

export default NavigationTabs
