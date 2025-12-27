"use client"

import { useTransition } from "react"
import { toggleCoursePublish } from "@/app/actions/toggleCoursePublish"
import { toast } from "sonner"

interface PublishToggleProps {
  courseId: string
  isPublished: boolean
}

export default function PublishToggle({
  courseId,
  isPublished,
}: PublishToggleProps) {
  const [pending, startTransition] = useTransition()

  const handleToggle = () => {
    const formData = new FormData()
    formData.append("courseId", courseId)
    formData.append("nextState", String(!isPublished))

    startTransition(async () => {
      try {
        await toggleCoursePublish(formData)
        toast.success(
          !isPublished ? "Course published" : "Course unpublished"
        )
      } catch {
        toast.error("Failed to update publish status")
      }
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      className="px-3 py-1 text-sm border rounded"
    >
      {pending
        ? "Saving..."
        : isPublished
        ? "Unpublish"
        : "Publish"}
    </button>
  )
}