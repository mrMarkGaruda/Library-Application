import { CheckCircle2, Loader2 } from "lucide-react"

type ConnectionState = {
	status: "syncing" | "connected"
	lastSynced: Date | null
	latency: number | null
	fallbackUsed: boolean
}

type ConnectionStatusProps = {
	connection: ConnectionState
}

const formatTimestamp = (timestamp: Date | null) => {
	if (!timestamp) {
		return "Just now"
	}
	return timestamp.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	})
}

const ConnectionStatus = ({ connection }: ConnectionStatusProps) => {
	const isSyncing = connection.status === "syncing"
	const statusLabel = isSyncing
		? "Syncing with Library Cloud"
		: "Connected to Library Cloud"
	const latencyLabel = connection.latency != null ? `${connection.latency}ms latency` : "Latency n/a"
	const lastSyncedLabel = isSyncing
		? "Updating now"
		: `Last synced ${formatTimestamp(connection.lastSynced)}`

	return (
		<div
			className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-xs font-medium shadow-soft transition-colors duration-300 ${
				isSyncing ? "border-info-soft bg-info-soft text-info" : "border-success-soft bg-success-soft text-success"
			}`}
		>
			<span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-soft">
				{isSyncing ? (
					<Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
				) : (
					<CheckCircle2 className="h-4 w-4" aria-hidden="true" />
				)}
			</span>
			<div className="flex flex-col leading-tight">
				<span className="text-[0.7rem] uppercase tracking-[0.2em] text-soft-gray">
					{statusLabel}
				</span>
				<span className="text-[0.75rem] text-charcoal">{lastSyncedLabel}</span>
				<span className="text-[0.7rem] text-soft-gray">
					{latencyLabel}
					{connection.fallbackUsed && " · Smart cache engaged"}
				</span>
			</div>
		</div>
	)
}

export default ConnectionStatus
