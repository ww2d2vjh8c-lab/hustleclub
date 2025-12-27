import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getUserWithRole } from "@/lib/getUserWithRole";

export default async function ClippingJobsPage() {
  const supabase = await createSupabaseServerClient();
  const userData = await getUserWithRole();

  const { data: jobs } = await supabase
    .from("clipping_jobs")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  const isCreator =
    userData?.role === "creator" || userData?.role === "admin";

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">UGC / Clipping Jobs</h1>
      <p className="text-gray-600">
        Manage and apply for paid clipping gigs.
      </p>

      {/* CREATOR SECTION — ONLY creators/admins see this */}
      {isCreator && (
        <div className="border rounded-md bg-gray-50 p-4">
          <Link
            href="/dashboard/clipping/create"
            className="text-blue-600 underline font-medium"
          >
            + Create Job
          </Link>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-4">
        {jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.id} className="border rounded-md p-4">
              <h3 className="font-semibold text-lg">{job.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {job.description}
              </p>

              <div className="flex justify-between mt-3">
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {job.platform}
                </span>

                <span className="font-medium">₹{job.reward}</span>
              </div>

              <Link
                className="inline-block mt-3 text-sm underline"
                href={`/dashboard/clipping/${job.id}`}
              >
                View Job →
              </Link>
            </div>
          ))
        ) : (
          <p>No clipping jobs available.</p>
        )}
      </div>
    </div>
  );
}