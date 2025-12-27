import Link from "next/link"
import { createSupabaseServerClient } from "@/lib/supabase-server"

type ClippingJob = {
  id: string
  title: string
  description: string
  platform: string
  reward: number
  created_at: string
}

export default async function ClippingJobsPage() {
  const supabase = await createSupabaseServerClient()

  const { data: jobs } = await supabase
    .from("clipping_jobs")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false })

  const hasJobs = Array.isArray(jobs) && jobs.length > 0

  return (
    <div className="p-6 space-y-6">
      {/* HEADER — ALWAYS VISIBLE */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">UGC / Clipping Jobs</h1>

        {/* THIS BUTTON WILL ALWAYS SHOW */}
        <Link
          href="/dashboard/clipping/create"
          className="rounded-lg border border-black px-4 py-2 text-sm font-medium hover:bg-black hover:text-white transition"
        >
          + Create Job
        </Link>
      </div>

      {/* EMPTY STATE */}
      {!hasJobs && (
        <div className="rounded-xl border p-8 text-center">
          <h2 className="text-xl font-semibold">
            No clipping jobs available
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Brands and creators will post paid UGC clipping jobs here.
            Create the first job to start receiving applications.
          </p>

          <Link
            href="/dashboard/clipping/create"
            className="mt-4 inline-block rounded-lg border border-black px-5 py-2 text-sm font-medium hover:bg-black hover:text-white transition"
          >
            Create First Job
          </Link>
        </div>
      )}

      {/* JOB LIST */}
      {hasJobs && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs!.map((job: ClippingJob) => (
            <Link
              key={job.id}
              href={`/dashboard/clipping/${job.id}`}
              className="rounded-xl border p-5 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">{job.title}</h3>

              <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                {job.description}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="rounded bg-gray-100 px-2 py-1 text-xs">
                  {job.platform}
                </span>

                <span className="font-medium">
                  ₹{job.reward}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}