"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { deleteCourse } from "@/app/actions/deleteCourse"
import { toast } from "react-hot-toast"

export default function DeleteCourseButton({
  courseId,
}: {
  courseId: string
}) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    if (!confirm("Delete this course?")) return

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("courseId", courseId)

        await deleteCourse(formData)

        toast.success("Course deleted")
        router.push("/dashboard/courses")
        router.refresh()
      } catch {
        toast.error("Delete failed")
      }
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  )
}