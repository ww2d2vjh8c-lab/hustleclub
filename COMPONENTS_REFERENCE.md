# Component Quick Reference

## New Components Added

### 1. Navigation Component
**File:** `components/Navigation.tsx`  
**Type:** Client Component (`'use client'`)

**Props:**
```typescript
interface NavigationProps {
  session: boolean
}
```

**Usage:**
```tsx
<Navigation session={!!session} />
```

**Features:**
- Active link highlighting with `usePathname()`
- Responsive desktop/mobile menu
- Session-aware conditional rendering
- Logout button integration

---

### 2. CourseCard Component
**File:** `components/CourseCard.tsx`  
**Type:** Client Component (for potential future interactivity)

**Props:**
```typescript
interface CourseCardProps {
  id: string
  title: string
  description?: string
  price: number
  isPublished: boolean
  manageLinkHref?: string
  viewLinkHref?: string
}
```

**Usage:**
```tsx
<CourseCard
  id={course.id}
  title={course.title}
  description={course.description}
  price={course.price}
  isPublished={course.is_published}
  manageLinkHref={`/dashboard/courses/${course.id}`}
/>
```

**Features:**
- Reusable across dashboard and public pages
- Hover effects with shadow transitions
- Status badges (Draft/Published)
- Icon animations on hover

---

### 3. SubmitButton Component
**File:** `components/SubmitButton.tsx`  
**Type:** Client Component (`'use client'`)

**Props:**
```typescript
interface SubmitButtonProps {
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loadingText?: string
  variant?: 'primary' | 'danger' | 'success'
}
```

**Usage:**
```tsx
<SubmitButton
  variant="danger"
  loadingText="Unpublishing..."
>
  Unpublish Course
</SubmitButton>
```

**Features:**
- Uses `useFormStatus()` for pending state
- Prevents double submissions
- Animated spinner during loading
- Support for three variants (primary/danger/success)
- Disabled state while form is processing

---

## Existing Components Updated

### Layout Component
**File:** `app/layout.tsx`

**Changes:**
- Now uses `<Navigation>` component instead of inline nav
- Cleaner, more maintainable code
- Passes `session` boolean to Navigation
- Imports Navigation from components/

**Before:**
```tsx
{/* Navigation Bar */}
<nav className="sticky top-0 z-50 ...">
  {/* 50+ lines of nav code */}
</nav>
```

**After:**
```tsx
<Navigation session={!!session} />
```

---

### Dashboard Courses Page
**File:** `app/dashboard/courses/page.tsx`

**Changes:**
- Uses `CourseCard` component instead of inline cards
- Cleaner, more readable code
- Reuses component logic
- Consistent styling

**Before:**
```tsx
{courseList.map((course: any) => (
  <div key={course.id} className="...">
    {/* 30+ lines of card markup */}
  </div>
))}
```

**After:**
```tsx
{courseList.map((course: any) => (
  <CourseCard
    key={course.id}
    id={course.id}
    title={course.title}
    // ... props
  />
))}
```

---

### Course Manage Page
**File:** `app/dashboard/courses/[id]/page.tsx`

**Changes:**
- Uses `SubmitButton` instead of regular button
- Prevents double submissions
- Shows loading state during publish/unpublish
- Imports SubmitButton from components/

**Before:**
```tsx
<button
  type="submit"
  className={`... transition-colors`}
>
  {course.is_published ? 'Unpublish Course' : 'Publish Course'}
</button>
```

**After:**
```tsx
<SubmitButton
  variant={course.is_published ? 'danger' : 'success'}
  loadingText={course.is_published ? 'Unpublishing...' : 'Publishing...'}
>
  {course.is_published ? 'Unpublish Course' : 'Publish Course'}
</SubmitButton>
```

---

## Loading States

### Dashboard Courses Loading
**File:** `app/dashboard/courses/loading.tsx`

Displays skeleton loader while fetching creator's courses. Shows 6 skeleton cards matching the actual course card structure.

### Public Courses Loading  
**File:** `app/courses/loading.tsx`

Displays skeleton loader while fetching published courses. Includes hero section skeleton and 6 course card skeletons.

---

## Common Patterns Used

### 1. Form Submission with Server Actions
```tsx
<form action={toggleCoursePublish}>
  <input type="hidden" name="courseId" value={id} />
  <SubmitButton>
    Publish
  </SubmitButton>
</form>
```

### 2. Active Link Detection
```tsx
const pathname = usePathname()
const isActive = pathname.startsWith(href)
className={isActive ? 'bg-blue-100' : 'text-gray-700'}
```

### 3. Status Badge
```tsx
<span className={`px-3 py-1 rounded-full ${
  isPublished 
    ? 'bg-green-100 text-green-700'
    : 'bg-yellow-100 text-yellow-700'
}`}>
  {isPublished ? 'Published' : 'Draft'}
</span>
```

### 4. Empty State
```tsx
{list.length === 0 ? (
  <div className="bg-white rounded-lg p-12 text-center">
    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
      {/* Icon */}
    </div>
    <h3>No items yet</h3>
    <Link href="/create">Create Now</Link>
  </div>
) : (
  // List of items
)}
```

### 5. Skeleton Loading
```tsx
<div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse" />
```

---

## Styling Guidelines

### Tailwind Utility Classes Used
- `animate-pulse` - For skeleton loaders
- `transition-all` / `transition-colors` - Smooth transitions
- `hover:shadow-lg` - Hover effects
- `focus:ring-2 focus:ring-offset-2` - Focus states
- `disabled:opacity-50 disabled:cursor-not-allowed` - Disabled states
- `group hover:translate-x-0.5` - Icon animation

### Color Palette
- **Primary:** Blue-600 (`hover:blue-700`)
- **Success:** Green-600 for published
- **Warning:** Yellow-600 for drafts
- **Danger:** Red-600 for unpublish
- **Background:** Gray-50 for page, white for cards

---

## Best Practices Implemented

✅ **Server Components** - Used for data fetching and auth  
✅ **Server Actions** - All mutations via form submission  
✅ **Client Components** - Only for interactivity (nav, buttons)  
✅ **useFormStatus()** - Prevents double submissions  
✅ **usePathname()** - Active link detection  
✅ **Proper Type Safety** - Full TypeScript interfaces  
✅ **RLS Enforcement** - All data access validated on server  
✅ **Error Handling** - Redirects for auth failures  
✅ **Empty States** - User-friendly messages  
✅ **Loading States** - Skeleton loaders prevent flashing  

---

## Testing Component Integration

### Test Navigation Active Links
```bash
1. Visit http://localhost:3000/
   - "Home" link should be highlighted
2. Click "Courses"
   - "Courses" link should be highlighted
3. Click "Dashboard"
   - "Dashboard" link should be highlighted
```

### Test SubmitButton Loading State
```bash
1. Go to /dashboard/courses/[id]
2. Click "Publish Course"
   - Button should show spinner
   - Button should be disabled
   - Cannot click again
3. Wait for action to complete
   - Button re-enables
   - Course status updates
```

### Test Empty States
```bash
1. Create new account (no courses)
2. Visit /dashboard/courses
   - See "No courses yet" message
   - See "Create Your First Course" button
3. Click button
   - Navigate to /dashboard/courses/new
```

### Test Loading States
```bash
1. Slow throttle network (Chrome DevTools)
2. Navigate to /dashboard/courses or /courses
   - Skeleton loader appears
   - Matches layout of actual page
   - Disappears when content loads
```

---

## Troubleshooting

### Navigation not updating active state
- Ensure Navigation is a client component (`'use client'`)
- Check that `usePathname()` is being called
- Verify pathname matching logic handles root `/`

### SubmitButton not showing loading state
- Ensure form uses `action={serverAction}` 
- Don't use onClick handlers
- Check `useFormStatus()` is from `react-dom`

### CourseCard not rendering
- Verify all required props are passed
- Check `isPublished` is a boolean
- Ensure href props are strings

### Skeleton loader not showing
- Verify loading.tsx is in correct directory
- Check file exports a default function
- Ensure layout has `children` prop

---

## Performance Notes

- **Skeleton Loaders:** ~2KB minified, prevents CLS
- **Components:** Proper memoization via default exports
- **Form Actions:** Server-side validation, zero client overhead
- **Navigation:** usePathname() is fast, runs only on navigation
- **Course Cards:** Can be virtualized if >100 items

---

## Future Component Ideas

1. **PaginationButton** - For course listing pagination
2. **FormError** - Display form validation errors
3. **ToastNotification** - Already exists, integrate with forms
4. **SearchBox** - Course search with loading state
5. **FilterBar** - Category/price range filters
6. **Avatar** - User profile pictures
7. **Breadcrumbs** - Navigation hierarchy
8. **Modal** - Confirmations before dangerous actions

