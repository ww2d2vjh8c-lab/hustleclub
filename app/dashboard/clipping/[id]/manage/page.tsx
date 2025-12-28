import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/requireRole";
import { updateApplicationStatus } from "@/app/actions/clipping/updateApplicationStatus";
export default async function ManageJobPage({
  params,
}: {
  params: { id: string };
}) {
  await requireRole(["creator", "admin"]);

  const supabase = await createSupabaseServerClient();
  const { data: applications } = await supabase
    .from("clipping_applications")
    .select("*")
    .eq("job_id", params.id);

  return (
    <div className="space-y-4">
      {applications?.map((app) => (
        <div key={app.id} className="border p-4 rounded">
          <p>Email: {app.email}</p>
          <p>Status: {app.status}</p>

          <form action={updateApplicationStatus}>
            <input type="hidden" name="appId" value={app.id} />
            <input type="hidden" name="status" value="hired" />
            <button className="bg-green-600 text-white px-3 py-1 rounded">
              Hire
            </button>
          </form>

          <form action={updateApplicationStatus}>
            <input type="hidden" name="appId" value={app.id} />
            <input type="hidden" name="status" value="rejected" />
            <button className="bg-red-600 text-white px-3 py-1 rounded">
              Reject
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}