# Books & Authors Library - UX/UI Design System & Brand Guidelines

## Project Vision

Create a digital sanctuary for book lovers - a cozy, minimal, and modern library experience that feels like curling up in your favorite reading nook. The application should evoke the warmth of a personal library while maintaining the clean efficiency of modern web design.

---

## Target Audience

### Primary Users
- **Book Enthusiasts (25-45 years old)**
  - Passionate readers who want to catalog their personal collections
  - Value organization and discovery
  - Appreciate thoughtful design and attention to detail
  - Tech-comfortable but prioritize usability over complexity

- **Librarians & Educators**
  - Need efficient book management tools
  - Require clear, scannable information architecture
  - Value accessibility and clarity

- **Book Collectors**
  - Curate personal libraries
  - Care about book metadata and cover art
  - Appreciate visual presentation

### User Personas

**"Sarah the Curator"** - 32, Marketing Manager
- Has 200+ books at home, wants to track what she owns
- Uses Goodreads but wants something more personal and visual
- Values: Beautiful design, quick entry, cover art display
- Pain points: Duplicate purchases, forgetting what she owns

**"David the Academic"** - 41, University Professor  
- Manages 500+ research books and references
- Needs to organize by author and quickly find titles
- Values: Search functionality, author bios, efficiency
- Pain points: Time wasted searching, poor categorization

---

## Brand Personality

### Core Attributes
- **Warm** - Inviting like a personal library
- **Intelligent** - Sophisticated but not pretentious
- **Calm** - Uncluttered and peaceful
- **Trustworthy** - Reliable and well-organized
- **Timeless** - Classic design that won't feel dated

### Design Principles
1. **Breathing Room** - Generous whitespace, never cramped
2. **Content First** - Books and authors are the heroes
3. **Gentle Hierarchy** - Clear but not aggressive
4. **Tactile Quality** - Feels physical despite being digital
5. **Progressive Disclosure** - Show what's needed, hide complexity

---

## Color Palette

### Primary Colors

**Warm Neutral Base**
```
Background Cream: #FAF9F6 (warm white, like aged paper)
Card White: #FFFFFF (pure white for contrast)
Soft Shadow: #E8E6E3 (subtle depth)
```

**Library Accent Colors**
```
Deep Forest: #2C5F4F (primary accent - like old leather bindings)
Sage Green: #8BA888 (secondary - calming, natural)
Warm Terracotta: #C97C5D (tertiary - inviting warmth)
```

**Text Hierarchy**
```
Rich Black: #1A1A1A (primary text - high contrast)
Charcoal: #4A4A4A (secondary text - body copy)
Soft Gray: #8B8B8B (tertiary text - metadata, hints)
```

**Semantic Colors**
```
Success Green: #4A8B6C (confirmations, success states)
Warning Amber: #D4A574 (alerts, missing info)
Error Burgundy: #A3504F (errors, deletions)
Info Blue: #5B7C99 (informational messages)
```

### Color Usage Guidelines

**Backgrounds**
- Main app background: Cream (#FAF9F6)
- Cards/panels: White (#FFFFFF)
- Hover states: Very light sage (#F2F5F3)
- Active tabs: Deep Forest with 10% opacity

**Buttons**
- Primary CTA: Deep Forest (#2C5F4F)
- Secondary: Sage Green (#8BA888)
- Destructive: Error Burgundy (#A3504F)
- Ghost buttons: Transparent with Deep Forest border

**Accents**
- Links: Deep Forest, underline on hover
- Icons: Charcoal, Deep Forest on hover
- Dividers: Soft Shadow (#E8E6E3)
- Focus rings: Sage Green

---

## Typography

### Font Families

**Headings & Display**
```
Primary: 'Crimson Pro' or 'Libre Baskerville'
Style: Serif, elegant, literary
Usage: Page titles, book titles, section headers
Weights: 400 (regular), 600 (semibold), 700 (bold)
```

**Body & Interface**
```
Primary: 'Inter' or 'DM Sans'
Style: Sans-serif, clean, highly readable
Usage: Body text, form labels, buttons, metadata
Weights: 400 (regular), 500 (medium), 600 (semibold)
```

**Monospace (Optional)**
```
Accent: 'IBM Plex Mono'
Usage: ISBN numbers, dates, technical data
Weight: 400 (regular)
```

### Type Scale

```
Hero/H1: 48px / 3rem (Crimson Pro Bold)
H2: 36px / 2.25rem (Crimson Pro Semibold)
H3: 28px / 1.75rem (Crimson Pro Semibold)
H4: 24px / 1.5rem (Crimson Pro Regular)
H5: 20px / 1.25rem (Inter Semibold)
Body Large: 18px / 1.125rem (Inter Regular)
Body: 16px / 1rem (Inter Regular)
Body Small: 14px / 0.875rem (Inter Regular)
Caption: 12px / 0.75rem (Inter Medium)
```

### Line Heights
- Headings: 1.2 (tight, elegant)
- Body text: 1.6 (comfortable reading)
- UI elements: 1.4 (compact but readable)

### Letter Spacing
- Headings: -0.02em (slightly tighter)
- Body: 0 (default)
- Uppercase labels: 0.05em (more spacious)
- Buttons: 0.01em (subtle)

---

## Layout & Spacing

### Grid System
- **Desktop**: 12-column grid with 24px gutters
- **Tablet**: 8-column grid with 20px gutters  
- **Mobile**: 4-column grid with 16px gutters

### Spacing Scale (8px base)
```
3xs: 4px   - Icon padding, tight spacing
2xs: 8px   - Input padding vertical
xs: 12px   - Between related elements
sm: 16px   - Standard gap between elements
md: 24px   - Section spacing
lg: 32px   - Major section breaks
xl: 48px   - Page section spacing
2xl: 64px  - Hero spacing
3xl: 96px  - Major page divisions
```

### Container Widths
```
Max content width: 1400px
Comfortable reading: 1200px
Form max width: 720px
Card grid: 1280px
Sidebar: 280px - 320px
```

### Border Radius
```
Small: 4px (inputs, small buttons)
Medium: 8px (cards, buttons)
Large: 12px (modals, large cards)
X-Large: 16px (hero sections, images)
Round: 50% (avatars, icon buttons)
```

---

## Component Design Specifications

### Navigation Header

**Layout**
- Fixed position at top
- Height: 72px
- Background: Warm Cream with subtle shadow
- Centered content, max-width 1400px

**Elements**
- Logo/Title: Left-aligned, Crimson Pro 28px
- Search bar: Center-weighted, 480px max width
- User actions: Right-aligned

**Search Bar Style**
- Background: White
- Border: 1px solid Soft Shadow
- Border radius: 24px (pill shape)
- Padding: 12px 20px
- Icon: Left-aligned, Soft Gray
- Placeholder: "Search books or authors..."
- Focus: Border changes to Sage Green, subtle glow

### Tab Navigation

**Style: Refined Underline Tabs**
- Container: Border-bottom 1px Soft Shadow
- Tab items: Inline, 16px gap between
- Text: Inter Semibold 15px
- Padding: 16px 24px
- Inactive: Charcoal color
- Active: Deep Forest color, 3px bottom border
- Hover: Sage Green tint to text

**Layout**
```
[Books (156)] [Authors (24)] [Add Book] [Add Author]
─────────────   ─────────   ─────────   ──────────
     │
  Active
```

### Book Cards

**Grid Layout**
- Desktop: 4 columns
- Tablet: 3 columns
- Mobile: 1-2 columns
- Gap: 24px

**Card Design**
```
┌─────────────────────────┐
│  [Cover Image]          │ ← 2:3 aspect ratio
│                         │
├─────────────────────────┤
│ Book Title              │ ← Crimson Pro 20px
│ by Author Name          │ ← Inter 14px, Gray
│                         │
│ "Brief description..."  │ ← Inter 14px, 2 lines
│                         │
│ Published: 1960         │ ← Inter 12px, Gray
│ ISBN: 978...            │
│                         │
│ [View] [Edit] [Delete]  │ ← Action buttons
└─────────────────────────┘
```

**Visual Details**
- Background: White
- Border: 1px Soft Shadow
- Border radius: 12px
- Padding: 0 (image edge-to-edge), 20px (content)
- Hover: Subtle lift (translateY: -4px), shadow increase
- Transition: all 0.3s ease

**Cover Image**
- Aspect ratio: 2:3 (book proportions)
- Object-fit: cover
- Border-radius: 12px 12px 0 0
- Fallback: Gradient with book icon

**Action Buttons**
- Style: Ghost buttons
- Size: 32px height, auto width
- Icon + text or icon only
- Color: Charcoal → Deep Forest on hover
- Spacing: 8px gap between

### Author Cards

**Alternative Design: Horizontal Cards**
```
┌─────────────────────────────────────────────┐
│ [Avatar] Author Name             [Edit] [×] │
│ (80px)   ─────────────                      │
│          Country, Born: 1926                │
│                                             │
│          "Brief biography text that wraps   │
│          to multiple lines if needed..."    │
│                                             │
│          📚 12 books in library             │
└─────────────────────────────────────────────┘
```

**Visual Details**
- Background: White
- Border: 1px Soft Shadow  
- Border-radius: 12px
- Padding: 24px
- Hover: Border changes to Sage Green
- Avatar: 80px circle, generated gradient if no photo

### Forms (Add/Edit Book & Author)

**Container**
- Max width: 720px
- Centered on page
- Background: White
- Padding: 48px
- Border-radius: 16px
- Box shadow: Soft, elevated

**Form Layout**
- Single column
- Labels above inputs
- 24px gap between fields
- Grouped related fields

**Input Fields**
```
Label
─────────────────────────
[Input field           ]
Helper text or error
```

**Input Style**
- Height: 44px
- Border: 1.5px solid Soft Shadow
- Border-radius: 8px
- Padding: 12px 16px
- Font: Inter 15px
- Focus: Border → Sage Green, subtle glow
- Error: Border → Error Burgundy, red glow
- Disabled: Background → lightest gray, cursor not-allowed

**Textarea**
- Min height: 120px
- Resizable vertically
- Same style as inputs

**Select Dropdown**
- Same style as inputs
- Chevron icon: right-aligned
- Dropdown: White background, shadow, 8px radius
- Options: 40px height, hover background

**Buttons**
- Height: 44px
- Padding: 12px 24px
- Border-radius: 8px
- Font: Inter Semibold 15px
- Transition: all 0.2s ease

**Primary Button**
- Background: Deep Forest
- Color: White
- Hover: Darken 10%, lift 1px
- Active: Scale 0.98

**Secondary Button**
- Background: Transparent
- Border: 1.5px solid Deep Forest
- Color: Deep Forest
- Hover: Background → lightest forest tint

**Destructive Button**
- Background: Transparent
- Border: 1.5px solid Error Burgundy
- Color: Error Burgundy
- Hover: Background → Error Burgundy, Color → White

### Google Books Search Results

**Dropdown Design**
- Appears below title input
- Max height: 400px
- Overflow: auto scroll
- Background: White
- Border: 1px Sage Green
- Border-radius: 12px
- Box shadow: Elevated
- Animation: Slide down + fade in

**Result Item**
```
┌────────────────────────────────────────┐
│ [Thumb] Book Title                     │
│ (48px)  by Author Name                 │
│         2007 · ISBN: 978...            │
│         [No ISBN available]  ← Red     │
└────────────────────────────────────────┘
```

**Item Style**
- Padding: 12px 16px
- Border-bottom: 1px Soft Shadow (except last)
- Hover: Background → lightest sage
- Cursor: pointer
- Transition: background 0.15s ease

**Loading State**
- Skeleton screen with pulse animation
- Soft gray placeholders
- Smooth 1.5s pulse

**Empty State**
- Centered icon (search with magnifying glass)
- Text: "No books found. Try a different search."
- Color: Soft Gray
- Padding: 48px

---

## Micro-interactions & Animations

### General Principles
- **Duration**: 150-300ms (quick but noticeable)
- **Easing**: ease-out for entrances, ease-in for exits
- **Subtlety**: Enhance, don't distract
- **Performance**: Use transforms and opacity only

### Specific Animations

**Card Hover**
```css
transition: transform 0.3s ease, box-shadow 0.3s ease;
hover: {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.08);
}
```

**Button Press**
```css
transition: transform 0.15s ease;
active: {
  transform: scale(0.98);
}
```

**Modal Entry**
```css
Backdrop: fade in 0.2s
Modal: scale(0.95) → scale(1), fade in 0.3s ease-out
```

**Form Field Focus**
```css
transition: border-color 0.2s ease, box-shadow 0.2s ease;
focus: {
  border-color: Sage Green;
  box-shadow: 0 0 0 3px rgba(139, 168, 136, 0.1);
}
```

**Search Results Dropdown**
```css
Entry: 
  opacity: 0 → 1 (0.2s)
  transform: translateY(-8px) → translateY(0) (0.3s ease-out)
```

**Loading Spinner**
```css
Border spinner, 32px diameter
Color: Deep Forest
Animation: 0.8s linear infinite rotation
```

**Success Feedback**
```css
Checkmark icon: 
  Scale 0 → 1.2 → 1 (0.4s ease-out)
  Green pulse (0.5s)
Toast notification:
  Slide in from top (0.3s ease-out)
  Auto-dismiss after 3s
```

**Delete Confirmation**
```css
Item: 
  Fade out (0.3s)
  Slide left + shrink height (0.3s ease-in)
Adjacent items: 
  Smoothly collapse gap (0.3s ease-out)
```

---

## Responsive Behavior

### Breakpoints
```
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
Large Desktop: > 1440px
```

### Mobile Adaptations (< 640px)

**Navigation**
- Header height: 64px
- Search: Full-width button → expands to overlay
- Tabs: Horizontal scroll with fade indicators
- Hamburger menu for secondary actions

**Book Cards**
- Single column (or 2 columns for larger phones)
- Smaller images (maintain 2:3 ratio)
- Condensed metadata
- Action buttons: Icon-only or single row

**Forms**
- Padding: 24px (reduced from 48px)
- Full-width on mobile
- Stacked button groups

**Author Cards**
- Avatar reduces to 60px
- Stacked layout (avatar above content)

**Search Results**
- Slightly smaller thumbnails (40px)
- Truncate long titles with ellipsis

### Tablet Adaptations (640px - 1024px)

**Book Grid**
- 3 columns
- Maintain hover effects

**Forms**
- Max width: 600px
- Maintain two-column for some fields (year + ISBN)

**Navigation**
- Full tab bar visible
- Maintain search in header

### Touch Targets
- Minimum: 44x44px for all interactive elements
- Spacing: 8px minimum between touch targets
- Buttons: Slightly larger on mobile (48px height)

---

## Iconography

### Style Guide
- **Style**: Outline/Stroke icons
- **Weight**: 1.5px - 2px stroke
- **Size**: 20px standard, 24px for prominent actions
- **Color**: Inherit from parent (Charcoal default)
- **Library**: Lucide React or Heroicons

### Key Icons Needed

**Navigation & Actions**
- Book Open (library logo)
- Search (magnifying glass)
- Plus Circle (add new)
- Edit (pencil)
- Trash (delete)
- X (close)
- Check (confirm)

**Book & Author**
- Book (generic book)
- User Circle (author avatar)
- Calendar (publication date)
- Hash (ISBN)
- Globe (country)
- Quote (description)

**States**
- Loading (spinner)
- Alert Triangle (warning)
- Alert Circle (info)
- Check Circle (success)
- X Circle (error)

**Usage Examples**
```jsx
// Consistent sizing
<BookIcon size={20} strokeWidth={1.5} />

// Color inheritance
<EditIcon className="text-charcoal hover:text-forest" />

// Accessibility
<PlusIcon aria-hidden="true" />
<span className="sr-only">Add new book</span>
```

---

## States & Feedback

### Loading States

**Initial Page Load**
- Full-page skeleton screen
- Pulsing book card placeholders (6-8 cards)
- Pulsing header elements
- Background: Cream
- Skeleton color: Soft Shadow

**Inline Loading**
- Spinner next to action (e.g., "Saving...")
- Disabled button state
- Subtle opacity reduction

**Search Loading**
- Spinner inside search input (right side)
- "Searching..." text in results area
- Maintain dropdown open

### Empty States

**No Books**
```
┌─────────────────────────────┐
│                             │
│        [Book Icon]          │ ← Large, Soft Gray
│                             │
│    No books in library      │ ← H3, Charcoal
│                             │
│ Add your first book to get  │ ← Body, Soft Gray
│         started             │
│                             │
│      [Add Book Button]      │ ← Primary CTA
│                             │
└─────────────────────────────┘
```

**No Authors**
- Similar layout
- User icon instead
- "No authors yet" heading
- [Add Author] button

**No Search Results**
- Smaller, centered
- Search icon with X
- "No results for '[query]'"
- "Try different keywords" hint

### Error States

**Form Validation Errors**
- Red border on invalid field
- Error text below field (Error Burgundy)
- Icon: Alert Circle
- Example: "ISBN is required"

**API Errors**
- Toast notification (top-center)
- Background: Error Burgundy
- White text with icon
- Auto-dismiss: 5 seconds
- Manual close: X button

**Network Error**
```
┌─────────────────────────────┐
│     [Connection Icon]       │
│                             │
│  Couldn't load content      │
│                             │
│  Check your connection and  │
│  try again                  │
│                             │
│      [Retry Button]         │
└─────────────────────────────┘
```

### Success States

**Book Added**
- Green checkmark animation
- Toast: "Book added successfully"
- Auto-navigate to Books tab
- New card highlighted briefly (green glow)

**Author Added**  
- Similar pattern
- Navigate to Authors tab

**Edit Saved**
- Toast: "Changes saved"
- Checkmark icon
- Subtle green flash on card

**Delete Confirmed**
- Smooth removal animation
- Toast: "Deleted successfully"

---

## Accessibility Requirements

### Color Contrast
- Text on background: Minimum 4.5:1 (WCAG AA)
- Large text (18px+): Minimum 3:1
- Interactive elements: 3:1 against background
- Test all color combinations

### Keyboard Navigation
- All interactive elements tabbable
- Visible focus indicators (Sage Green ring)
- Skip to main content link
- Logical tab order
- Enter/Space for buttons
- Escape to close modals/dropdowns

### Screen Readers
- Semantic HTML (header, nav, main, section)
- ARIA labels for icons
- Alt text for images
- Form labels properly associated
- Error messages announced
- Loading states announced
- Success/failure feedback announced

### Focus Management
- Focus trap in modals
- Return focus after modal close
- Focus on first field in forms
- Focus on error messages when validation fails

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## User Flows

### Primary Flow: Adding a Book

1. **Entry Point**: Click "Add Book" tab
   - Form appears with focus on title input
   - Clean, empty state

2. **Search & Select**: Type book title
   - After 3 characters, Google results appear
   - Results animate in smoothly
   - Loading indicator while searching

3. **Auto-fill**: Click search result
   - Form fields populate with animation
   - Author checked against database
   - Warning if author not found
   - Image preview appears

4. **Review & Submit**: Fill remaining fields
   - Validation on blur
   - Real-time error messages
   - Submit button enabled when valid

5. **Confirmation**: Book created
   - Success message
   - Smooth transition to Books tab
   - New book highlighted briefly
   - Scroll to new card if needed

### Secondary Flow: Browsing & Searching

1. **Landing**: Books tab active by default
   - Grid loads with animation
   - Books displayed with cover art

2. **Search**: Type in header search
   - Instant filter (debounced)
   - Results update smoothly
   - Count updates in tab label

3. **View Details**: Click book card
   - Card expands or modal opens
   - Full description visible
   - Author link clickable

4. **Navigate to Author**: Click author name
   - Switch to Authors tab
   - Author card highlighted
   - Smooth scroll if needed

### Tertiary Flow: Editing & Deleting

1. **Edit**: Click edit button on card
   - Form opens in modal or new view
   - Fields pre-populated
   - Changes highlighted

2. **Save**: Submit form
   - Validation runs
   - Loading indicator
   - Success message
   - Card updates in place

3. **Delete**: Click delete button
   - Confirmation modal appears
   - Clear warning message
   - Confirm or cancel

4. **Deletion**: Confirm delete
   - Card animates out
   - Gap collapses smoothly
   - Success toast
   - Count updates

---

## Modal & Overlay Patterns

### Modal Structure
```
[Dark Backdrop - 60% opacity]
        │
        ▼
  ┌─────────────┐
  │ Modal       │ ← Centered, elevated
  │             │
  │  [Content]  │
  │             │
  │ [Actions]   │
  └─────────────┘
```

### Modal Specs
- Max width: 600px (forms), 900px (content)
- Background: White
- Border-radius: 16px
- Padding: 32px
- Shadow: Large, soft
- Backdrop: #1A1A1A at 60% opacity

### Confirmation Modal
```
┌──────────────────────────────┐
│ [X]                          │ ← Close button
│                              │
│ Are you sure?                │ ← H3
│                              │
│ This will permanently delete │ ← Body
│ "[Item Name]". This action   │
│ cannot be undone.            │
│                              │
│  [Cancel]  [Delete Forever]  │ ← Buttons
└──────────────────────────────┘
```

- Delete button: Error Burgundy
- Cancel button: Secondary style
- Escape key closes without action
- Click outside closes without action

---

## Performance Considerations

### Image Optimization
- Lazy load book covers below fold
- Use srcset for responsive images
- Optimize image sizes: thumbnail (200px), full (400px)
- WebP format with JPEG fallback
- Blur placeholder while loading

### Loading Strategies
- Initial load: Show skeleton immediately
- Subsequent navigations: Instant tab switches
- Search: Debounce 300ms
- Infinite scroll: Load 20 cards at a time
- Cache Google Books results (session storage)

### Perceived Performance
- Optimistic UI updates
- Show success immediately, rollback on error
- Skeleton screens instead of spinners
- Progressive enhancement
- Prioritize above-fold content

---

## Design Deliverables Checklist

### Figma/Design Files Should Include:

**Foundations**
- [ ] Color palette with variables
- [ ] Typography scale and styles
- [ ] Spacing system (8px grid)
- [ ] Icon library (unified set)
- [ ] Shadow system (elevation levels)
- [ ] Border radius tokens

**Components**
- [ ] Buttons (all variants and states)
- [ ] Input fields (text, textarea, select, search)
- [ ] Cards (book and author variants)
- [ ] Navigation (header, tabs)
- [ ] Modals and overlays
- [ ] Toast notifications
- [ ] Loading states (spinners, skeletons)
- [ ] Empty states
- [ ] Error states

**Pages/Views**
- [ ] Books grid view (empty, populated, loading)
- [ ] Authors grid view (empty, populated, loading)
- [ ] Add Book form (empty, filled, errors, success)
- [ ] Add Author form
- [ ] Edit book modal
- [ ] Delete confirmation modal
- [ ] Search results dropdown
- [ ] 404 error page

**Responsive**
- [ ] Mobile versions (< 640px) of all key screens
- [ ] Tablet versions (640-1024px)
- [ ] Desktop versions (> 1024px)

**States**
- [ ] Hover states for all interactive elements
- [ ] Focus states (keyboard navigation)
- [ ] Active/pressed states
- [ ] Disabled states
- [ ] Loading states
- [ ] Error states
- [ ] Success states
- [ ] Empty states

**Documentation**
- [ ] Component usage guidelines
- [ ] Spacing examples
- [ ] Color contrast checks
- [ ] Accessibility notes
- [ ] Animation timing specifications

---

## Implementation Priority

### Phase 1: Core Visual Identity (Week 1)
1. Color palette implementation
2. Typography system
3. Base layout and grid
4. Navigation header
5. Tab system

### Phase 2: Essential Components (Week 1-2)
1. Book cards (grid display)
2. Author cards
3. Buttons and form inputs
4. Basic loading states

### Phase 3: Forms & Interactions (Week 2)
1. Add Book form
2. Add Author form
3. Google search dropdown
4. Form validation styles

### Phase 4: Advanced Features (Week 3)
1. Modals (edit, delete)
2. Toast notifications
3. Empty states
4. Error handling UI
5. Animations and transitions

### Phase 5: Polish & Responsive (Week 3-4)
1. Mobile responsive layouts
2. Tablet optimizations
3. Accessibility improvements
4. Performance optimizations
5. Micro-interactions

---

## Design System Example Code

### CSS Variables Setup
```css
:root {
  /* Colors */
  --color-cream: #FAF9F6;
  --color-white: #FFFFFF;
  --color-shadow: #E8E6E3;
  --color-forest: #2C5F4F;
  --color-sage: #8BA888;
  --color-terracotta: #C97C5D;
  --color-rich-black: #1A1A1A;
  --color-charcoal: #4A4A4A;
  --color-gray: #8B8B8B;
  --color-success: #4A8B6C;
  --color-warning: #D4A574;
  --color-error: #A3504F;
  
  /* Typography */
  --font-serif: 'Crimson Pro', 'Georgia', serif;
  --font-sans: 'Inter', 'Helvetica', sans-serif;
  
  /* Spacing */
  --space-xs: 0.75rem;   /* 12px */
  --space-sm: 1rem;      /* 16px */
  --space-md: 1.5rem;    /* 24px */
  --space-lg: 2rem;      /* 32px */
  --space-xl: 3rem;      /* 48px */
  
  /* Radius */
  --radius-sm: 0.25rem;  /* 4px */
  --radius-md: 0.5rem;   /* 8px */
  --radius-lg: 0.75rem;  /* 12px */
  --radius-xl: 1rem;     /* 16px */
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;
}
```

### Tailwind Config Extension
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        cream: '#FAF9F6',
        forest: '#2C5F4F',
        sage: '#8BA888',
        terracotta: '#C97C5D',
        charcoal: '#4A4A4A',
      },
      fontFamily: {
        serif: ['Crimson Pro', 'Georgia', 'serif'],
        sans: ['Inter', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'card-hover': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
    },
  },
}
```

---

## Final Notes for Designers

### Design Philosophy
Think of this as a **digital reading room** rather than a database. Every pixel should whisper "stay awhile" rather than "hurry up." Users should feel the same calm they experience when browsing a well-organized bookshelf.

### Inspiration References
- **Literal Club** - Warm, book-focused design