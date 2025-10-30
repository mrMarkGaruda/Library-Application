# Books & Authors Library - Complete Implementation Guide

## Project Overview
You'll be building a full-stack Books & Authors Library application with React + TypeScript frontend that connects to a C# REST API backend. The application features Google Books API integration for automatic book information retrieval.

**Live Demo (Phase 1):** https://books-query.netlify.app/

**Starting Repository:** https://github.com/web-rest-api/books-app

**Inspirational Reference:** https://github.com/web-rest-api/react-query

---

## Backend API Endpoints Reference

Since you don't have access to the backend code, here are all the API endpoints you'll need:

### Base URL
```
https://[your-azure-url].azurewebsites.net/api
```

### Authors Endpoints

**GET /authors**
- Returns: `Author[]`
- Description: Retrieves all authors
- Response Example:
```json
[
  {
    "id": 1,
    "name": "Harper Lee",
    "bio": "American novelist...",
    "birthYear": 1926,
    "country": "United States"
  }
]
```

**GET /authors/{id}**
- Returns: `Author`
- Description: Retrieves single author by ID
- Response Example:
```json
{
  "id": 1,
  "name": "Harper Lee",
  "bio": "American novelist...",
  "birthYear": 1926,
  "country": "United States"
}
```

**POST /authors**
- Body: `Omit<Author, "id">`
- Returns: `Author`
- Description: Creates new author
- Request Example:
```json
{
  "name": "J.K. Rowling",
  "bio": "British author...",
  "birthYear": 1965,
  "country": "United Kingdom"
}
```

**PUT /authors/{id}**
- Body: `Omit<Author, "id">`
- Returns: `Author`
- Description: Updates existing author
- Request Example:
```json
{
  "name": "J.K. Rowling",
  "bio": "Updated bio...",
  "birthYear": 1965,
  "country": "United Kingdom"
}
```

**DELETE /authors/{id}**
- Returns: `204 No Content`
- Description: Deletes author by ID

### Books Endpoints

**GET /books**
- Returns: `Book[]`
- Description: Retrieves all books
- Response Example:
```json
[
  {
    "id": 1,
    "title": "To Kill a Mockingbird",
    "authorId": 1,
    "isbn": "9780061120084",
    "publishedYear": 1960,
    "description": "A gripping tale...",
    "coverUrl": "https://..."
  }
]
```

**GET /books/{id}**
- Returns: `Book`
- Description: Retrieves single book by ID

**POST /books**
- Body: `Omit<Book, "id">`
- Returns: `Book`
- Description: Creates new book
- Request Example:
```json
{
  "title": "Harry Potter and the Philosopher's Stone",
  "authorId": 2,
  "isbn": "9780747532699",
  "publishedYear": 1997,
  "description": "A young wizard...",
  "coverUrl": "https://covers.openlibrary.org/..."
}
```

**PUT /books/{id}**
- Body: `Omit<Book, "id">`
- Returns: `Book`
- Description: Updates existing book

**DELETE /books/{id}**
- Returns: `204 No Content`
- Description: Deletes book by ID

---

## Implementation To-Do List

### Phase 1: Project Setup & Configuration

#### Task 1.1: Fork and Clone Repository
- [ ] Fork the repository: https://github.com/web-rest-api/books-app to your GitHub account
- [ ] Clone your forked repository locally
- [ ] Run `npm install` to install dependencies
- [ ] Run `npm run dev` to verify the project runs (should show static data)
- [ ] Verify you can see the demo at localhost:5173

#### Task 1.2: Environment Configuration
- [ ] Create `.env` file in project root (add to .gitignore)
- [ ] Add the following variables:
```env
VITE_API_BASE_URL=https://[your-azure-url].azurewebsites.net/api
VITE_GOOGLE_BOOKS_API=https://www.googleapis.com/books/v1/volumes
```
- [ ] Update vite.config.ts if needed to ensure env variables are accessible

---

### Phase 2: TypeScript Types Setup

#### Task 2.1: Create Type Definitions
- [ ] Create/verify `src/types/Author.ts`:
```typescript
export type Author = {
  id?: number
  name: string
  bio: string
  birthYear: number
  country: string
}
```

- [ ] Create/verify `src/types/Book.ts`:
```typescript
export type Book = {
  id?: number
  title: string
  authorId: number
  isbn: string
  publishedYear: number
  description: string
  coverUrl: string
  // Optional fields for Google Books integration
  thumbnail?: string
  publishedDate?: string
  author?: string | null
}
```

- [ ] Create `src/types/GoogleBook.ts`:
```typescript
export interface GoogleBookResponse {
  items?: GoogleBookItem[]
  totalItems: number
}

export interface GoogleBookItem {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    publishedDate?: string
    description?: string
    industryIdentifiers?: {
      type: string
      identifier: string
    }[]
    imageLinks?: {
      thumbnail?: string
      smallThumbnail?: string
    }
  }
}
```

---

### Phase 3: Service Layer Implementation

#### Task 3.1: Create Authors Service
- [ ] Create `src/services/authorsService.ts`
- [ ] Implement the following functions:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const authorsService = {
  // Get all authors
  getAllAuthors: async (): Promise<Author[]> => {
    const response = await fetch(`${API_BASE_URL}/authors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch authors: ${response.status}`)
    }
    
    return response.json()
  },

  // Get single author by ID
  getAuthorById: async (id: number): Promise<Author> => {
    const response = await fetch(`${API_BASE_URL}/authors/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch author: ${response.status}`)
    }
    
    return response.json()
  },

  // Create new author
  createAuthor: async (author: Omit<Author, "id">): Promise<Author> => {
    const response = await fetch(`${API_BASE_URL}/authors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(author),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to create author: ${response.status}`)
    }
    
    return response.json()
  },

  // Update existing author
  updateAuthor: async (id: number, author: Omit<Author, "id">): Promise<Author> => {
    const response = await fetch(`${API_BASE_URL}/authors/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(author),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to update author: ${response.status}`)
    }
    
    return response.json()
  },

  // Delete author
  deleteAuthor: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/authors/${id}`, {
      method: "DELETE",
    })
    
    if (!response.ok) {
      throw new Error(`Failed to delete author: ${response.status}`)
    }
  },
}
```

#### Task 3.2: Create Books Service
- [ ] Create `src/services/booksService.ts`
- [ ] Implement similar CRUD functions for books (getAllBooks, getBookById, createBook, updateBook, deleteBook)
- [ ] Follow the same pattern as authorsService but use `/books` endpoints
- [ ] Ensure proper TypeScript typing with `Book` type

#### Task 3.3: Create Google Books Service
- [ ] Create `src/services/googleBooksService.ts`
- [ ] Implement book search functionality:

```typescript
const GOOGLE_BOOKS_API = import.meta.env.VITE_GOOGLE_BOOKS_API

// Transform Google Book data to our Book type
const transformGoogleBook = (item: GoogleBookItem): Book => {
  const volumeInfo = item.volumeInfo
  
  // Extract ISBN (prefer ISBN_13, fallback to ISBN_10)
  const isbn13 = volumeInfo.industryIdentifiers?.find(
    (id) => id.type === "ISBN_13"
  )
  const isbn10 = volumeInfo.industryIdentifiers?.find(
    (id) => id.type === "ISBN_10"
  )
  const isbn = isbn13?.identifier || isbn10?.identifier || ""
  
  return {
    id: 0, // Temporary ID
    title: volumeInfo.title || "",
    authorId: 0, // Will be set later
    isbn: isbn,
    publishedYear: volumeInfo.publishedDate 
      ? parseInt(volumeInfo.publishedDate.substring(0, 4)) 
      : 0,
    description: volumeInfo.description || "",
    coverUrl: volumeInfo.imageLinks?.thumbnail || "",
    // Additional fields for display
    thumbnail: volumeInfo.imageLinks?.thumbnail,
    publishedDate: volumeInfo.publishedDate,
    author: volumeInfo.authors?.[0] || "Unknown Author",
  }
}

export const searchBooksByTitle = async (title: string): Promise<Book[]> => {
  try {
    const params = new URLSearchParams({
      q: `intitle:${title}`,
      country: "US",
      maxResults: "40",
    })

    const response = await fetch(`${GOOGLE_BOOKS_API}?${params}`)

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data: GoogleBookResponse = await response.json()

    if (!data.items || data.items.length === 0) {
      return []
    }

    return data.items.map(transformGoogleBook)
  } catch (error) {
    console.error("Error fetching books from Google Books API:", error)
    return []
  }
}
```

---

### Phase 4: Component Integration

#### Task 4.1: Update App.tsx for Real Data
- [ ] Remove static data imports (`staticAuthors`, `staticBooks`)
- [ ] Add proper state management:
```typescript
const [authors, setAuthors] = useState<Author[]>([])
const [books, setBooks] = useState<Book[]>([])
const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
```

- [ ] Create data fetching functions:
```typescript
const fetchAuthors = async () => {
  try {
    const data = await authorsService.getAllAuthors()
    setAuthors(data)
  } catch (error) {
    console.error("Failed to fetch authors:", error)
    setError("Failed to load authors")
  }
}

const fetchBooks = async () => {
  try {
    const data = await booksService.getAllBooks()
    setBooks(data)
  } catch (error) {
    console.error("Failed to fetch books:", error)
    setError("Failed to load books")
  }
}
```

- [ ] Add useEffect to fetch data on mount:
```typescript
useEffect(() => {
  const loadData = async () => {
    setIsLoading(true)
    await Promise.all([fetchAuthors(), fetchBooks()])
    setIsLoading(false)
  }
  
  loadData()
}, [])
```

- [ ] Add loading and error states to JSX
- [ ] Update CRUD handlers to use service functions instead of state manipulation

#### Task 4.2: Create BookSearchResults Component
- [ ] Create `src/components/BookSearchResults.tsx`
- [ ] Define props interface:
```typescript
interface BookSearchResultsProps {
  searchResults: Book[]
  authors: Author[]
  onSelectBook: (book: Book) => void
  onClearResults: () => void
}
```

- [ ] Implement component to display Google Books search results
- [ ] Show book thumbnail, title, author, published date, and ISBN
- [ ] Highlight books with no ISBN ("No ISBN available" in red)
- [ ] Make results clickable to auto-fill form
- [ ] Add "Clear Results" button

#### Task 4.3: Update Add Book Form
- [ ] Add new state variables:
```typescript
const [searchResults, setSearchResults] = useState<Book[]>([])
const [isSearching, setIsSearching] = useState(false)
const [isbnNotFound, setIsbnNotFound] = useState(false)
```

- [ ] Update handleChange to trigger Google Books search:
```typescript
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target

  setFormData((prev) => ({
    ...prev,
    [name]: name === "authorId" || name === "publishedYear"
      ? parseInt(value) || 0
      : value,
  }))

  // Clear errors
  if (errors[name as keyof Book]) {
    setErrors((prev) => ({ ...prev, [name]: "" }))
    setIsbnNotFound(false)
  }

  // Search for books by title
  if (name === "title" && value.length > 2) {
    setIsSearching(true)
    searchBooksByTitle(value)
      .then((books) => {
        setSearchResults(books)
      })
      .catch((error) => {
        console.error("Error searching books:", error)
        setSearchResults([])
      })
      .finally(() => {
        setIsSearching(false)
      })
  } else if (name === "title" && value.length <= 2) {
    setSearchResults([])
  }
}
```

- [ ] Create handleSetBook function to auto-fill form when book is selected:
```typescript
const handleSetBook = (book: Book) => {
  setFormData((prev) => ({
    ...prev,
    title: book.title,
    description: book.description || prev.description,
    coverUrl: book.thumbnail || prev.coverUrl,
    publishedYear: book.publishedDate
      ? parseInt(book.publishedDate.substring(0, 4))
      : prev.publishedYear,
    isbn: book.isbn || prev.isbn,
  }))
  
  // Check if author exists in authors list
  const foundAuthor = authors.find((author) => author.name === book.author)
  
  if (!foundAuthor) {
    setErrors({
      authorId: "No author found for this book. Please select manually.",
    })
  } else {
    setFormData((prev) => ({
      ...prev,
      authorId: foundAuthor.id || 0,
    }))
  }
  
  // Clear search results
  setSearchResults([])
}
```

- [ ] Add BookSearchResults component below title input
- [ ] Show loading indicator while searching

#### Task 4.4: Update Book Creation Handler
- [ ] Modify handleAddBook to use booksService.createBook():
```typescript
const handleAddBook = async (e: React.FormEvent) => {
  e.preventDefault()
  
  // Validation
  const newErrors: Partial<Record<keyof Book, string>> = {}
  
  if (!formData.title) newErrors.title = "Title is required"
  if (!formData.authorId) newErrors.authorId = "Author is required"
  if (!formData.isbn) newErrors.isbn = "ISBN is required"
  if (!formData.publishedYear) newErrors.publishedYear = "Year is required"
  
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    return
  }
  
  try {
    const newBook = await booksService.createBook({
      title: formData.title,
      authorId: formData.authorId,
      isbn: formData.isbn,
      publishedYear: formData.publishedYear,
      description: formData.description,
      coverUrl: formData.coverUrl,
    })
    
    // Update local state
    setBooks((prev) => [...prev, newBook])
    
    // Reset form
    setFormData({
      title: "",
      authorId: 0,
      isbn: "",
      publishedYear: new Date().getFullYear(),
      description: "",
      coverUrl: "",
    })
    setErrors({})
    
    // Switch to books tab
    setActiveTab("books")
  } catch (error) {
    console.error("Failed to create book:", error)
    setErrors({ title: "Failed to create book. Please try again." })
  }
}
```

#### Task 4.5: Update Author Creation Handler
- [ ] Modify handleAddAuthor to use authorsService.createAuthor()
- [ ] Follow similar pattern as handleAddBook
- [ ] Update local authors state after successful creation
- [ ] Add proper error handling

#### Task 4.6: Implement Delete Handlers
- [ ] Create handleDeleteBook function:
```typescript
const handleDeleteBook = async (id: number) => {
  if (!confirm("Are you sure you want to delete this book?")) return
  
  try {
    await booksService.deleteBook(id)
    setBooks((prev) => prev.filter((book) => book.id !== id))
  } catch (error) {
    console.error("Failed to delete book:", error)
    alert("Failed to delete book. Please try again.")
  }
}
```

- [ ] Create handleDeleteAuthor function (similar pattern)
- [ ] Pass these handlers to BookCard and AuthorCard components
- [ ] Update components to call handlers on delete button click

---

### Phase 5: Error Handling & Loading States

#### Task 5.1: Add Loading Indicators
- [ ] Create loading spinner component or use existing one
- [ ] Show loading state while fetching initial data
- [ ] Show loading state while searching Google Books
- [ ] Show loading state during create/update/delete operations

#### Task 5.2: Implement Error Boundaries
- [ ] Add error messages for failed API calls
- [ ] Show user-friendly error messages
- [ ] Add retry functionality for failed requests
- [ ] Handle network errors gracefully

#### Task 5.3: Form Validation
- [ ] Ensure all required fields are validated before submission
- [ ] Show inline error messages
- [ ] Highlight invalid fields with red borders
- [ ] Clear errors when user starts typing

---

### Phase 6: Static Mode Implementation (Azure Workaround)

Since the Azure server spins down and you want a more static experience:

#### Task 6.1: Create Mock Data Fallback
- [ ] Create `src/mockData/fallbackData.ts`:
```typescript
export const fallbackAuthors: Author[] = [
  {
    id: 1,
    name: "Harper Lee",
    bio: "American novelist best known for To Kill a Mockingbird",
    birthYear: 1926,
    country: "United States"
  },
  // Add more fallback authors
]

export const fallbackBooks: Book[] = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    authorId: 1,
    isbn: "9780061120084",
    publishedYear: 1960,
    description: "A gripping tale of racial injustice...",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg"
  },
  // Add more fallback books
]
```

#### Task 6.2: Implement Hybrid Mode
- [ ] Update App.tsx to try API first, fallback to mock data:
```typescript
useEffect(() => {
  const loadData = async () => {
    setIsLoading(true)
    
    try {
      // Try to fetch from API with timeout
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      )
      
      const authorsPromise = authorsService.getAllAuthors()
      const booksPromise = booksService.getAllBooks()
      
      const [authorsData, booksData] = await Promise.race([
        Promise.all([authorsPromise, booksPromise]),
        timeout
      ]) as [Author[], Book[]]
      
      setAuthors(authorsData)
      setBooks(booksData)
      setIsUsingFallback(false)
    } catch (error) {
      console.warn("API unavailable, using fallback data:", error)
      setAuthors(fallbackAuthors)
      setBooks(fallbackBooks)
      setIsUsingFallback(true)
    } finally {
      setIsLoading(false)
    }
  }
  
  loadData()
}, [])
```

#### Task 6.3: Local Storage Persistence
- [ ] Add localStorage to persist user-created data:
```typescript
// Save to localStorage after any create/update/delete
const saveToLocalStorage = () => {
  localStorage.setItem('books', JSON.stringify(books))
  localStorage.setItem('authors', JSON.stringify(authors))
}

// Load from localStorage on mount
const loadFromLocalStorage = () => {
  const savedBooks = localStorage.getItem('books')
  const savedAuthors = localStorage.getItem('authors')
  
  if (savedBooks) setBooks(JSON.parse(savedBooks))
  if (savedAuthors) setAuthors(JSON.parse(savedAuthors))
}
```

- [ ] Call saveToLocalStorage after every state update
- [ ] Load from localStorage before attempting API calls
- [ ] Add "Clear Local Data" button for testing

#### Task 6.4: Add Mode Indicator
- [ ] Show badge indicating current mode:
```typescript
{isUsingFallback && (
  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
    <p>📡 Running in offline mode with demo data</p>
  </div>
)}
```

---

### Phase 7: Testing & Refinement

#### Task 7.1: Test All CRUD Operations
- [ ] Test creating new authors
- [ ] Test creating new books
- [ ] Test updating authors
- [ ] Test updating books
- [ ] Test deleting authors
- [ ] Test deleting books
- [ ] Verify data persistence

#### Task 7.2: Test Google Books Integration
- [ ] Search for various book titles
- [ ] Verify thumbnail images load correctly
- [ ] Test auto-fill functionality
- [ ] Test author matching logic
- [ ] Handle books without ISBN
- [ ] Handle books with no matching author

#### Task 7.3: Test Edge Cases
- [ ] Empty search results
- [ ] API timeouts
- [ ] Network errors
- [ ] Invalid form submissions
- [ ] Duplicate ISBNs
- [ ] Special characters in titles/names

#### Task 7.4: Browser Testing
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test responsive design on mobile
- [ ] Verify localStorage works across browsers

---

### Phase 8: Deployment

#### Task 8.1: Prepare for Deployment
- [ ] Update .env.production with production API URL
- [ ] Remove console.log statements
- [ ] Optimize images if any
- [ ] Run `npm run build` to ensure build succeeds
- [ ] Test production build locally: `npm run preview`

#### Task 8.2: Deploy to Netlify
- [ ] Log in to Netlify (https://app.netlify.com)
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Connect your GitHub repository
- [ ] Configure build settings:
  - Build command: `npm run build`
  - Publish directory: `dist`
- [ ] Add environment variables in Netlify dashboard
- [ ] Deploy site

#### Task 8.3: Post-Deployment
- [ ] Test deployed site thoroughly
- [ ] Verify all features work in production
- [ ] Check browser console for errors
- [ ] Test on mobile devices
- [ ] Share deployment URL

---

## Important Technical Notes

### API Headers
All API requests should include:
```typescript
headers: {
  "Content-Type": "application/json"
}
```

### Error Response Format
The backend returns errors in this format:
```json
{
  "message": "Error description",
  "statusCode": 400
}
```

### CORS
The backend should have CORS enabled. If you encounter CORS errors, the backend configuration needs updating.

### Rate Limiting
Google Books API may rate limit requests. Implement debouncing on search input (wait 300ms after user stops typing).

### ISBN Validation
ISBNs can be 10 or 13 digits. The Google Books API prefers ISBN-13.

### Image URLs
Google Books returns HTTP URLs. You may need to replace `http://` with `https://` for the images to load properly.

---

## Submission Requirements

Once complete, provide:
1. **GitHub Repository URL** - Your forked repo with all changes
2. **Netlify Deployment URL** - Live deployed application
3. **Brief README** - Document any issues encountered and how static mode works

---

## Troubleshooting Guide

**Problem:** API returns 404  
**Solution:** Verify API_BASE_URL is correct, check Azure server is running

**Problem:** Google Books search returns no results  
**Solution:** Check query format, verify API URL, try different search terms

**Problem:** Images not loading  
**Solution:** Check CORS, verify image URLs use HTTPS, add error handling for broken images

**Problem:** TypeScript errors  
**Solution:** Ensure all types are properly imported, check for missing optional chaining

**Problem:** State not updating  
**Solution:** Verify you're using functional state updates, check for mutation bugs

**Problem:** localStorage not persisting  
**Solution:** Check browser privacy settings, verify JSON serialization, check for quota exceeded errors

---

## Success Criteria

✅ Application loads and displays fallback data if API is unavailable  
✅ Can create, read, update, and delete authors  
✅ Can create, read, update, and delete books  
✅ Google Books search returns relevant results  
✅ Clicking a search result auto-fills the form  
✅ Form validation works correctly  
✅ Loading states are shown during async operations  
✅ Error messages are user-friendly  
✅ Application is deployed and accessible via Netlify  
✅ Code is clean, typed, and follows React best practices

---

Good luck with your implementation! 🚀