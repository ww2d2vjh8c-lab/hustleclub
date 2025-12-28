// app/dashboard/page.tsx
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getUserWithRole } from "@/lib/getUserWithRole";

import {
  BookOpen,
  Scissors,
  Store,
  LayoutDashboard,
  PlusCircle,
  Settings,
} from "lucide-react";

// Re-usable card
function FeatureCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="border rounded-xl p-5 hover:shadow-md transition bg-white space-y-2"
    >
      <div className="text-2xl">{icon}</div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </Link>
  );
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const userData = await getUserWithRole();

  const role = userData?.role || "user";
  const isCreator = role === "creator" || role === "admin";

  // Stats
  const [{ count: courseCount }, { count: thriftCount }, { count: jobCount }] =
    await Promise.all([
      supabase.from("courses").select("*", { count: "exact", head: true }),
      supabase.from("thrift_items").select("*", { count: "exact", head: true }),
      supabase.from("clipping_jobs").select("*", { count: "exact", head: true }),
    ]);

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">
          Manage learning, earning, and opportunities — all in one place.
        </p>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-xl bg-white">
          <p className="text-gray-500 text-sm">Courses</p>
          <p className="text-2xl font-bold">{courseCount || 0}</p>
        </div>

        <div className="p-4 border rounded-xl bg-white">
          <p className="text-gray-500 text-sm">Thrift Listings</p>
          <p className="text-2xl font-bold">{thriftCount || 0}</p>
        </div>

        <div className="p-4 border rounded-xl bg-white">
          <p className="text-gray-500 text-sm">Clipping Jobs</p>
          <p className="text-2xl font-bold">{jobCount || 0}</p>
        </div>
      </div>

      {/* FEATURES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FeatureCard
          title="Courses"
          description="Learn and manage your enrolled courses."
          href="/dashboard/courses"
          icon={<BookOpen />}
        />

        <FeatureCard
          title="Thrifting"
          description="Buy and sell quality thrifted items."
          href="/dashboard/thrifting"
          icon={<Store />}
        />

        <FeatureCard
          title="UGC / Clipping Jobs"
          description="Apply to paid UGC clipping jobs and start earning."
          href="/dashboard/clipping"
          icon={<Scissors />}
        />

        <FeatureCard
          title="Settings"
          description="Manage your profile, email, and preferences."
          href="/dashboard/profile"
          icon={<Settings />}
        />
      </div>

      {/* CREATOR TOOLS */}
      {isCreator && (
        <div className="space-y-3">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <LayoutDashboard size={18} /> Creator Tools
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/dashboard/clipping/create"
              className="border rounded-xl p-5 hover:shadow-md transition bg-indigo-50"
            >
              <div className="flex items-center gap-2 text-indigo-700 font-semibold">
                <PlusCircle size={18} />
                Post a Clipping Job
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Create paid editing jobs for creators.
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}