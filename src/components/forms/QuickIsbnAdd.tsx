import { useState } from "react"
import { Loader2, ScanLine, CheckCircle2, AlertCircle } from "lucide-react"
import { lookupBookByIsbn } from "../../services/googleBooksService"
import type { Book } from "../../types/Book"

interface QuickIsbnAddProps {
	onResolve: (book: Book) => Promise<"added" | "duplicate"> | "added" | "duplicate"
	className?: string
	variant?: "surface" | "outline" | "embedded"
}

type StatusState =
	| { type: "idle" }
	| { type: "success"; message: string }
	| { type: "error"; message: string }

const QuickIsbnAdd = ({ onResolve, className = "", variant = "surface" }: QuickIsbnAddProps) => {
	const [isbn, setIsbn] = useState("")
	const [status, setStatus] = useState<StatusState>({ type: "idle" })
	const [isLoading, setIsLoading] = useState(false)

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const trimmed = isbn.trim()

		if (!trimmed) {
			setStatus({ type: "error", message: "Enter an ISBN to fetch book details." })
			return
		}

		setIsLoading(true)
		setStatus({ type: "idle" })

		try {
			const lookupResult = await lookupBookByIsbn(trimmed)

			if (!lookupResult) {
				setStatus({
					type: "error",
					message: "Could not find a book for that ISBN. Double-check the number and try again.",
				})
				return
			}

			const outcome = await Promise.resolve(onResolve(lookupResult))
			if (outcome === "duplicate") {
				setStatus({ type: "error", message: "This ISBN is already in your library." })
			} else {
				setStatus({ type: "success", message: `Added “${lookupResult.title}” to your library.` })
				setIsbn("")
			}
		} catch (error) {
			console.error("ISBN lookup failed", error)
			setStatus({
				type: "error",
				message: "Something went wrong while fetching the book. Please try again shortly.",
			})
		} finally {
			setIsLoading(false)
		}
	}

	const baseClasses = ["animate-fade-in", "flex", "flex-col", "gap-3", "text-sm"]

	switch (variant) {
		case "outline":
			baseClasses.push("rounded-2xl", "border", "border-shadow-light", "bg-white", "px-5", "py-4", "shadow-soft")
			break
		case "embedded":
			baseClasses.push("rounded-xl", "border", "border-transparent", "px-0", "py-0", "shadow-none")
			break
		case "surface":
		default:
			baseClasses.push("surface-panel", "rounded-2xl", "px-5", "py-4")
			break
	}

	const containerClassName = `${baseClasses.join(" ")} ${className}`.trim()

	return (
		<form
			onSubmit={handleSubmit}
			className={containerClassName.trim()}
			aria-label="Quick add book by ISBN"
		>
			<div className="flex flex-wrap items-end gap-3">
				<label className="flex-1 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-soft-gray">
					Quick add by ISBN
					<input
						type="text"
						inputMode="numeric"
						value={isbn}
						onChange={(event) => setIsbn(event.target.value)}
						placeholder="e.g., 9780061120084"
						className="form-field mt-2"
						aria-describedby="quick-isbn-helper"
					/>
				</label>
				<button
					type="submit"
					className="btn-primary h-11 px-5"
					disabled={isLoading}
				>
					{isLoading ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
							<span>Searching…</span>
						</>
					) : (
						<>
							<ScanLine className="h-4 w-4" aria-hidden="true" />
							<span>Add from ISBN</span>
						</>
					)}
				</button>
			</div>
			<p id="quick-isbn-helper" className="text-xs text-charcoal-muted">
				We’ll pull cover art and metadata automatically. Manual edits are still possible later.
			</p>
			{status.type === "success" && (
				<p className="flex items-center gap-2 text-xs font-medium text-success">
					<CheckCircle2 className="h-4 w-4" aria-hidden="true" />
					{status.message}
				</p>
			)}
			{status.type === "error" && (
				<p className="flex items-center gap-2 text-xs font-medium text-error">
					<AlertCircle className="h-4 w-4" aria-hidden="true" />
					{status.message}
				</p>
			)}
		</form>
	)
}

export default QuickIsbnAdd
