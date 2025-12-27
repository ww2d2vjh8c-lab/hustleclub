import { createSupabaseServerClient } from "@/lib/supabase-server"
import PublishToggle from "@/components/PublishToggle"
import BackToDashboard from "@/components/BackToDashboard"
import DeleteCourseButton from "@/components/DeleteCourseButton"
interface PageProps {
  params: {
    id: string
  }
}

export default async function CoursePage({ params }: PageProps) {
  const supabase = await createSupabaseServerClient()

  const { data: course, error } = await supabase
    .from("courses")
    .select("id, title, description, price, is_published")
    .eq("id", params.id)
    .single()

  if (error || !course) {
    throw new Error("Course not found")
  }

  return (
    <div className="p-6">
      <BackToDashboard />

      <h1 className="text-2xl font-bold mt-4">{course.title}</h1>
      <p className="text-gray-600 mt-2">{course.description}</p>

      <div className="mt-4 flex items-center gap-4">
        <span className="font-semibold">
          ₹{typeof course.price === "number"
            ? course.price.toFixed(2)
            : "0.00"}
        </span>

        <PublishToggle
          courseId={course.id}
          isPublished={course.is_published}
        />
        <DeleteCourseButton courseId={course.id} />
      </div>
    </div>
  )
}
