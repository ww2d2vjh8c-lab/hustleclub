import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export default async function ClippingJobsPage() {
  const supabase = await createSupabaseServerClient()

  // Fetch active clipping jobs
  const { data: jobs, error: jobsError } = await supabase
    .from('clipping_jobs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (jobsError) {
    console.error('Error fetching clipping jobs:', jobsError.message)
  }

  const jobList = jobs || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">UGC Clipping Jobs</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Find clipping opportunities from creators who need help turning their long-form content into engaging clips.
          </p>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {jobList.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No jobs available yet</h3>
            <p className="text-gray-600 mb-8">Check back soon for new clipping opportunities</p>
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Back to Home
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{jobList.length}</span> job
                {jobList.length === 1 ? '' : 's'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobList.map((job: any) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200"
                >
                  {/* Job Header with Color Band */}
                  <div className="h-2 bg-gradient-to-r from-green-500 to-green-600" />

                  {/* Card Content */}
                  <div className="p-6">
                    {/* Platform Badge */}
                    <div className="mb-3">
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        {job.platform}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {job.title}
                    </h3>

                    {/* Description */}
                    {job.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {job.description}
                      </p>
                    )}

                    {/* Payout */}
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-green-600">
                        ${job.payout.toFixed(2)}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        {new Date(job.created_at).toLocaleDateString()}
                      </p>
                      <Link
                        href={`/clipping/${job.id}`}
                        className="text-green-600 hover:text-green-700 font-semibold text-sm inline-flex items-center gap-1 group transition-colors"
                      >
                        Apply
                        <svg
                          className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}