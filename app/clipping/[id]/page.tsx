import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { getOptionalUser } from '@/lib/auth'
import { SubmitButton } from '@/components/SubmitButton'
import { applyForClippingJob } from '@/app/actions/applyForClippingJob'

interface JobDetailPageProps {
  params: Promise<{
    id: string
  }>
}

/**
 * Clipping Job Detail Page
 *
 * Shows:
 * - Job information
 * - Apply button (for users, shows if not applied)
 *
 * Security:
 * - Only shows active jobs
 * - Application enforced server-side
 */
export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id: jobId } = await params
  const user = await getOptionalUser()

  const supabase = await createSupabaseServerClient()

  // Fetch job (only active jobs are visible)
  const { data: job, error: jobError } = await supabase
    .from('clipping_jobs')
    .select(
      `
      id,
      title,
      description,
      payout,
      platform,
      user_id,
      is_active,
      created_at,
      profiles:user_id (username, full_name)
    `
    )
    .eq('id', jobId)
    .eq('is_active', true)
    .single()

  if (jobError || !job) {
    redirect('/clipping')
  }

  // If user is logged in, check if they've applied
  let hasApplied = false
  if (user) {
    const { data: application } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', user.id)
      .eq('job_id', jobId)
      .single()

    hasApplied = !!application
  }

  const creator = job.profiles as any
  const creatorName = creator?.full_name || creator?.username || 'Creator'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/clipping" className="text-blue-600 hover:text-blue-700">
            ← Back to Jobs
          </Link>
        </div>
      </div>

      {/* Job Detail */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {/* Header with Color Band */}
          <div className="h-1 bg-gradient-to-r from-green-500 to-green-600 mb-8 -mx-8 -mt-8 rounded-t-lg" />

          {/* Title and Platform */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {job.platform}
              </span>
              {job.is_active && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Active
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold text-gray-900">{job.title}</h1>
          </div>

          {/* Creator Info */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-green-600">
                  {creatorName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{creatorName}</p>
                <p className="text-sm text-gray-600">
                  Posted {new Date(job.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Job</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          )}

          {/* Payout and Application */}
          <div className="bg-gray-50 rounded-lg p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Payout</p>
              <p className="text-4xl font-bold text-gray-900">
                ${job.payout.toFixed(2)}
              </p>
            </div>

            {/* Application Status */}
            {!user ? (
              <div className="sm:text-right">
                <p className="text-gray-600 mb-4">Sign in to apply</p>
                <Link
                  href="/auth/sign-in"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors inline-block"
                >
                  Sign In to Apply
                </Link>
              </div>
            ) : hasApplied ? (
              <div className="sm:text-right">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-700 font-semibold">✓ Application Submitted</p>
                  <p className="text-green-600 text-sm mt-2">
                    Waiting for creator response
                  </p>
                </div>
              </div>
            ) : (
              <form action={applyForClippingJob} className="w-full sm:w-auto">
                <input type="hidden" name="jobId" value={jobId} />
                <SubmitButton
                  loadingText="Applying..."
                  className="w-full sm:w-auto bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  variant="primary"
                >
                  Apply Now
                </SubmitButton>
              </form>
            )}
          </div>

          {/* Tips Section */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Tips for Success</h3>
            <ul className="space-y-3 text-blue-800">
              <li className="flex items-start gap-3">
                <span className="text-xl">✓</span>
                <span>Read the job description carefully and follow all requirements</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✓</span>
                <span>Submit high-quality work that matches the creator's expectations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✓</span>
                <span>Be responsive and professional in your communication</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✓</span>
                <span>Complete your application and deliver on time</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
