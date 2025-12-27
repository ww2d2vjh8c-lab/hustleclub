# Auth Functions Quick Reference

## TL;DR - Copy & Paste

### For Protected Pages (Dashboard, Creator Area, etc.)

```typescript
import { requireUser } from '@/lib/auth'

export default async function PageName() {
  const user = await requireUser()
  
  // Your page code here
  return <div>{user.email}</div>
}
```

### For Admin-Only Pages

```typescript
import { requireAdmin } from '@/lib/auth'

export default async function AdminPage() {
  const user = await requireAdmin()
  
  // Your admin code here
  return <div>Admin area</div>
}
```

### For Public Pages (Optional user info)

```typescript
import { getOptionalUser } from '@/lib/auth'

export default async function HomePage() {
  const user = await getOptionalUser()
  
  return (
    <div>
      {user ? <p>Hi {user.email}</p> : <p>Hello visitor</p>}
    </div>
  )
}
```

---

## Which Function to Use?

### requireUser()
- Use when: Page requires a logged-in user
- If not logged in: Redirects to `/auth/sign-in`
- Returns: User object (never null)
- Example pages:
  - `/dashboard`
  - `/dashboard/courses`
  - `/dashboard/profile`
  - Any creator/user-only page

### requireAdmin()
- Use when: Page requires admin role
- If not logged in: Redirects to `/auth/sign-in`
- If not admin: Redirects to `/dashboard`
- Returns: User object (never null)
- Example pages:
  - `/admin`
  - `/admin/users`
  - `/admin/reports`

### getOptionalUser()
- Use when: Page works for both logged-in and visitors
- If not logged in: Returns null (NO redirect)
- Returns: User object OR null
- Example pages:
  - `/` (homepage)
  - `/courses` (public courses)
  - `/about`
  - Any public page

---

## Important Rules

❌ **DON'T DO THIS:**
```typescript
'use client'
import { useEffect } from 'react'
import { useUser } from '@supabase/auth-helpers-react'

export default function Page() {
  const { user, isLoading } = useUser()
  
  useEffect(() => {
    if (!user) navigate('/signin')
  }, [user])
  
  return <div>Dashboard</div>
}
```

❌ **Problems with above:**
- Dashboard flashes briefly before redirect
- Bad user experience
- Not secure
- User sees protected content

✅ **DO THIS INSTEAD:**
```typescript
import { requireUser } from '@/lib/auth'

export default async function Page() {
  const user = await requireUser()
  
  return <div>Dashboard</div>
}
```

✅ **Why this is better:**
- Redirect happens before page renders
- No flash
- Secure
- Clean code

---

## Error Handling is Automatic

You don't need to handle errors. These functions handle them:

- **Supabase error?** → User is redirected
- **Network error?** → User is redirected
- **Invalid JWT?** → User is redirected
- **No session?** → User is redirected

Just call the function and use the result.

---

## TypeScript Types

```typescript
import { requireUser, requireAdmin, getOptionalUser } from '@/lib/auth'

// requireUser returns: User object (from Supabase)
const user = await requireUser()
// user.id: string
// user.email: string
// user.user_metadata: object
// etc.

// requireAdmin returns: User object (same as above)
const admin = await requireAdmin()
// Same type as requireUser()

// getOptionalUser returns: User object OR null
const userOrNull = await getOptionalUser()
// Type: User | null
```

---

## Common Patterns

### Get user's data from database

```typescript
import { requireUser } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export default async function Page() {
  const user = await requireUser()
  
  const supabase = await createSupabaseServerClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return <div>{profile.full_name}</div>
}
```

### Show different UI for logged-in users

```typescript
import { getOptionalUser } from '@/lib/auth'

export default async function Page() {
  const user = await getOptionalUser()
  
  return (
    <div>
      {user ? (
        <>
          <h1>Welcome {user.email}</h1>
          <Link href="/dashboard">Go to dashboard</Link>
        </>
      ) : (
        <>
          <h1>Welcome</h1>
          <Link href="/auth/sign-in">Sign in</Link>
        </>
      )}
    </div>
  )
}
```

### Create admin-only API

```typescript
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const user = await requireAdmin()
  
  // Only admins reach here
  return Response.json({
    message: `Hello admin ${user.email}`
  })
}
```

---

## Testing

### Test protected route (local)

```bash
# In private/incognito window (not logged in)
Visit: http://localhost:3000/dashboard
Expected: Redirected to /auth/sign-in
```

### Test admin route (local)

```bash
# As regular logged-in user
Visit: http://localhost:3000/admin
Expected: Redirected to /dashboard
```

### Test optional user (local)

```bash
# As visitor (not logged in)
Visit: http://localhost:3000/
Expected: See homepage (shows "Hello visitor")

# As logged-in user
Visit: http://localhost:3000/
Expected: See homepage (shows "Hello [email]")
```

---

## Migration Guide (If updating old code)

### Old way (❌ Don't use anymore):
```typescript
const supabase = await createSupabaseServerClient()
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  redirect('/auth/sign-in')
}
```

### New way (✅ Use instead):
```typescript
const user = await requireUser()
```

**Benefits:**
- Shorter code
- Reusable
- Consistent across app
- Easier to update security rules

---

## Locations

**Auth functions:** `lib/auth.ts`  
**Error handling:** `app/error.tsx`  
**404 handling:** `app/not-found.tsx`  
**Documentation:** `PLATFORM_SAFETY_NET.md`

---

## Still confused?

Look at existing pages for examples:
- `app/dashboard/page.tsx` - Uses requireUser()
- `app/dashboard/courses/page.tsx` - Uses requireUser()
- `app/courses/page.tsx` - Uses getOptionalUser() (if implemented)

Copy the pattern you need!
