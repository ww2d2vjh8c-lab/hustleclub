// app/dashboard/clipping/page.tsx
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getUserWithRole } from "@/lib/getUserWithRole";

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "open"
      ? "bg-green-100 text-green-700"
      : status === "hired"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
      {status.toUpperCase()}
    </span>
  );
}

export default async function ClippingJobsPage() {
  const supabase = await createSupabaseServerClient();
  const userData = await getUserWithRole();

  const isCreator =
    userData?.role === "creator" || userData?.role === "admin";

  const { data: jobs } = await supabase
    .from("clipping_jobs")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">UGC / Clipping Jobs</h1>
          <p className="text-gray-600">
            Manage and apply for paid clipping gigs.
          </p>
        </div>

        {isCreator && (
          <Link
            href="/dashboard/clipping/create"
            className="px-4 py-2 rounded bg-indigo-600 text-white"
          >
            + Create Job
          </Link>
        )}
      </div>

      {!jobs?.length && (
        <p className="text-gray-500">No clipping jobs available.</p>
      )}

      <div className="space-y-4">
        {jobs?.map((job) => (
          <div
            key={job.id}
            className="border rounded-xl p-5 bg-white space-y-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{job.title}</h3>

              <StatusBadge status={job.status} />
            </div>

            <p className="text-gray-600 text-sm">{job.description}</p>

            <div className="text-sm text-gray-700">
              Platform: <strong>{job.platform}</strong>
            </div>

            <div className="text-sm">
              Reward: <strong>₹{job.reward}</strong>
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                href={`/dashboard/clipping/${job.id}`}
                className="px-3 py-1 rounded bg-gray-100"
              >
                View
              </Link>

              {job.status === "open" && (
                <Link
                  href={`/dashboard/clipping/${job.id}/apply`}
                  className="px-3 py-1 rounded bg-green-600 text-white"
                >
                  Apply
                </Link>
              )}

              {isCreator && (
                <Link
                  href={`/dashboard/clipping/${job.id}/manage`}
                  className="px-3 py-1 rounded bg-indigo-100 text-indigo-700"
                >
                  Manage
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}