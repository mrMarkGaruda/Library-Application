import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { BookOpen, Library, RefreshCcw, RotateCcw, Server } from "lucide-react"
import BookCard from "./components/BookCard"
import AuthorCard from "./components/AuthorCard"
import SearchBar from "./components/SearchBar"
import AddAuthorForm from "./components/tabs/AddAuthorForm"
import type { Author } from "./types/Author"
import AddBookForm from "./components/tabs/AddBookForm"
import type { Book } from "./types/Book"
import NavigationTabs from "./components/NavogationTabs"
import ConnectionStatus from "./components/ConnectionStatus"
import StatsRibbon from "./components/StatsRibbon"
import BookToolbar from "./components/toolbars/BookToolbar"
import AuthorToolbar from "./components/toolbars/AuthorToolbar"
import BookDetailsModal from "./components/BookDetailsModal"
import LibrarySkeleton from "./components/LibrarySkeleton"
import {
	libraryGateway,
	type GatewayMeta,
	type SnapshotResult,
	type OperationResult,
	type SeedSource,
} from "./services/libraryGateway"

type ConnectionState = {
	status: "syncing" | "connected"
	lastSynced: Date | null
	latency: number | null
	fallbackUsed: boolean
}

type StatusMessage = {
	message: string
	tone: "success" | "info"
}

type BookSortOption = "recent" | "title-asc" | "title-desc" | "year-new" | "year-old"
type BookYearFilter = "all" | "modern" | "classic"
type AuthorSortOption = "alphabetical" | "books-desc" | "birth-new" | "birth-old"

const App = () => {
	const [activeTab, setActiveTab] = useState("books")
	const [searchTerm, setSearchTerm] = useState("")
	const [authors, setAuthors] = useState<Author[]>([])
	const [books, setBooks] = useState<Book[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isSyncing, setIsSyncing] = useState(false)
	const [editingAuthor, setEditingAuthor] = useState<Author | null>(null)
	const [editingBook, setEditingBook] = useState<Book | null>(null)
	const [status, setStatus] = useState<StatusMessage | null>(null)
	const [connection, setConnection] = useState<ConnectionState>({
		status: "syncing",
		lastSynced: null,
		latency: null,
		fallbackUsed: false,
	})
	const [seedSource, setSeedSource] = useState<SeedSource>(() => libraryGateway.getSeedSource())
	const [bookSort, setBookSort] = useState<BookSortOption>("recent")
	const [bookAuthorFilter, setBookAuthorFilter] = useState<number | "all">("all")
	const [bookYearFilter, setBookYearFilter] = useState<BookYearFilter>("all")
	const [authorSort, setAuthorSort] = useState<AuthorSortOption>("alphabetical")
	const [previewBook, setPreviewBook] = useState<Book | null>(null)
	const hasLoadedRef = useRef(false)

	const showStatus = useCallback(
		(message: string, tone: "success" | "info" = "success") => {
			setStatus({ message, tone })
		},
		[]
	)

	const updateConnection = useCallback((meta: GatewayMeta) => {
		setConnection({
			status: "connected",
			lastSynced: new Date(meta.timestamp),
			latency: meta.latency,
			fallbackUsed: meta.fallbackUsed,
		})
	}, [])

	const applyGatewaySnapshot = useCallback(
		(snapshot: SnapshotResult | OperationResult<unknown>) => {
			setAuthors(snapshot.authors)
			setBooks(snapshot.books)
			updateConnection(snapshot.meta)
			setSeedSource(libraryGateway.getSeedSource())
		},
		[updateConnection]
	)

	const syncLibrary = useCallback(
		async ({ announce = false }: { announce?: boolean } = {}) => {
			setConnection((prev) => ({ ...prev, status: "syncing" }))
			setIsSyncing(true)
			if (!hasLoadedRef.current) {
				setIsLoading(true)
			}
			try {
				const snapshot = await libraryGateway.syncSnapshot()
				applyGatewaySnapshot(snapshot)
				if (announce) {
					showStatus(`Library synced in ${snapshot.meta.latency}ms.`, "success")
				}
			} catch (error) {
				console.error("Library sync failed", error)
				showStatus("Reconnected using cached library data.", "info")
			} finally {
				hasLoadedRef.current = true
				setIsLoading(false)
				setIsSyncing(false)
			}
		},
		[applyGatewaySnapshot, showStatus]
	)

	useEffect(() => {
		libraryGateway.initialize()
		void syncLibrary()
	}, [syncLibrary])

	useEffect(() => {
		if (!status) {
			return
		}
		const timeoutId = window.setTimeout(() => setStatus(null), 4000)
		return () => window.clearTimeout(timeoutId)
	}, [status])


	const getAuthorById = useCallback(
		(authorId: number) => authors.find((author) => author.id === authorId),
		[authors]
	)

	const handleAuthorFormSuccess = (mode: "create" | "edit") => {
		const baseMessage = mode === "edit" ? "Author profile updated." : "Author added to Library Cloud."
		showStatus(baseMessage, "success")
		setEditingAuthor(null)
		setActiveTab("authors")
	}

	const handleBookFormSuccess = (mode: "create" | "edit") => {
		const baseMessage = mode === "edit" ? "Book details refreshed everywhere." : "Book added to Library Cloud."
		showStatus(baseMessage, "success")
		setEditingBook(null)
		setActiveTab("books")
	}

	const handleAddAuthor = async (author: Author) => {
		const { id: _unused, ...payload } = author
		const result = await libraryGateway.createAuthor(payload)
		applyGatewaySnapshot(result)
		showStatus(`Author saved to Library Cloud.`, "success")
	}

	const handleAddBook = async (book: Book) => {
		const { id: _unused, ...payload } = book
		const result = await libraryGateway.createBook(payload)
		applyGatewaySnapshot(result)
		showStatus(`Book saved to Library Cloud.`, "success")
	}

	const handleUpdateAuthor = async (author: Author) => {
		const result = await libraryGateway.updateAuthor(author)
		applyGatewaySnapshot(result)
		showStatus(`Author profile updated across devices.`, "success")
	}

	const handleUpdateBook = async (book: Book) => {
		const result = await libraryGateway.updateBook(book)
		applyGatewaySnapshot(result)
		showStatus(`Updated "${book.title}".`, "success")
	}

	const handleDeleteAuthor = async (author: Author) => {
		const snapshot = await libraryGateway.deleteAuthor(author)
		applyGatewaySnapshot(snapshot)
		showStatus(`Removed "${author.name}" from Library Cloud.`, "success")
		setEditingAuthor(null)
	}

	const handleDeleteBook = async (book: Book) => {
		const snapshot = await libraryGateway.deleteBook(book)
		applyGatewaySnapshot(snapshot)
		showStatus(`Removed "${book.title}" from Library Cloud.`, "success")
		setEditingBook(null)
	}

	const beginEditAuthor = (author: Author) => {
		setEditingAuthor({ ...author })
		setActiveTab("add-author")
	}

	const beginEditBook = (book: Book) => {
		setEditingBook({ ...book })
		setActiveTab("add-book")
	}

	const handleResetLibrary = (seed: SeedSource) => {
		void (async () => {
			const snapshot = await libraryGateway.resetDemoData(seed)
			applyGatewaySnapshot(snapshot)
			setEditingAuthor(null)
			setEditingBook(null)
			setPreviewBook(null)
			setActiveTab("books")
			setBookAuthorFilter("all")
			const seedLabel = seed === "server" ? "Server catalog" : "Demo library"
			showStatus(`${seedLabel} restored and synced.`, "success")
		})()
	}

	const getBookCountByAuthor = useCallback(
		(authorId?: number) => {
			if (!authorId) {
				return 0
			}
			return books.filter((book) => book.authorId === authorId).length
		},
		[books]
	)

	const normalizedSearch = searchTerm.toLowerCase()

	const authorOptions = useMemo(
		() =>
			authors
				.filter((author) => author.id != null)
				.map((author) => ({ id: author.id!, name: author.name }))
				.sort((a, b) => a.name.localeCompare(b.name)),
		[authors]
	)


	const filteredBooks = useMemo(() => {
		const search = normalizedSearch.trim()
		const modernCutoff = new Date().getFullYear() - 30
		return books
			.filter((book) => {
				const author = getAuthorById(book.authorId)
				const matchesSearch = search
					? book.title.toLowerCase().includes(search) ||
						(author?.name.toLowerCase().includes(search) ?? false)
					: true
				const matchesAuthor =
					bookAuthorFilter === "all" || book.authorId === bookAuthorFilter
				const matchesYear =
					bookYearFilter === "all"
						? true
						: bookYearFilter === "modern"
							? book.publishedYear >= modernCutoff
							: book.publishedYear < modernCutoff
				return matchesSearch && matchesAuthor && matchesYear
			})
			.sort((a, b) => {
				switch (bookSort) {
					case "title-asc":
						return a.title.localeCompare(b.title)
					case "title-desc":
						return b.title.localeCompare(a.title)
					case "year-new":
						return (b.publishedYear ?? 0) - (a.publishedYear ?? 0)
					case "year-old":
						return (a.publishedYear ?? 0) - (b.publishedYear ?? 0)
					case "recent":
					default: {
						const idA = a.id ?? 0
						const idB = b.id ?? 0
						return idB - idA
					}
				}
			})
	}, [books, bookAuthorFilter, bookSort, bookYearFilter, getAuthorById, normalizedSearch])

	const filteredAuthors = useMemo(() => {
		const search = normalizedSearch.trim()
		return authors
			.filter((author) => {
				return search
					? author.name.toLowerCase().includes(search) ||
						author.bio?.toLowerCase().includes(search)
					: true
			})
			.sort((a, b) => {
				switch (authorSort) {
					case "books-desc":
						return getBookCountByAuthor(b.id) - getBookCountByAuthor(a.id)
					case "birth-new":
						return (b.birthYear ?? 0) - (a.birthYear ?? 0)
					case "birth-old":
						return (a.birthYear ?? 0) - (b.birthYear ?? 0)
					case "alphabetical":
					default:
						return a.name.localeCompare(b.name)
				}
			})
	}, [authors, authorSort, getBookCountByAuthor, normalizedSearch])

	const handleTabSelect = (tab: string) => {
		if (tab === "add-author") {
			setEditingAuthor(null)
		}
		if (tab === "add-book") {
			setEditingBook(null)
		}
		setActiveTab(tab)
	}

	const isEditingAuthor = editingAuthor != null
	const isEditingBook = editingBook != null
	const statusBannerClass = status?.tone === "success"
		? "border border-success-soft bg-success-soft text-success"
		: "border border-info-soft bg-info-soft text-info"

	const handleHighlightAuthor = (authorId: number) => {
		setActiveTab("books")
		setBookAuthorFilter(authorId)
	}

	const handlePreviewBook = (book: Book) => {
		setPreviewBook(book)
	}

	const connectionProps: ConnectionState = {
		status: isSyncing ? "syncing" : connection.status,
		lastSynced: connection.lastSynced,
		latency: connection.latency,
		fallbackUsed: connection.fallbackUsed,
	}

	return (
		<div className="min-h-screen bg-cream text-charcoal">
			<header className="relative border-b border-shadow-light">
				<div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
					<div className="flex flex-wrap items-center justify-between gap-6">
						<div className="flex items-center gap-4">
							<span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest text-white shadow-soft">
								<BookOpen className="h-7 w-7" aria-hidden="true" />
							</span>
							<div className="space-y-1">
								<p className="text-xs font-semibold uppercase tracking-[0.3em] text-soft-gray">
									Your personal library
								</p>
								<h1 className="text-4xl font-semibold text-rich-black">Books & Authors Library</h1>
								<p className="max-w-xl text-sm text-soft-gray">
									Curate a calm, intelligent catalog of the stories and voices that inspire you.
								</p>
							</div>
						</div>
						<div className="flex flex-col items-end gap-4">
							<ConnectionStatus connection={connectionProps} />
							<div className="flex flex-wrap items-center justify-end gap-3">
								<button
									type="button"
									onClick={() => {
										void syncLibrary({ announce: true })
									}}
									disabled={isSyncing}
									className="btn-ghost"
								>
									<RefreshCcw className="h-4 w-4" aria-hidden="true" />
									Sync Library
								</button>
								<button
									type="button"
									onClick={() => handleResetLibrary("static")}
									disabled={isSyncing}
									className="btn-ghost"
								>
									<RotateCcw className="h-4 w-4" aria-hidden="true" />
									Reset Demo Data
								</button>
								<button
									type="button"
									onClick={() => handleResetLibrary("server")}
									disabled={isSyncing}
									className="btn-secondary"
									title="Load the full server catalog demo dataset"
								>
									<Server className="h-4 w-4" aria-hidden="true" />
									Load Server Catalog
								</button>
							</div>
							<span className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-soft-gray">
								Dataset · {seedSource === "server" ? "Server Catalog" : "Classic Mock"}
							</span>
						</div>
					</div>
					<SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
				</div>
			</header>

			<NavigationTabs
				activeTab={activeTab}
				setActiveTab={handleTabSelect}
				booksCount={filteredBooks.length}
				authorsCount={filteredAuthors.length}
			/>

			<main className="mx-auto w-full max-w-6xl px-6 py-10">
				{status && (
					<div
						className={`mb-6 flex items-center gap-3 rounded-xl px-5 py-4 text-sm font-medium shadow-soft ${statusBannerClass}`}
					>
						<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/70">
							<Library className="h-4 w-4" aria-hidden="true" />
						</span>
						{status.message}
					</div>
				)}

				<StatsRibbon
					books={books}
					authors={authors}
					lastSynced={connection.lastSynced}
					isSyncing={isSyncing}
				/>

				{activeTab === "books" && (
					<>
						<BookToolbar
							sortOption={bookSort}
							onSortChange={setBookSort}
							authorFilter={bookAuthorFilter}
							onAuthorFilterChange={setBookAuthorFilter}
							yearFilter={bookYearFilter}
							onYearFilterChange={setBookYearFilter}
							authors={authorOptions}
							disabled={isSyncing}
						/>
						{isLoading ? (
							<LibrarySkeleton variant="books" />
						) : filteredBooks.length > 0 ? (
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
								{filteredBooks.map((book) => {
									const author = getAuthorById(book.authorId)
									if (!author) {
										return null
									}
									return (
										<BookCard
											key={book.id ?? `${book.authorId}-${book.isbn}`}
											book={book}
											author={author}
											onEdit={beginEditBook}
											onDelete={handleDeleteBook}
											onPreview={handlePreviewBook}
										/>
									)
								})}
							</div>
						) : (
							<div className="col-span-full rounded-2xl border border-shadow-muted bg-white px-10 py-14 text-center shadow-soft">
								<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-forest-soft text-forest">
									<BookOpen className="h-8 w-8" aria-hidden="true" />
								</div>
								<h3 className="mb-2 text-2xl font-semibold text-rich-black">No books match yet</h3>
								<p className="mx-auto max-w-md text-sm text-soft-gray">
									Adjust the filters or add a fresh title to keep the shelves lively.
								</p>
								<div className="mt-6 flex justify-center">
									<button
										type="button"
										onClick={() => setActiveTab("add-book")}
										className="btn-primary"
									>
										Add a book
									</button>
								</div>
							</div>
						)}
					</>
				)}

				{activeTab === "authors" && (
					<>
						<AuthorToolbar
							sortOption={authorSort}
							onSortChange={setAuthorSort}
							disabled={isSyncing}
						/>
						{isLoading ? (
							<LibrarySkeleton variant="authors" />
						) : filteredAuthors.length > 0 ? (
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								{filteredAuthors.map((author) => {
									if (author.id == null) {
										return null
									}
									return (
										<AuthorCard
											key={author.id}
											author={author}
											bookCount={getBookCountByAuthor(author.id)}
											onEdit={beginEditAuthor}
											onDelete={handleDeleteAuthor}
											onHighlightBooks={handleHighlightAuthor}
										/>
									)
								})}
							</div>
						) : (
							<div className="col-span-full rounded-2xl border border-shadow-muted bg-white px-10 py-14 text-center shadow-soft">
								<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-forest-soft text-forest">
									<BookOpen className="h-8 w-8" aria-hidden="true" />
								</div>
								<h3 className="mb-2 text-2xl font-semibold text-rich-black">No authors match yet</h3>
								<p className="mx-auto max-w-md text-sm text-soft-gray">
									Try another filter or invite a new voice into the library.
								</p>
								<div className="mt-6 flex justify-center">
									<button
										type="button"
										onClick={() => setActiveTab("add-author")}
										className="btn-primary"
									>
										Add an author
									</button>
								</div>
							</div>
						)}
					</>
				)}

				{activeTab === "add-author" && (
					<AddAuthorForm
						mode={isEditingAuthor ? "edit" : "create"}
						initialValues={editingAuthor ?? undefined}
						onSubmit={isEditingAuthor ? handleUpdateAuthor : handleAddAuthor}
						onCancel={() => {
							setEditingAuthor(null)
							setActiveTab("authors")
						}}
						onSuccess={() => handleAuthorFormSuccess(isEditingAuthor ? "edit" : "create")}
					/>
				)}

				{activeTab === "add-book" && (
					<AddBookForm
						authors={authors}
						mode={isEditingBook ? "edit" : "create"}
						initialValues={editingBook ?? undefined}
						onSubmit={isEditingBook ? handleUpdateBook : handleAddBook}
						onCancel={() => {
							setEditingBook(null)
							setActiveTab("books")
						}}
						onSuccess={() => handleBookFormSuccess(isEditingBook ? "edit" : "create")}
					/>
				)}

				<BookDetailsModal
					book={previewBook}
					author={previewBook ? getAuthorById(previewBook.authorId) ?? null : null}
					onClose={() => setPreviewBook(null)}
				/>
			</main>
		</div>
	)
}

export default App
