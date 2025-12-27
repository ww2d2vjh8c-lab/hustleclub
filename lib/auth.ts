import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from './supabase-server'

/**
 * ============================================================
 * ROUTE PROTECTION UTILITIES
 * ============================================================
 *
 * These functions must be used in Server Components to protect
 * routes and ensure only authorized users can access them.
 *
 * IMPORTANT: These functions use Next.js redirect() which must
 * be called in a Server Component context. Do NOT call these
 * from client components.
 *
 * ============================================================
 */

/**
 * Require Authentication
 *
 * Use this function at the TOP of any page that requires a
 * logged-in user. If the user is not authenticated, they will
 * be redirected to /auth/sign-in immediately.
 *
 * IMPORTANT:
 * - This MUST be called in a Server Component (async)
 * - This MUST be called before any UI is rendered
 * - Do NOT wrap this in try-catch
 * - Do NOT use in client components
 *
 * @returns The authenticated user object if successful
 * @throws Redirects to /auth/sign-in if not authenticated
 *
 * @example
 * ```typescript
 * import { requireUser } from '@/lib/auth'
 *
 * export default async function DashboardPage() {
 *   const user = await requireUser()
 *   // User is guaranteed to exist here
 *   // If not authenticated, user is redirected to /auth/sign-in
 *
 *   return (
 *     <div>
 *       <h1>Welcome, {user.email}</h1>
 *     </div>
 *   )
 * }
 * ```
 */
export async function requireUser() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth/sign-in')
  }

  return user
}

/**
 * Require Admin Role
 *
 * Use this function at the TOP of any ADMIN-ONLY page. This
 * ensures the user is:
 * 1. Authenticated
 * 2. Has 'admin' role in the profiles table
 *
 * If the user is not an admin, they will be redirected to
 * /dashboard instead of /auth/sign-in (since they're already
 * logged in, just not authorized).
 *
 * IMPORTANT:
 * - This MUST be called in a Server Component (async)
 * - Role is fetched from the database (NOT client)
 * - Do NOT assume admin status on client
 * - Do NOT hardcode admin user IDs
 * - Do NOT bypass this check
 *
 * @returns The authenticated admin user object if successful
 * @throws Redirects to /auth/sign-in if not authenticated
 * @throws Redirects to /dashboard if not an admin
 *
 * @example
 * ```typescript
 * import { requireAdmin } from '@/lib/auth'
 *
 * export default async function AdminPage() {
 *   const user = await requireAdmin()
 *   // User is guaranteed to be an admin
 *
 *   return (
 *     <div>
 *       <h1>Admin Panel</h1>
 *     </div>
 *   )
 * }
 * ```
 */
export async function requireAdmin() {
  const supabase = await createSupabaseServerClient()

  // Step 1: Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    // Not logged in at all - redirect to sign-in
    redirect('/auth/sign-in')
  }

  // Step 2: Check if user is an admin by querying the database
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    // User doesn't have a profile in the database - not authorized
    redirect('/dashboard')
  }

  if (profile.role !== 'admin') {
    // User exists but is not an admin - not authorized
    redirect('/dashboard')
  }

  // Step 3: User is authenticated AND is an admin
  return user
}

/**
 * Get User (Optional)
 *
 * Use this function on pages that should show different content
 * based on whether the user is logged in or not. This function
 * does NOT redirect - it simply returns the user or null.
 *
 * IMPORTANT:
 * - This function does NOT redirect
 * - Safe to use on public pages
 * - Returns null if user is not authenticated
 * - Still uses Server Component context
 *
 * @returns The user object if authenticated, null otherwise
 *
 * @example
 * ```typescript
 * import { getOptionalUser } from '@/lib/auth'
 *
 * export default async function HomePage() {
 *   const user = await getOptionalUser()
 *
 *   return (
 *     <div>
 *       {user ? (
 *         <h1>Welcome back, {user.email}</h1>
 *       ) : (
 *         <h1>Welcome to our platform</h1>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export async function getOptionalUser() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user || null
}

/**
 * ============================================================
 * IMPLEMENTATION CHECKLIST
 * ============================================================
 *
 * Use this checklist when adding authentication to a page:
 *
 * For PROTECTED pages (/dashboard/*, /settings/*, etc.):
 *   ✓ Add this at the top: const user = await requireUser()
 *   ✓ This MUST be before UI rendering
 *   ✓ Page is a SERVER component (async)
 *   ✓ Remove any client-side auth checks
 *   ✓ Do NOT wrap in try-catch
 *
 * For ADMIN pages (/admin/*, /admin/*, etc.):
 *   ✓ Add this at the top: const user = await requireAdmin()
 *   ✓ This MUST be before UI rendering
 *   ✓ Page is a SERVER component (async)
 *   ✓ Remove any client-side role checks
 *   ✓ Database role is authoritative (not client)
 *
 * For PUBLIC pages (/, /about, /pricing, etc.):
 *   ✓ Use getOptionalUser() if you need to check auth status
 *   ✓ Or skip auth entirely (no function needed)
 *   ✓ Page can be server OR client component
 *   ✓ Show different content based on user presence
 *
 * ============================================================
 */
