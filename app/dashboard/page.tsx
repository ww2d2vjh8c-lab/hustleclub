import Link from "next/link"
import {
  BookOpen,
  ShoppingBag,
  Scissors,
  Globe,
  ArrowRight,
} from "lucide-react"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()

  const [{ count: courses }, { count: thrifts }, { count: jobs }] =
    await Promise.all([
      supabase.from("courses").select("*", { count: "exact", head: true }),
      supabase.from("thrift_items").select("*", { count: "exact", head: true }),
      supabase.from("clipping_jobs").select("*", { count: "exact", head: true }),
    ])

  return (
    <div className="p-6 space-y-10 max-w-6xl mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Everything you create, sell, and manage — in one place
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat title="Courses" value={courses ?? 0} />
        <Stat title="Thrift Listings" value={thrifts ?? 0} />
        <Stat title="Clipping Jobs" value={jobs ?? 0} />
      </div>

      {/* FEATURES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Feature
          icon={<BookOpen size={26} />}
          title="My Courses"
          description="Create structured learning content, publish courses, and earn from your knowledge."
          bullets={[
            "Create & edit courses",
            "Publish lessons",
            "Track enrollments",
          ]}
          href="/dashboard/courses"
        />

        <Feature
          icon={<ShoppingBag size={26} />}
          title="Thrifting"
          description="Buy and sell thrifted products directly on the platform."
          bullets={[
            "List thrift items",
            "Manage inventory",
            "Connect with buyers",
          ]}
          href="/dashboard/thrifting"
        />

        <Feature
          icon={<Scissors size={26} />}
          title="UGC / Clipping Jobs"
          description="Post paid UGC clipping jobs and manage creator applications."
          bullets={[
            "Create clipping jobs",
            "Review applications",
            "Pay per views or tasks",
          ]}
          href="/dashboard/clipping"
        />

        <Feature
          icon={<Globe size={26} />}
          title="Global News"
          description="Curated global opportunities, trends, and creator economy updates."
          bullets={[
            "Creator opportunities",
            "Platform updates",
            "Industry news",
          ]}
          disabled
        />
      </div>
    </div>
  )
}

/* ---------------- COMPONENTS ---------------- */

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl border p-4 bg-white">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}

function Feature({
  icon,
  title,
  description,
  bullets,
  href,
  disabled,
}: {
  icon: React.ReactNode
  title: string
  description: string
  bullets: string[]
  href?: string
  disabled?: boolean
}) {
  const Card = (
    <div
      className={`rounded-xl border p-6 h-full ${
        disabled ? "opacity-60" : "hover:shadow-md transition"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gray-100">{icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      <p className="text-sm text-gray-600 mt-3">{description}</p>

      <ul className="mt-4 space-y-1 text-sm text-gray-700 list-disc list-inside">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      {!disabled && (
        <div className="mt-5 inline-flex items-center text-sm font-medium">
          Open <ArrowRight size={16} className="ml-1" />
        </div>
      )}

      {disabled && (
        <p className="mt-5 text-sm text-gray-400">Coming soon</p>
      )}
    </div>
  )

  if (disabled) return Card

  return (
    <Link href={href!} className="block">
      {Card}
    </Link>
  )
}