import Link from 'next/link'
import { requireUser } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import BackToDashboard from '@/components/BackToDashboard'
import { updateUsername } from '../../actions/updateUsername'

export default async function ProfilePage() {
  // Protect this page: must be authenticated
  const user = await requireUser()

  // Fetch user profile data
  const supabase = await createSupabaseServerClient()
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, email, username, full_name, role, created_at')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <BackToDashboard />
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
            <h2 className="text-lg font-semibold text-red-900">Error Loading Profile</h2>
            <p className="text-red-700 mt-2">We couldn't load your profile. Please try again.</p>
            <Link href="/dashboard" className="text-red-600 hover:text-red-700 mt-4 inline-block">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const createdDate = new Date(profile.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BackToDashboard />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Profile Info Section */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>

            <div className="space-y-6">
              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-900 font-medium">{profile.email || user.email}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">Your email is used for login and cannot be changed</p>
              </div>

              {/* Full Name (Display only) */}
              {profile.full_name && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-900 font-medium">{profile.full_name}</p>
                  </div>
                </div>
              )}

              {/* Role (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                        profile.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : profile.role === 'creator'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {profile.role?.charAt(0).toUpperCase() + profile.role?.slice(1) || 'User'}
                    </span>
                    <span className="text-xs text-gray-500">Your account type (managed by administrators)</span>
                  </div>
                </div>
              </div>

              {/* Member Since */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-900">{createdDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Username Section */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Username</h2>

            <form action={updateUsername} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  defaultValue={profile.username || ''}
                  placeholder="Choose a unique username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  minLength={3}
                  maxLength={30}
                  pattern="^[a-zA-Z0-9_-]+$"
                  title="Username can only contain letters, numbers, underscores, and hyphens"
                />
                <p className="text-xs text-gray-500 mt-1">
                  3-30 characters. Letters, numbers, underscores, and hyphens only.
                </p>
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Save Username
              </button>
            </form>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Need help?</h3>
          <p className="text-sm text-blue-700">
            Contact support if you need to change your email address or account information.
          </p>
        </div>
      </div>
    </div>
  )
}