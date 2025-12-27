import Link from "next/link"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { requireUser } from "@/lib/auth"
import CourseCard from "@/components/CourseCard"

type Course = {
  id: string
  title: string
  description: string | null
  price: number | null
  is_published: boolean
}

export default async function CoursesPage() {
  // 🔒 Protect route
  const user = await requireUser()

  // 🧠 Server-side Supabase
  const supabase = await createSupabaseServerClient()

  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, title, description, price, is_published")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Courses</h1>
          <p className="text-sm text-gray-500">
            {courses?.length ?? 0} courses
          </p>
        </div>

        <Link
          href="/dashboard/courses/new"
          className="underline text-sm"
        >
          + Create Course
        </Link>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {courses && courses.length > 0 ? (
          courses.map((course: Course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              price={course.price ?? 0}
              isPublished={course.is_published}
              manageLinkHref={`/dashboard/courses/${course.id}`}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">
            No courses yet. Create your first one.
          </p>
        )}
      </div>
    </div>
  )
}