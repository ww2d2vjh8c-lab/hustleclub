import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type Job = {
  id: string;
  title: string;
  platform: string;
  reward: number;
};

type Application = {
  id: string;
  status: string;
  clipping_jobs: Job[];   // 🔥 IT'S AN ARRAY
};

export default async function MyApplicationsPage() {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("clipping_applications")
    .select(`
      id,
      status,
      clipping_jobs (
        id,
        title,
        platform,
        reward
      )
    `);

  const apps: Application[] = data ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">My Applications</h1>

      {apps.map((app) => {
        const job = app.clipping_jobs?.[0]; // 👈 take the first related job

        return (
          <div
            key={app.id}
            className="border p-4 rounded bg-white shadow-sm space-y-2"
          >
            <p className="font-semibold">{job?.title ?? "Job"}</p>

            <p className="text-sm text-gray-600">
              Platform: {job?.platform}
            </p>

            <p className="text-sm">Reward: {job?.reward}</p>

            <p className="text-sm font-medium">
              Status: <span className="uppercase">{app.status}</span>
            </p>

            {job && (
              <Link
                href={`/dashboard/clipping/${job.id}/manage`}
                className="text-blue-600 text-sm underline mt-2 inline-block"
              >
                Manage
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}